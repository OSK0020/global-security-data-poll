Global Security Data Analysis 🛡️

פרויקט זה נועד לנתח נתוני אבטחה גלובליים, לזהות דפוסים של איומי סייבר ולהפיק דוחות מפורטים.

מבנה הפרויקט (20 קבצים)

הפרויקט מחולק בצורה מודולרית כדי לאפשר תחזוקה קלה והרחבה עתידית:

README.md - קובץ זה.

.github/workflows/pipeline.yml - אוטומציה של בדיקות וניתוח.

requirements.txt - רשימת ספריות חיצוניות.

.gitignore - הגדרת קבצים שאינם לגיטהאב.

LICENSE - רישיון הפרויקט.

main.py - נקודת הכניסה הראשית לתוכנה.

config.py - הגדרות קונפיגורציה.

src/fetcher.py - מודול משיכת נתונים.

src/processor.py - מודול עיבוד נתונים ראשוני.

src/analyzer.py - לוגיקת ניתוח אבטחה.

src/exporter.py - ייצוא תוצאות לקבצים.

utils/logger.py - ניהול רישום לוגים.

utils/helpers.py - פונקציות עזר כלליות.

utils/validators.py - אימות תקינות נתונים.

data/raw_incidents.json - נתוני דוגמה גולמיים.

data/geo_mapping.json - מיפוי גיאוגרפי של איומים.

tests/test_core.py - בדיקות יחידה לליבת המערכת.

tests/test_utils.py - בדיקות לפונקציות העזר.

docs/architecture.md - הסבר על ארכיטקטורת המערכת.

docs/user_guide.md - מדריך למשתמש הקצה.

הרצה

כדי להריץ את הפרויקט, השתמשו בפקודה:

python main.py
