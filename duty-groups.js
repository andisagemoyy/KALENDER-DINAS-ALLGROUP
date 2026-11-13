'use strict';

function syncDutyGroupControls() {
  $('dutyGroup').value = activeDutyGroup;
  $('dutyGroup').disabled = dutyGroupChanging || monthState.loading || monthState.importing || monthState.exporting || dayCamera.saving || singleRestoring;
  $('dutyGroupSummary').textContent = `Grup ${activeDutyGroup} · 2–3 Oktober 2026: ${DUTY_GROUPS[activeDutyGroup].reference}`;
  $('dutyAnchor').textContent = `Grup ${activeDutyGroup}: 2–3 Oktober 2026 = ${DUTY_GROUPS[activeDutyGroup].reference}. Pola berulang ke depan dan ke belakang.`;
}

async function changeDutyGroup(group) {
  if (!validDutyGroup(group)) { syncDutyGroupControls(); return false; }
  if (group === activeDutyGroup) { syncDutyGroupControls(); return true; }
  if (dutyGroupChanging || monthState.loading || monthState.importing || monthState.exporting || dayCamera.saving || singleRestoring) {
    syncDutyGroupControls();
    $('dutyGroupStatus').textContent = 'Tunggu proses foto atau kalender selesai sebelum mengganti grup.';
    return false;
  }
  dutyGroupChanging = true; syncDutyGroupControls();
  $('dutyGroupStatus').textContent = 'Menyimpan draf dan membuka grup pilihan…';
  try {
    const monthSaved = await flushMonthSaves();
    const singleSaved = await saveSingleDraft();
    if (!monthSaved || (!singleSaved && photo)) {
      $('dutyGroupStatus').textContent = 'Grup belum diganti karena draf belum berhasil disimpan. Unduh fotomu dan periksa penyimpanan perangkat.';
      return false;
    }
    let persisted = true;
    try { localStorage.setItem(DUTY_GROUP_KEY, group); } catch { persisted = false; }
    if ($('photoDialog').open) $('photoDialog').close();
    closeMonthPreview();
    if ($('dayCameraDialog').open) $('dayCameraDialog').close();
    stopDayCameraTracks(); dayCamera.record = null;
    if ($('dutyEditorDialog').open) $('dutyEditorDialog').close();
    dutyEditorDate = '';
    activeDutyGroup = group; loadDutyPlans();
    $('defaultShift').value = 'AUTO';
    clearSingleDraft(); syncDutyGroupControls();
    await chooseMonth(monthState.month || $('monthPicker').value);
    await restoreSingleDraft();
    refreshDutyReminders(); renderDutySearchResult(); renderDutyCalendar();
    $('dutyGroupStatus').textContent = persisted
      ? `Grup ${group} dipilih dan tersimpan. Kalender, timestamp, serta pengingat mengikuti grup ini.`
      : `Grup ${group} dipakai untuk sesi ini. Penyimpanan pilihan grup belum tersedia.`;
    return true;
  } finally {
    dutyGroupChanging = false; syncDutyGroupControls();
    if (typeof updateReportCardControls === 'function') updateReportCardControls();
    if (typeof syncHandoverWorkspace === 'function') syncHandoverWorkspace();
    checkDutyNotifications();
  }
}

async function openDutyLink(date, group) {
  if (!dutyForDate(date)) return;
  while (monthState.loading || dutyGroupChanging) await new Promise(resolve => setTimeout(resolve, 100));
  if (validDutyGroup(group) && group !== activeDutyGroup && !await changeDutyGroup(group)) return;
  await selectDutyDate(date);
}

$('dutyGroup').addEventListener('change', event => { changeDutyGroup(event.target.value); });
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', event => {
  if (event.data?.type === 'open-duty-date') openDutyLink(event.data.date, event.data.group);
});
const linkedDutyUrl = new URL(location.href);
if (dutyForDate(linkedDutyUrl.searchParams.get('tanggal'))) openDutyLink(linkedDutyUrl.searchParams.get('tanggal'), linkedDutyUrl.searchParams.get('grup'));
syncDutyGroupControls();
