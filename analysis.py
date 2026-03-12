import unittest
import os
import feedparser
import webbrowser
import requests
from bs4 import BeautifulSoup
import datetime

# ==========================================
# PART 1: REAL-TIME WEB SCRAPING LOGIC
# ==========================================

def scrape_security_news():
    """
    סורק נתונים מ-RSS Feed של חדשות עולמיות
    """
    print(">>> INITIATING RSS FEED ANALYSIS...")
    
    # כתובת ה-RSS של רויטרס (חדשות עולם)
    rss_url = "https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best"
    
    security_events = []
    keywords = ['security', 'attack', 'military', 'cyber', 'war', 'threat', 'intelligence', 'conflict', 'missile', 'drone']
    
    try:
        # קריאת ה-Feed
        feed = feedparser.parse(rss_url)
        
        # מעבר על הכתבות האחרונות (לרוב ה-20 האחרונות)
        for entry in feed.entries:
            title = entry.title
            summary = entry.summary if 'summary' in entry else ""
            combined_text = (title + " " + summary).lower()
            
            # בדיקה אם אחת ממילות המפתח מופיעה בכותרת או בתיאור
            if any(key in combined_text for key in keywords):
                threat_level = "High" if any(x in combined_text for x in ['attack', 'war', 'killed', 'explosion']) else "Medium"
                
                security_events.append({
                    "country": "Global Node",
                    "threat_level": threat_level,
                    "type": "RSS Live Alert",
                    "description": title[:75] + "..."
                })

        # אם ה-RSS ריק או לא נגיש, נשתמש בגיבוי
        if not security_events:
            print(">>> NO RELEVANT SECURITY NEWS FOUND IN FEED.")
            return load_fallback_data()
            
        print(f">>> SUCCESSFULLY EXTRACTED {len(security_events)} EVENTS.")
        return security_events

    except Exception as e:
        print(f">>> RSS READ ERROR: {e}")
        return load_fallback_data()

def load_fallback_data():
    return [{"country": "System", "threat_level": "Low", "type": "Internal", "description": "No live threats detected in current cycle."}]

# ==========================================
# PART 2: PROCESSING & NASA UI GENERATION
# ==========================================

def process_security_data(data):
    critical_count = len([item for item in data if item['threat_level'] == 'High'])
    return {
        "total_nodes": len(data),
        "alert_level": "ALPHA-RED" if critical_count > 0 else "BRAVO-YELLOW",
        "critical_incidents": critical_count,
        "system_status": "OPERATIONAL / LIVE_FEED"
    }

def generate_nasa_report(summary, raw_data):
    # (העיצוב המטורף של נאס"א ממקודם - מעודכן לנתונים האמיתיים)
    alert_color = "#ff0055" if "ALPHA" in summary["alert_level"] else "#00d2ff"
    
    rows = ""
    for item in raw_data:
        color = "#ff0055" if item['threat_level'] == "High" else "#00ff99"
        rows += f"""
        <tr>
            <td>{item['country']}</td>
            <td style="color: {color}; text-shadow: 0 0 10px {color};">{item['threat_level'].upper()}</td>
            <td>{item['type']}</td>
            <td style="font-size: 0.8em; opacity: 0.8;">{item['description']}</td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>OSN COMMAND CENTER</title>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
        <style>
            body {{ background: #050a0f; color: white; font-family: 'Share Tech Mono', monospace; padding: 40px; }}
            .container {{ max-width: 1000px; margin: auto; border-left: 5px solid {alert_color}; padding-left: 20px; }}
            .stats {{ display: flex; gap: 20px; margin: 30px 0; }}
            .card {{ background: rgba(16, 25, 39, 0.8); border: 1px solid rgba(0, 210, 255, 0.2); padding: 20px; flex: 1; }}
            .val {{ font-size: 2em; color: {alert_color}; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; background: rgba(16, 25, 39, 0.5); }}
            th, td {{ padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; }}
            th {{ color: {alert_color}; text-transform: uppercase; }}
        </style>
    </head>
    <body>
        <div class="container">
            <p style="opacity: 0.5;">OSN GLOBAL INTELLIGENCE // CYCLE: {datetime.datetime.now().strftime('%H:%M:%S')}</p>
            <h1 style="color: {alert_color}; letter-spacing: 5px;">SECURITY ANALYSIS REPORT</h1>
            
            <div class="stats">
                <div class="card">TOTAL EVENTS<div class="val">{summary['total_nodes']}</div></div>
                <div class="card">ALERT LEVEL<div class="val">{summary['alert_level']}</div></div>
                <div class="card">SYSTEM HEALTH<div class="val" style="color: #00ff99; font-size: 1.2em;">{summary['system_status']}</div></div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>SOURCE</th>
                        <th>THREAT</th>
                        <th>VECTOR</th>
                        <th>DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    </body>
    </html>
    """
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    return os.path.abspath("index.html")

if __name__ == "__main__":
    # הרצת כל הלוגיקה...
    raw_data = scrape_security_news()
    summary = process_security_data(raw_data)
    report_path = generate_nasa_report(summary, raw_data)
    
    # הפקודה ש"מכריחה" את המחשב לפתוח את החלון:
    import webbrowser
    webbrowser.open('file://' + report_path)
