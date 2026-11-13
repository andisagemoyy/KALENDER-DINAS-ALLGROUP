'use strict';

const REPORT_MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
const reportCardCache = new Map();
let reportCardSync = 0;
let currentReportCard = null;

function reportCardKey(group = activeDutyGroup, identity = officer) {
  return `${group}:${identity.nipp}`;
}
function reportIsBusy() {
  return monthState.loading || monthState.importing || monthState.exporting || dutyGroupChanging;
}
async function readReportCard(key) {
  if (reportCardCache.has(key)) return reportCardCache.get(key);
  const db = await monthDatabase;
  if (!db) return null;
  return new Promise(resolve => {
    try {
      const request = db.transaction('reportCards', 'readonly').objectStore('reportCards').get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}
async function writeReportCard(key, record) {
  reportCardCache.set(key, record);
  const db = await monthDatabase;
  if (!db) return false;
  return new Promise(resolve => {
    try {
      const tx = db.transaction('reportCards', 'readwrite');
      const store = tx.objectStore('reportCards');
      if (record) store.put({ ...record, id: key }); else store.delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onabort = tx.onerror = () => resolve(false);
    } catch { resolve(false); }
  });
}
function updateReportCardControls() {
  const disabled = reportIsBusy() || !validOfficer(officer);
  $('reportCardInput').disabled = disabled;
  $('removeReportCard').disabled = disabled || !currentReportCard;
}
async function syncReportCard() {
  const token = ++reportCardSync;
  currentReportCard = null;
  updateReportCardControls();
  const record = validOfficer(officer) ? await readReportCard(reportCardKey()) : null;
  if (token !== reportCardSync) return;
  currentReportCard = record;
  $('reportCardStatus').textContent = record
    ? `${record.name} · Grup ${activeDutyGroup}, NIPP ${officer.nipp}`
    : 'Opsional · tampil di halaman kedua PDF.';
  updateReportCardControls();
}

async function validateReportImage(file) {
  if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name)) throw new Error('Pilih file gambar JPG, PNG, atau WebP.');
  if (file.size > 30 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 30 MB.');
  const image = await decodeMonthImage(file);
  image.close?.();
}
function isHandoverPdf(file, name = file.name || '') {
  return file.type === 'application/pdf' || /\.pdf$/i.test(name);
}
async function openHandoverPdf(file) {
  try {
    const pdf = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    if (!pdf.getPageCount()) throw new Error('Kosong');
    return pdf;
  } catch { throw new Error('PDF tidak bisa dibaca. Gunakan PDF yang tidak dikunci sandi.'); }
}
async function saveReportHandover(record, file) {
  if (!monthState.records.includes(record)) throw new Error('Tanggal rekap berubah. Pilih tanggal lagi.');
  if (reportHandoverIsLeave(record)) throw new Error('Tanggal LIBUR tidak dapat menerima serah terima.');
  updateMonthRecord(record, { handover: file, handoverName: file.name });
  await requestLocalPersistence();
  const saved = await flushMonthSaves();
  monthNotice(saved ? `Serah terima ${dateText(parseDate(record.date))} tersimpan dan masuk ke PDF bulanan.` : 'Dokumen serah terima masuk ke PDF sesi ini, tetapi belum tersimpan di perangkat.', !saved);
}
async function importReportHandover(record, file) {
  if (reportIsBusy() || !monthState.records.includes(record)) return;
  if (reportHandoverIsLeave(record)) { monthNotice('Tanggal LIBUR tidak dapat menerima serah terima.', true); return; }
  setMonthImporting(true);
  try {
    if (file.size > 30 * 1024 * 1024) throw new Error('Ukuran dokumen maksimal 30 MB.');
    if (isHandoverPdf(file)) await openHandoverPdf(file);
    else await validateReportImage(file);
    await saveReportHandover(record, file);
  } catch (error) { monthNotice(`Serah terima: ${error.message}`, true); }
  finally { setMonthImporting(false); }
}
async function removeReportHandover(record) {
  if (reportIsBusy() || !monthState.records.includes(record) || reportHandoverIsLeave(record) || !record.handover) return;
  setMonthImporting(true);
  try {
    updateMonthRecord(record, { handover: null, handoverName: '' });
    const saved = await flushMonthSaves();
    monthNotice(saved ? `Serah terima ${dateText(parseDate(record.date))} dihapus dari rekap.` : 'Dokumen dihapus dari PDF sesi ini, tetapi perubahan belum tersimpan di perangkat.', !saved);
  } finally { setMonthImporting(false); }
}
let handoverRenderedRows = null;
const handoverCards = new Map();
function syncHandoverWorkspace() {
  if ($('handoverWorkspace').hidden) return;
  const busy = reportIsBusy();
  $('handoverMonth').value = monthState.month || $('monthPicker').value;
  $('handoverMonth').disabled = busy;
  if (handoverRenderedRows !== monthState.records) {
    handoverRenderedRows = monthState.records;
    handoverCards.clear(); $('handoverGrid').replaceChildren();
    for (const record of monthState.records) {
      const item = document.createElement('article');
      item.className = 'handover-day';
      item.innerHTML = '<div class="handover-day-top"><h2></h2><span class="handover-shift"></span></div><p class="handover-file"></p><div class="handover-day-actions"><label class="button secondary"><span>Unggah dokumen</span><input type="file" accept="image/*,.pdf,application/pdf" hidden></label><button class="handover-live button secondary" type="button">Ambil foto</button><button class="handover-remove text-button" type="button">Hapus</button></div>';
      const dateLabel = dateText(parseDate(record.date));
      item.querySelector('h2').textContent = dateLabel;
      const input = item.querySelector('input'), remove = item.querySelector('.handover-remove'), live = item.querySelector('.handover-live');
      input.setAttribute('aria-label', `Dokumen serah terima ${dateLabel}`);
      live.setAttribute('aria-label', `Ambil foto serah terima ${dateLabel}`);
      live.addEventListener('click', () => openHandoverCamera(record, live));
      remove.setAttribute('aria-label', `Hapus serah terima ${dateLabel}`);
      input.addEventListener('change', async () => {
        if (input.files[0]) await importReportHandover(record, input.files[0]);
        input.value = '';
      });
      remove.addEventListener('click', () => removeReportHandover(record));
      handoverCards.set(record.date, { item, input, remove, live, shift: item.querySelector('.handover-shift'), status: item.querySelector('.handover-file'), actions: item.querySelector('.handover-day-actions'), uploadText: item.querySelector('label span') });
      $('handoverGrid').append(item);
    }
  }
  let filled = 0, workdays = 0;
  for (const record of monthState.records) {
    const row = handoverCards.get(record.date), leave = reportHandoverIsLeave(record);
    if (!leave) { workdays++; if (record.handover) filled++; }
    row.item.dataset.shift = leave ? 'LIBUR' : record.shift;
    row.shift.textContent = leave ? 'LIBUR' : record.shift;
    row.status.textContent = leave ? 'Libur · unggah dan kamera terkunci' : record.handover ? (record.handoverName || 'Dokumen terisi') : 'Belum ada dokumen';
    row.actions.hidden = leave;
    row.input.disabled = busy || leave;
    row.live.disabled = busy || leave;
    row.remove.disabled = busy || leave || !record.handover;
    row.remove.hidden = !record.handover;
    row.uploadText.textContent = record.handover ? 'Ganti dokumen' : 'Unggah dokumen';
  }
  $('handoverSummary').textContent = `Grup ${activeDutyGroup} · ${filled}/${workdays} tanggal dinas terisi`;
}
async function changeReportCard(file) {
  if (reportIsBusy() || !validOfficer(officer)) return;
  const key = reportCardKey();
  setMonthImporting(true);
  try {
    if (file) { await validateReportImage(file); await requestLocalPersistence(); }
    const saved = await writeReportCard(key, file ? { photo: file, name: file.name } : null);
    await syncReportCard();
    monthNotice(saved ? (file ? 'Smartcard tersimpan.' : 'Smartcard dihapus.') : 'Perubahan Smartcard berlaku untuk sesi ini; perangkat gagal menyimpan perubahan.', !saved);
  } catch (error) { monthNotice(`Smartcard: ${error.message}`, true); }
  finally { setMonthImporting(false); }
}

async function buildMonthlyReport({ month, group, identity, records, smartcard, onProgress, cancelled }) {
  const { PDFDocument, StandardFonts, rgb, degrees, pushGraphicsState, popGraphicsState, setCharacterSpacing } = PDFLib;
  const doc = await PDFDocument.create();
  const width = 841.89, height = 595.276;
  const unit = 'STASIUN JAKARTAKOTA', daop = 'DAOP 1 JAKARTA';
  const monthLabel = REPORT_MONTHS[Number(month.slice(5)) - 1];
  const year = month.slice(0, 4);
  doc.setTitle(`Laporan Kegiatan Pengoperasian - JAKK - ${month}`);
  doc.setSubject(`${unit} - ${daop} - Grup ${group}`);
  doc.setAuthor(identity.name);
  doc.setCreator('Dinesan Andyking');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const logos = await Promise.all(REPORT_LOGOS.map(data => doc.embedPng(data)));
  const black = rgb(0, 0, 0), blue = rgb(0, 0.4, 0.72), orange = rgb(1, 0.61, 0);
  const target = document.createElement('canvas');

  function checkCancelled() { if (cancelled?.()) throw new Error('EXPORT_CANCELLED'); }
  function text(page, value, x, y, size, { font = regular, tracking = 0, align = 'left', maxWidth = Infinity } = {}) {
    const text = [...String(value)].map(char => {
      if (/[\x00-\x1f\x7f]/.test(char)) return ' ';
      try { font.encodeText(char); return char; } catch { return '?'; }
    }).join('');
    const widthAt = size => font.widthOfTextAtSize(text, size) + Math.max(0, text.length - 1) * tracking;
    if (widthAt(size) > maxWidth) {
      const factor = maxWidth / widthAt(size);
      size *= factor; tracking *= factor;
    }
    const span = widthAt(size);
    if (align === 'center') x -= span / 2;
    if (align === 'right') x -= span;
    page.pushOperators(pushGraphicsState(), setCharacterSpacing(tracking));
    page.drawText(text, { x, y, size, font, color: black });
    page.pushOperators(popGraphicsState());
  }
  function line(page, x1, y1, x2, y2, color = black, thickness = 0.75) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
  }
  function drawLogos(page) {
    const positions = [[60, 522, 145], [(width - 127) / 2, 528, 127], [width - 138, 523, 83]];
    logos.forEach((image, i) => {
      const [x, y, w] = positions[i];
      page.drawImage(image, { x, y, width: w, height: w * image.height / image.width });
    });
  }
  function placeImage(page, image, left, bottom, boxWidth, boxHeight) {
    // Only the placement in PDF points is adjusted. The embedded pixels retain
    // their dimensions and the entire frame is visible.
    const size = image.scaleToFit(boxWidth, boxHeight);
    page.drawImage(image, { ...size, x: left + (boxWidth - size.width) / 2, y: bottom + (boxHeight - size.height) / 2 });
  }
  async function embedReportPhoto(blob) {
    const image = await decodeMonthImage(blob);
    try {
      drawCameraFrame(image, target.getContext('2d', { alpha: false }));
      return doc.embedJpg(await (await canvasBlob(target, 0.86)).arrayBuffer());
    } finally { image.close?.(); }
  }

  const cover = doc.addPage([width, height]); drawLogos(cover);
  text(cover, 'LAPORAN KEGIATAN PENGOPERASIAN', width / 2, 446, 20, { font: bold, tracking: 0.6, align: 'center' });
  text(cover, `BULAN ${monthLabel} TAHUN ${year}`, width / 2, 400, 18, { tracking: 0.65, align: 'center' });
  line(cover, 55, 375, width - 55, 375, blue, 1.4);
  [['NAMA', identity.name], ['NIPP', identity.nipp], ['JABATAN', identity.position], ['UNIT KERJA', unit], ['DAOP', daop]].forEach(([label, value], i) => {
    text(cover, label, 55, 317 - 39 * i, 14, { tracking: 0.4 });
    text(cover, ': ' + value, 165, 317 - 39 * i, 14, { tracking: 0.4, maxWidth: width - 220 });
  });
  line(cover, 55, 108, width - 55, 108, blue, 1.4);

  const cardPage = doc.addPage([width, height]);
  text(cardPage, 'SMARTCARD', width / 2, 540.276, 24, { font: bold, tracking: 0.7, align: 'center' });
  if (smartcard instanceof Blob) placeImage(cardPage, await embedReportPhoto(smartcard), 60, 55, width - 120, 463);

  const edges = [60, 133, 210, (210 + width - 60) / 2, width - 60];
  const bottom = 60, top = 488, headBottom = top - 25;
  const middle = (bottom + headBottom) / 2;
  const center = i => (edges[i] + edges[i + 1]) / 2;
  function placeHandoverPage(page, source, image) {
    const left = edges[3] + 5, boxWidth = edges[4] - left - 5;
    const boxHeight = headBottom - bottom - 10;
    const turns = (Math.round(source.getRotation().angle / 90) % 4 + 4) % 4;
    const w = image.width, h = image.height;
    const [rotatedWidth, rotatedHeight] = turns % 2 ? [h, w] : [w, h];
    const scale = Math.min(boxWidth / rotatedWidth, boxHeight / rotatedHeight);
    const [offsetX, offsetY] = [[0, 0], [0, w], [w, h], [h, 0]][turns];
    page.drawPage(image, {
      x: left + (boxWidth - rotatedWidth * scale) / 2 + offsetX * scale,
      y: bottom + 5 + (boxHeight - rotatedHeight * scale) / 2 + offsetY * scale,
      xScale: scale, yScale: scale, rotate: degrees(-turns * 90)
    });
  }
  let pageNumber = 0;
  for (let i = 0; i < records.length; i++) {
    checkCancelled();
    const record = records[i], leave = record.shift === 'LIBUR';
    onProgress?.(i, record.date);
    const attachment = !leave ? record.handover : null;
    const pages = attachment && isHandoverPdf(attachment, record.handoverName || '')
      ? (await openHandoverPdf(attachment)).getPages() : [];
    const parts = Math.max(1, pages.length);
    for (let part = 0; part < parts; part++) {
      checkCancelled();
      const page = doc.addPage([width, height]);
      drawLogos(page);
      page.drawRectangle({ x: edges[0], y: headBottom, width: edges[4] - edges[0], height: 25, color: orange });
      for (const x of edges) line(page, x, bottom, x, top);
      for (const y of [bottom, headBottom, top]) line(page, edges[0], y, edges[4], y);
      ['TANGGAL', 'KEGIATAN', 'DOKUMENTASI', 'SERAH TERIMA'].forEach((label, j) => {
        text(page, label, center(j), headBottom + 8, 10, { font: bold, tracking: 0.35, align: 'center' });
      });
      text(page, record.date.split('-').reverse().join('/'), center(0), middle - 4, 10, { tracking: 0.2, align: 'center' });
      if (leave || record.photo || attachment) {
        text(page, `DINAS ${identity.position}`, center(1), middle + 4, 10, { tracking: 0.3, align: 'center', maxWidth: 69 });
        text(page, record.shift, center(1), middle - 12, 10, { tracking: 0.3, align: 'center' });
      }
      if (leave) {
        for (const column of [2, 3]) text(page, 'LIBUR', center(column), middle - 4, 11, { tracking: 0.35, align: 'center' });
      } else {
        if (part === 0 && record.photo) {
          const image = await doc.embedJpg(await (await renderMonthBlob(record, identity, target, 0.86)).arrayBuffer());
          placeImage(page, image, edges[2] + 5, bottom + 5, edges[3] - edges[2] - 10, headBottom - bottom - 10);
        }
        checkCancelled();
        const source = pages[part];
        if (source?.node.Contents()) {
          const { x, y, width: w, height: h } = source.getCropBox();
          const image = await doc.embedPage(source, { left: x, bottom: y, right: x + w, top: y + h });
          placeHandoverPage(page, source, image);
        } else if (attachment && !pages.length) {
          placeImage(page, await embedReportPhoto(attachment), edges[3] + 5, bottom + 5, edges[4] - edges[3] - 10, headBottom - bottom - 10);
        }
      }
      if (parts > 1) text(page, `Serah terima ${part + 1}/${parts}`, center(3), 40, 9, { align: 'center' });
      text(page, String(++pageNumber), width - 70, 40, 9, { align: 'right' });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  checkCancelled();
  onProgress?.(records.length, '');
  return new Blob([await doc.save()], { type: 'application/pdf' });
}

async function exportMonthlyReport() {
  if (reportIsBusy() || $('exportMonthlyPdf').disabled) return;
  const identity = { ...officer }, month = monthState.month, group = activeDutyGroup;
  const records = monthState.records.map(record => ({ ...record, shift: reportHandoverIsLeave(record) ? 'LIBUR' : record.shift }));
  monthState.exporting = true; monthState.cancel = false; setMonthImporting(false);
  $('exportProgress').hidden = false; $('exportProgressBar').max = records.length; $('exportProgressBar').value = 0;
  $('exportProgressText').textContent = 'Menyiapkan sampul PDF…';
  try {
    const smartcard = (await readReportCard(reportCardKey(group, identity)))?.photo;
    const blob = await buildMonthlyReport({
      month, group, identity, records, smartcard, cancelled: () => monthState.cancel,
      onProgress: (count, date) => {
        $('exportProgressBar').value = count;
        $('exportProgressText').textContent = date ? `PDF ${count + 1}/${records.length} · ${date}` : 'Menyelesaikan PDF…';
      }
    });
    if (monthState.cancel) throw new Error('EXPORT_CANCELLED');
    monthDownload(blob, `Laporan-Kegiatan-JAKK-${identity.nipp}-${month}.pdf`);
    monthNotice(`PDF rekap ${REPORT_MONTHS[Number(month.slice(5)) - 1]} berhasil diunduh, termasuk dokumen serah terima yang terisi.`);
  } catch (error) {
    monthNotice(error.message === 'EXPORT_CANCELLED' ? 'Unduhan PDF dibatalkan. Draf tetap tersimpan.' : `Gagal membuat PDF: ${error.message}`, error.message !== 'EXPORT_CANCELLED');
  } finally {
    monthState.exporting = false; setMonthImporting(false); $('exportProgress').hidden = true;
  }
}

$('exportMonthlyPdf').addEventListener('click', exportMonthlyReport);
$('handoverExportPdf').addEventListener('click', exportMonthlyReport);
$('handoverMonth').addEventListener('change', async event => {
  if (reportIsBusy()) return;
  const value = event.target.value;
  if (!monthDates(value).length) { syncHandoverWorkspace(); return; }
  $('monthPicker').value = value;
  await chooseMonth(value);
});
$('reportCardInput').addEventListener('change', async event => {
  const input = event.target;
  if (input.files[0]) await changeReportCard(input.files[0]);
  input.value = '';
});
$('removeReportCard').addEventListener('click', () => changeReportCard(null));
updateMonthSummary();
syncReportCard();

syncHandoverWorkspace();
