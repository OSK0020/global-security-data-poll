from .data_loader import load_raw_data
from .validator import validate_record

def process_security_data():
    raw = load_raw_data()
    return [r for r in raw if validate_record(r)]
