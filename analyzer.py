# Main entry point for the security analysis
from src.core import process_security_data
from src.utils import log_info

def main():
    log_info("Starting Security Analysis Engine...")
    results = process_security_data()
    print(f"Analysis Complete: {len(results)} events processed.")

if __name__ == "__main__":
    main()
