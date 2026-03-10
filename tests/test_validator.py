import unittest
from src.validator import validate_record

class TestValidator(unittest.TestCase):
    def test_valid_record(self):
        self.assertTrue(validate_record({"id": 1, "threat_level": "high"}))
