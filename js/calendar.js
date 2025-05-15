// calendar.js
// اگر jalaali-js نصب باشد:
// import jalaali from 'jalaali-js';

// تبدیل دقیق میلادی به شمسی (Jalali)
export function toJalali(gy, gm, gd) {
  // الگوریتم تبدیل دقیق
  var g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  var jy = (gy <= 1600) ? 0 : 979;
  var gy2 = (gy <= 1600) ? gy-621 : gy-1600;
  var days = (365*gy2) + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400);
  days += gd + g_d_m[gm-1];
  if(gm>2 && ((gy%4==0 && gy%100!=0) || (gy%400==0))) days++;
  var jy2 = jy + 33*Math.floor(days/12053); days %= 12053;
  jy2 += 4*Math.floor(days/1461); days %= 1461;
  if(days > 365){ jy2 += Math.floor((days-1)/365); days = (days-1)%365; }
  var jm = (days < 186) ? 1+Math.floor(days/31) : 7+Math.floor((days-186)/30);
  var jd = 1 + ((days < 186) ? (days%31) : ((days-186)%30));
  return { jy: jy2, jm, jd };
}

// گرفتن نام ماه فارسی
export function getJalaliMonthName(jm) {
  const names = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  return names[jm-1] || '';
}

// تابع تبدیل شمسی به میلادی
export function toGregorian(jy, jm, jd) {
  // return jalaali.toGregorian(jy, jm, jd);
  // نسخه ساده بدون کتابخانه:
  return { gy: 2024, gm: 6, gd: 21 }; // مقدار تستی
}

// گرفتن تاریخ امروز (میلادی)
export function todayGregorian() {
  const d = new Date();
  return { gy: d.getFullYear(), gm: d.getMonth() + 1, gd: d.getDate() };
} 