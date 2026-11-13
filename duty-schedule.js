'use strict';

// All groups use one uninterrupted eight-day cycle. A date is the duty's start
// date. Each anchor is MALAM 1; the 2–3 October 2026 reference is fixed.
const DUTY_ANCHOR = '2026-10-06';
const DUTY_GROUP_KEY = 'dinesan.andyking.group.v1';
const DUTY_GROUPS = Object.freeze({
  A: Object.freeze({ anchor: DUTY_ANCHOR, reference: 'Pagi 1–2' }),
  B: Object.freeze({ anchor: '2026-10-08', reference: 'Siang 1–2' }),
  C: Object.freeze({ anchor: '2026-10-02', reference: 'Malam 1–2' }),
  D: Object.freeze({ anchor: '2026-10-04', reference: 'Libur 1–2' })
});
const DUTY_CYCLE = Object.freeze(['MALAM', 'MALAM', 'SIANG', 'SIANG', 'PAGI', 'PAGI', 'LIBUR', 'LIBUR']);
const DUTY_NAMES = Object.freeze({ MALAM: 'Malam', SIANG: 'Siang', PAGI: 'Pagi', LIBUR: 'Libur' });
const validDutyGroup = value => typeof value === 'string' && Object.hasOwn(DUTY_GROUPS, value);
let activeDutyGroup = 'A';
let dutyGroupChanging = false;
try {
  const saved = localStorage.getItem(DUTY_GROUP_KEY);
  if (validDutyGroup(saved)) activeDutyGroup = saved;
} catch { /* Group A remains available when storage is blocked. */ }

function dutyForDate(value, group = activeDutyGroup) {
  const date = parseDate(value);
  if (!date || !validDutyGroup(group)) return null;
  const elapsed = Math.round((date.getTime() - parseDate(DUTY_GROUPS[group].anchor).getTime()) / 86400000);
  // JS remainder is negative before the anchor; normalize it to 0..7.
  const index = ((elapsed % DUTY_CYCLE.length) + DUTY_CYCLE.length) % DUTY_CYCLE.length;
  const shift = DUTY_CYCLE[index], occurrence = index % 2 + 1;
  return { date: value, group, index, shift, occurrence, label: `${DUTY_NAMES[shift]} ke-${occurrence}` };
}

function offsetDutyDate(value, days) {
  const date = parseDate(value);
  if (!date || !Number.isInteger(days)) return null;
  date.setUTCDate(date.getUTCDate() + days);
  const result = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  return parseDate(result) ? result : null;
}
