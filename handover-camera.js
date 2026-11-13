'use strict';

const handoverDialog = $('handoverCameraDialog');
const handoverVideo = $('handoverCameraVideo');
let handoverCameraSession = null;

function isCurrentHandoverCamera(session) {
  return handoverCameraSession === session && handoverDialog.open;
}

function stopHandoverCameraStream(session) {
  const stream = session.stream;
  session.stream = null;
  session.ready = false;
  handoverVideo.srcObject = null;
  stream?.getTracks().forEach(track => track.stop());
  $('captureHandoverPhoto').disabled = true;
}

function updateHandoverCameraSize() {
  if (!handoverVideo.videoWidth || !handoverVideo.videoHeight) return;
  syncCameraStage({ width: handoverVideo.videoWidth, height: handoverVideo.videoHeight }, $('handoverCameraStage'));
}

function showHandoverCameraError(session, message) {
  if (!isCurrentHandoverCamera(session)) return;
  stopHandoverCameraStream(session);
  $('handoverCameraWait').hidden = false;
  $('handoverCameraWait').textContent = 'Kamera belakang belum aktif';
  $('handoverCameraMessage').textContent = message;
  $('retryHandoverCamera').hidden = false;
}

async function requestRearCamera() {
  const devices = navigator.mediaDevices;
  if (!devices?.getUserMedia) throw new Error('SECURE_CONTEXT_REQUIRED');
  const supported = devices.getSupportedConstraints?.();
  if (supported && !supported.facingMode) throw new Error('REAR_CAMERA_UNAVAILABLE');
  const video = { facingMode: { exact: 'environment' } };
  if (supported?.resizeMode) video.resizeMode = { exact: 'none' };
  try {
    return await devices.getUserMedia({ video, audio: false });
  } catch (error) {
    if (error.name !== 'OverconstrainedError' || !video.resizeMode || (error.constraint && error.constraint !== 'resizeMode')) throw error;
    // A browser may reject resizeMode; keep the rear lens constraint mandatory.
    delete video.resizeMode;
    return devices.getUserMedia({ video, audio: false });
  }
}

async function startHandoverCamera(session) {
  if (!isCurrentHandoverCamera(session) || session.opening || session.saving) return;
  session.opening = true;
  $('retryHandoverCamera').hidden = true;
  $('handoverCameraWait').hidden = false;
  $('handoverCameraWait').textContent = 'Membuka kamera belakang…';
  $('handoverCameraMessage').textContent = 'Izinkan akses kamera untuk mengambil foto serah terima.';
  try {
    const stream = await requestRearCamera();
    if (!isCurrentHandoverCamera(session)) { stream.getTracks().forEach(track => track.stop()); return; }
    session.stream = stream;
    const track = stream.getVideoTracks()[0];
    if (!track || track.getSettings().facingMode === 'user') throw new Error('REAR_CAMERA_UNAVAILABLE');
    track.addEventListener('ended', () => {
      if (session.stream === stream) showHandoverCameraError(session, 'Kamera berhenti. Coba lagi atau unggah foto dari perangkat.');
    }, { once: true });
    handoverVideo.srcObject = stream;
    await handoverVideo.play();
    if (!isCurrentHandoverCamera(session) || session.stream !== stream) return;
    if (!handoverVideo.videoWidth || !handoverVideo.videoHeight) throw new Error('FRAME_UNAVAILABLE');
    updateHandoverCameraSize();
    session.ready = true;
    $('handoverCameraWait').hidden = true;
    $('captureHandoverPhoto').disabled = false;
    $('handoverCameraMessage').textContent = session.record.handover
      ? 'Tanpa timestamp. Menyimpan foto ini akan mengganti dokumen pada tanggal tersebut.'
      : 'Foto disimpan tanpa timestamp ke tanggal yang dipilih.';
  } catch (error) {
    const errors = {
      NotAllowedError: 'Akses kamera ditolak. Izinkan kamera di pengaturan situs atau gunakan Unggah dokumen.',
      NotFoundError: 'Kamera belakang tidak ditemukan. Gunakan Unggah dokumen.',
      OverconstrainedError: 'Kamera belakang tidak tersedia. Gunakan Unggah dokumen.',
      NotReadableError: 'Kamera tidak bisa dibuka. Tutup aplikasi lain yang memakai kamera, lalu coba lagi.',
      SECURE_CONTEXT_REQUIRED: 'Buka situs melalui HTTPS untuk memakai kamera, atau gunakan Unggah dokumen.',
      REAR_CAMERA_UNAVAILABLE: 'Kamera belakang tidak tersedia. Gunakan Unggah dokumen.'
    };
    showHandoverCameraError(session, errors[error.name] || errors[error.message] || 'Kamera belum bisa digunakan. Coba lagi atau unggah foto.');
  } finally { session.opening = false; }
}

