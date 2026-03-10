import unittest

# --- חלק 1: הלוגיקה של האפליקציה ---

def load_raw_data():
    """טוען נתונים גולמיים"""
    return {"status": "success", "data": "global_security_info"}

def process_security_data():
    """מעבד את הנתונים"""
    data_source = load_raw_data()
    return f"Processed: {data_source['data']}"


# --- חלק 2: הטסטים (נמצאים באותו קובץ) ---

class TestSecurityAnalysis(unittest.TestCase):
    def test_load_data(self):
        result = load_raw_data()
        self.assertEqual(result["status"], "success")

    def test_process_data(self):
        result = process_security_data()
        self.assertIn("global_security_info", result)

# --- חלק 3: הרצה ---

if __name__ == "__main__":
    # השורה הזו גורמת לכך שהרצת הקובץ תריץ את הטסטים אוטומטית
    unittest.main()
