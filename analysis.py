import unittest
import json

# ==========================================
# חלק 1: לוגיקה של ניתוח נתוני אבטחה
# ==========================================

def load_raw_data():
    """
    מדמה טעינה של נתוני אבטחה גלובליים.
    במציאות, כאן יבוא קוד שמושך נתונים מ-API או מקובץ JSON.
    """
    # נתונים לדוגמה: אירועי אבטחה במדינות שונות
    sample_data = [
        {"country": "Israel", "threat_level": "High", "type": "Cyber"},
        {"country": "USA", "threat_level": "Medium", "type": "Infrastructure"},
        {"country": "Japan", "threat_level": "Low", "type": "Cyber"}
    ]
    return sample_data

def process_security_data(data):
    """
    מנתח את הנתונים ומחזיר סיכום של רמות האיום.
    """
    if not data:
        return "No data to process."
    
    high_threats = [item for item in data if item['threat_level'] == 'High']
    summary = {
        "total_events": len(data),
        "high_priority_count": len(high_threats),
        "status": "Analysis Complete"
    }
    return summary

# ==========================================
# חלק 2: טסטים לבדיקת הקוד
# ==========================================

class TestGlobalSecurityAnalysis(unittest.TestCase):
    
    def setUp(self):
        """מכין נתונים לבדיקות"""
        self.mock_data = [
            {"country": "TestCountry", "threat_level": "High", "type": "Test"}
        ]

    def test_load_raw_data(self):
        """בודק שהנתונים נטענים בפורמט הנכון"""
        data = load_raw_data()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_process_security_data(self):
        """בודק שהעיבוד מחזיר את הסיכום הנכון"""
        result = process_security_data(self.mock_data)
        self.assertEqual(result["total_events"], 1)
        self.assertEqual(result["high_priority_count"], 1)
        self.assertEqual(result["status"], "Analysis Complete")

    def test_empty_data(self):
        """בודק טיפול במקרה של רשימה ריקה"""
        result = process_security_data([])
        self.assertEqual(result, "No data to process.")

# ==========================================
# חלק 3: הרצה (Main)
# ==========================================

if __name__ == "__main__":
    # כשהקובץ מורץ, הוא קודם כל מריץ את הטסטים
    print("--- Running Unit Tests ---")
    
    # יצירת אובייקט להרצת הטסטים וקבלת תוצאה
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestGlobalSecurityAnalysis)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # אם הטסטים עברו, נבצע הדגמה של הלוגיקה
    if result.wasSuccessful():
        print("\n--- Tests Passed! Executing Analysis ---")
        raw_data = load_raw_data()
        processed_summary = process_security_data(raw_data)
        print(f"Final Analysis Result: {json.dumps(processed_summary, indent=2)}")
    else:
        print("\n--- Tests Failed! Please check your code. ---")
        exit(1) # יציאה עם שגיאה כדי ש-GitHub Actions ידע שהטסט נכשל
