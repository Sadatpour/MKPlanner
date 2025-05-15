# MKPlanner (by Mojtaba Sadatpour)

**یک افزونه کروم برای برنامه‌ریزی روزانه، مدیریت کارها، تقویم جلالی/میلادی، پومودورو، یادداشت سریع، شعر شاهنامه و...**

---

## معرفی (Introduction)

MKPlanner یک افزونه کروم با رابط کاربری مدرن و نئومورفیک است که امکانات زیر را ارائه می‌دهد:
- برنامه‌ریز روزانه و چک‌لیست
- تقویم جلالی/میلادی
- تایمر پومودورو
- یادداشت سریع
- نمایش شعر تصادفی از شاهنامه با معنی فارسی و انگلیسی
- حالت تاریک/روشن
- پشتیبانی از دو زبان فارسی و انگلیسی
- ذخیره‌سازی ابری (chrome.storage.sync) با fallback به localStorage

---

## نصب افزونه (How to Install)

1. این مخزن را دانلود یا کلون کنید:
   ```
   git clone https://github.com/yourusername/MKPlanner.git
   ```
2. وارد Chrome شوید و به صفحه افزونه‌ها بروید:
   ```
   chrome://extensions/
   ```
3. گزینه **Developer mode** را فعال کنید.
4. روی **Load unpacked** کلیک کنید و پوشه پروژه را انتخاب کنید.
5. افزونه MKPlanner به نوار ابزار شما اضافه می‌شود.

> **نکته:**
> - برای فعال‌سازی در حالت Incognito باید به صورت دستی از صفحه افزونه‌ها این گزینه را فعال کنید.
> - chrome_url_overrides فقط در حالت عادی (غیر Incognito) برای new tab کار می‌کند.

---

## نحوه استفاده (How to Use)

- روی آیکون افزونه کلیک کنید تا داشبورد باز شود.
- از منوی بالا می‌توانید زبان و تم را تغییر دهید.
- هر بخش (برنامه‌ریز، تقویم، پومودورو، یادداشت و...) به صورت جداگانه قابل استفاده است.
- شعر شاهنامه هر روز به صورت تصادفی نمایش داده می‌شود و با تغییر زبان، معنی انگلیسی یا فارسی نمایش داده می‌شود.
- داده‌های شما به صورت ابری ذخیره می‌شود و در صورت پر شدن quota به localStorage منتقل می‌شود.

---

## ویژگی‌ها (Features)

- **Daily Planner**: مدیریت کارهای روزانه با قابلیت افزودن، ویرایش و حذف
- **Jalali/Gregorian Calendar**: نمایش تاریخ شمسی و میلادی
- **Pomodoro Timer**: تایمر با دکمه‌های شروع، توقف و ریست (Start, Stop, Reset)
- **Quick Notes**: یادداشت سریع
- **Shahnameh Poetry**: نمایش شعر تصادفی با معنی فارسی و انگلیسی
- **Dark/Light Mode**: تغییر تم
- **i18n**: پشتیبانی کامل از فارسی و انگلیسی
- **Cloud Sync**: ذخیره‌سازی ابری با chrome.storage.sync

---

## نکات مهم (Notes)
- افزونه به صورت popup اجرا می‌شود و قابلیت new tab فقط در حالت عادی فعال است.
- برای استفاده در Incognito باید به صورت دستی فعال شود.
- اگر با خطای quota مواجه شدید، داده‌ها به صورت محلی ذخیره می‌شوند.
- برای گزارش باگ یا پیشنهاد، به [sadatpour.com](https://sadatpour.com) مراجعه کنید.

---

## Developer
- [Mojtaba Sadatpour](https://sadatpour.com)

---

### English

# MKPlanner (Moji Planner)
A modern Chrome extension for daily planning, Jalali/Gregorian calendar, Pomodoro timer, quick notes, random Shahnameh poetry, and more.

## Features
- Daily planner & checklist
- Jalali/Gregorian calendar
- Pomodoro timer (Start, Stop, Reset)
- Quick notes
- Random Shahnameh verse with Persian & English meaning
- Dark/Light mode
- Full i18n (English & Persian)
- Cloud sync (chrome.storage.sync with localStorage fallback)

## Installation
1. Download or clone this repo:
   ```
   git clone https://github.com/yourusername/MKPlanner.git
   ```
2. Go to Chrome extensions page:
   ```
   chrome://extensions/
   ```
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. MKPlanner will appear in your toolbar.

> **Note:**
> - To use in Incognito, enable it manually from the extensions page.
> - chrome_url_overrides for new tab only works in normal mode, not Incognito.

## Usage
- Click the extension icon to open the dashboard.
- Change language and theme from the top menu.
- Each section (planner, calendar, pomodoro, notes, poetry) is independent.
- A random Shahnameh verse is shown daily, with meaning in the selected language.
- Your data is synced to the cloud, with local fallback if quota is exceeded.

## Support
For bug reports or suggestions, visit [sadatpour.com](https://sadatpour.com) 