function openHandoverCamera(record, trigger) {
  if (reportIsBusy() || handoverCameraSession || !monthState.records.includes(record)) return;
  if (reportHandoverIsLeave(record)) { monthNotice('Tanggal LIBUR tidak dapat menerima serah terima.', true); return; }
  const session = { record, trigger, stream: null, opening: false, ready: false, saving: false };
  $('handoverCameraDate').textContent = `${dateText(parseDate(record.date))} · Grup ${activeDutyGroup}`;
  syncCameraStage({ width: 4, height: 3 }, $('handoverCameraStage'));
  handoverDialog.showModal();
  handoverCameraSession = session;
  setMonthImporting(true);
  startHandoverCamera(session);
}

async function captureHandoverPhoto() {
  const session = handoverCameraSession;
  if (!session || !isCurrentHandoverCamera(session) || !session.ready || session.saving) return;
  if (reportHandoverIsLeave(session.record)) {
    monthNotice('Tanggal LIBUR tidak dapat menerima serah terima.', true);
    handoverDialog.close();
    return;
  }
  session.saving = true;
  $('closeHandoverCamera').disabled = true;
  $('captureHandoverPhoto').disabled = true;
  $('handoverCameraMessage').textContent = 'Menyimpan foto serah terima…';
  try {
    if (handoverVideo.readyState < 2 || !handoverVideo.videoWidth || !handoverVideo.videoHeight) throw new Error('Foto belum siap. Coba lagi.');
    const frame = document.createElement('canvas');
    // Copy the original frame, with no text, logo, mirroring, or crop.
    drawCameraFrame(handoverVideo, frame.getContext('2d', { alpha: false }));
    stopHandoverCameraStream(session);
    const blob = await canvasBlob(frame);
    const file = new File([blob], `SERAH-TERIMA-${session.record.date}.jpg`, { type: 'image/jpeg' });
    await saveReportHandover(session.record, file);
    handoverDialog.close();
  } catch (error) {
    showHandoverCameraError(session, error.message || 'Foto gagal disimpan. Coba lagi.');
  } finally {
    session.saving = false;
    $('closeHandoverCamera').disabled = false;
  }
}

$('captureHandoverPhoto').addEventListener('click', captureHandoverPhoto);
$('retryHandoverCamera').addEventListener('click', () => {
  if (handoverCameraSession) startHandoverCamera(handoverCameraSession);
});
$('closeHandoverCamera').addEventListener('click', () => handoverDialog.close());
handoverDialog.addEventListener('cancel', event => { if (handoverCameraSession?.saving) event.preventDefault(); });
handoverDialog.addEventListener('close', () => {
  const session = handoverCameraSession;
  if (!session) return;
  handoverCameraSession = null;
  stopHandoverCameraStream(session);
  setMonthImporting(false);
  session.trigger?.focus({ preventScroll: true });
});
handoverVideo.addEventListener('resize', updateHandoverCameraSize);
window.addEventListener('pagehide', () => {
  if (handoverCameraSession && !handoverCameraSession.saving) handoverDialog.close();
});
