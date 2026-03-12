import os
import time
import json
import webbrowser
import feedparser
from datetime import datetime, timezone

# ==========================================
# PART 1: ADVANCED REAL-TIME RSS SCRAPING
# ==========================================

def scrape_security_news():
    """
    סורק נתוני RSS ממספר מקורות כדי להבטיח זרימת מידע שוטפת מהשעה האחרונה
    """
    print(">>> [SYSTEM] INITIATING GLOBAL SATELLITE UPLINK...")
    
    # שימוש ב-BBC World News - מתעדכן בתדירות גבוהה מאוד
    rss_urls = [
        "http://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best"
    ]
    
    security_events = []
    keywords = ['security', 'attack', 'military', 'cyber', 'war', 'threat', 'intelligence', 'conflict', 'missile', 'drone', 'strike', 'forces', 'police', 'bomb']
    
    for url in rss_urls:
        try:
            print(f">>> [UPLINK] CONNECTING TO NODE: {url[:30]}...")
            feed = feedparser.parse(url)
            
            for entry in feed.entries:
                title = entry.title
                summary = entry.summary if 'summary' in entry else ""
                combined_text = (title + " " + summary).lower()
                link = entry.link if 'link' in entry else "#"
                
                # חישוב זמן - כמה דקות עברו מאז הפרסום
                if 'published_parsed' in entry and entry.published_parsed:
                    pub_dt = datetime.fromtimestamp(time.mktime(entry.published_parsed), timezone.utc)
                    now_dt = datetime.now(timezone.utc)
                    diff_minutes = int((now_dt - pub_dt).total_seconds() / 60)
                else:
                    diff_minutes = 0

                # נסנן רק דברים מה-24 שעות האחרונות
                if diff_minutes > 1440: 
                    continue

                # בדיקת איומים
                is_threat = any(key in combined_text for key in keywords)
                threat_level = "LOW"
                if is_threat:
                    threat_level = "HIGH" if any(x in combined_text for x in ['attack', 'war', 'killed', 'explosion', 'strike', 'missile']) else "MEDIUM"
                
                # יצירת אובייקט האירוע
                security_events.append({
                    "id": f"EVT-{abs(hash(title)) % 1000000:06d}",
                    "title": title,
                    "description": summary[:120] + "..." if len(summary) > 120 else summary,
                    "threat_level": threat_level,
                    "minutes_ago": diff_minutes,
                    "time_label": "JUST NOW" if diff_minutes < 10 else f"{diff_minutes} MINS AGO",
                    "link": link
                })

        except Exception as e:
            print(f">>> [ERROR] NODE FAILURE: {e}")

    # מיון מהחדש לישן
    security_events = sorted(security_events, key=lambda x: x['minutes_ago'])
    
    if not security_events:
        return load_fallback_data()
        
    print(f">>> [SUCCESS] {len(security_events)} TRANSMISSIONS DECODED.")
    return security_events[:30] # ניקח את ה-30 הכי חדשים כדי לא להעמיס

def load_fallback_data():
    return [{
        "id": "SYS-000000", "title": "SYSTEM STANDBY - NO LIVE FEEDS DETECTED", 
        "description": "Satellite uplink disrupted. Waiting for telemetry...",
        "threat_level": "LOW", "minutes_ago": 0, "time_label": "0 MINS AGO", "link": "#"
    }]

# ==========================================
# PART 2: PROCESSING & MODERN UI GENERATION
# ==========================================

def process_security_data(data):
    high_threats = [item for item in data if item['threat_level'] == 'HIGH']
    recent_threats = [item for item in data if item['minutes_ago'] <= 60]
    
    # צבעים מודרניים (Tailwind Colors)
    if len(high_threats) > 3:
        alert_level = "DEFCON 1 - CRITICAL"
        color = "#f43f5e" # Rose 500
    elif len(high_threats) > 0:
        alert_level = "DEFCON 2 - ELEVATED"
        color = "#fbbf24" # Amber 400
    else:
        alert_level = "DEFCON 4 - SECURE"
        color = "#10b981" # Emerald 500

    return {
        "total_nodes": len(data),
        "alert_level": alert_level,
        "main_color": color,
        "critical_incidents": len(high_threats),
        "last_hour_count": len(recent_threats),
        "system_status": "ONLINE // SATELLITE SYNC OK"
    }

def generate_nasa_report(summary, raw_data):
    events_json = json.dumps(raw_data)
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OSN Global Command</title>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%230f172a'/><circle cx='50' cy='50' r='18' fill='%2338bdf8'/></svg>">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
            :root {{
                --bg-main: #0f172a;        /* Slate 900 */
                --bg-panel: #1e293b;       /* Slate 800 */
                --border: #334155;         /* Slate 700 */
                --text-main: #f8fafc;      /* Slate 50 */
                --text-muted: #94a3b8;     /* Slate 400 */
                --cyan: #38bdf8;           /* Sky 400 */
                --red: #f43f5e;            /* Rose 500 */
                --yellow: #fbbf24;         /* Amber 400 */
                --green: #10b981;          /* Emerald 500 */
                --alert: {summary['main_color']};
            }}
            
            * {{ box-sizing: border-box; margin: 0; padding: 0; }}
            
            body {{
                background-color: var(--bg-main);
                color: var(--text-main);
                font-family: 'Inter', sans-serif;
                overflow: hidden;
            }}

            header {{
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px 40px; 
                background: var(--bg-panel);
                border-bottom: 1px solid var(--border);
            }}

            .logo-area h1 {{
                font-size: 1.5rem; 
                font-weight: 600;
                letter-spacing: 1px;
                color: var(--text-main);
                display: flex;
                align-items: center;
                gap: 10px;
            }}
            
            .logo-dot {{
                width: 12px; height: 12px; 
                background: var(--cyan);
                border-radius: 50%;
                display: inline-block;
            }}

            .logo-area .subtitle {{
                font-family: 'JetBrains Mono', monospace; 
                font-size: 0.8rem;
                color: var(--text-muted);
                margin-top: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
            }}
            
            .live-indicator {{
                display: inline-block; width: 8px; height: 8px; 
                background: var(--red);
                border-radius: 50%;
                animation: pulse 2s infinite;
            }}

            .clock {{ 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 1.1rem; 
                color: var(--text-muted); 
            }}

            .dashboard {{
                display: grid; 
                grid-template-columns: 280px 1fr; 
                gap: 30px; 
                padding: 30px 40px; 
                height: calc(100vh - 120px);
            }}

            .sidebar {{ display: flex; flex-direction: column; gap: 20px; }}

            .status-card {{
                background: var(--bg-panel); 
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px; 
                display: flex;
                flex-direction: column;
                gap: 10px;
            }}
            .status-card h3 {{ 
                color: var(--text-muted); 
                font-size: 0.85rem; 
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 500;
            }}
            .status-card .value {{ 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 2rem; 
                font-weight: 500;
            }}

            /* מכ"ם מינימליסטי */
            .radar-box {{ 
                height: 200px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: var(--bg-panel);
                border: 1px solid var(--border);
                border-radius: 12px;
                position: relative; 
                overflow: hidden; 
            }}
            .radar-circle {{
                width: 120px; height: 120px;
                border: 1px dashed var(--border);
                border-radius: 50%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }}
            .radar-circle::after {{
                content: '';
                width: 40px; height: 40px;
                background: rgba(56, 189, 248, 0.1);
                border: 1px solid rgba(56, 189, 248, 0.3);
                border-radius: 50%;
                animation: ripple 3s infinite ease-out;
            }}
            .radar-dot {{
                position: absolute;
                width: 6px; height: 6px;
                background: var(--cyan);
                border-radius: 50%;
            }}

            .news-feed {{
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 20px; 
                overflow-y: auto; 
                padding-right: 10px; 
                padding-bottom: 20px;
                align-content: start;
            }}
            
            .news-feed::-webkit-scrollbar {{ width: 6px; }}
            .news-feed::-webkit-scrollbar-track {{ background: transparent; }}
            .news-feed::-webkit-scrollbar-thumb {{ background: var(--border); border-radius: 10px; }}

            .news-card {{
                background: var(--bg-panel); 
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px; 
                display: flex; 
                flex-direction: column; 
                justify-content: space-between;
                transition: transform 0.2s ease, border-color 0.2s ease;
            }}
            .news-card:hover {{ 
                transform: translateY(-2px); 
                border-color: var(--text-muted);
            }}
            
            .card-meta {{ 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                font-family: 'JetBrains Mono', monospace; 
                font-size: 0.75rem; 
                color: var(--text-muted); 
                margin-bottom: 12px; 
            }}
            .time-badge {{ 
                background: var(--bg-main); 
                padding: 4px 8px; 
                border-radius: 6px; 
                border: 1px solid var(--border);
            }}
            .card-title {{ 
                font-size: 1.05rem; 
                font-weight: 500; 
                margin-bottom: 10px; 
                line-height: 1.4; 
                color: var(--text-main);
            }}
            .card-desc {{ 
                font-size: 0.85rem; 
                color: var(--text-muted); 
                line-height: 1.5; 
            }}
            
            .threat-indicator {{
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                padding-top: 15px;
                margin-top: 15px;
                border-top: 1px solid var(--border);
            }}
            
            .threat-dot {{ width: 8px; height: 8px; border-radius: 50%; }}

            /* סרגל חדשות נקי ואיטי */
            .ticker-wrap {{
                position: fixed; bottom: 0; left: 0; width: 100%; height: 40px; 
                background: var(--bg-panel); 
                border-top: 1px solid var(--border); 
                display: flex; align-items: center; z-index: 1000;
            }}
            .ticker-title {{
                background: var(--bg-main); 
                color: var(--text-muted); 
                padding: 0 20px; 
                font-weight: 500; 
                font-size: 0.8rem;
                height: 100%; display: flex; align-items: center; z-index: 20; 
                border-right: 1px solid var(--border);
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .ticker-marquee {{
                flex: 1; overflow: hidden; position: relative; height: 100%; 
                display: flex; align-items: center;
            }}
            .ticker-move {{
                display: flex; white-space: nowrap; padding-left: 100%; 
                /* שונה ל-250 שניות לתנועה איטית ונוחה */
                animation: ticker 250s linear infinite; 
            }}
            .ticker-move:hover {{
                animation-play-state: paused;
            }}
            .ticker-item {{
                margin-right: 60px; color: var(--text-main); font-size: 0.9rem;
                display: inline-flex; align-items: center; gap: 10px;
            }}
            .ticker-time {{ color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }}

            @keyframes pulse {{ 0% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} 100% {{ opacity: 1; }} }}
            @keyframes ripple {{ 0% {{ transform: scale(0.8); opacity: 1; }} 100% {{ transform: scale(2.5); opacity: 0; }} }}
            @keyframes ticker {{ 0% {{ transform: translate3d(0, 0, 0); }} 100% {{ transform: translate3d(-100%, 0, 0); }} }}
        </style>
    </head>
    <body>
        <header>
            <div class="logo-area">
                <h1><span class="logo-dot"></span> OSN COMMAND</h1>
                <div class="subtitle">
                    <span class="live-indicator"></span> LIVE GLOBAL FEED
                </div>
            </div>
            <div class="clock" id="live-clock">00:00:00 UTC</div>
        </header>

        <div class="dashboard">
            <div class="sidebar">
                <div class="status-card">
                    <h3>THREAT ASSESSMENT</h3>
                    <div class="value" style="color: {summary['main_color']};">
                        {summary['alert_level'].split(' - ')[0]}
                    </div>
                </div>
                
                <div class="status-card">
                    <h3>INTERCEPTS (1HR)</h3>
                    <div class="value" style="color: var(--cyan);">{summary['last_hour_count']}</div>
                </div>
                
                <div class="status-card">
                    <h3>CRITICAL INCIDENTS</h3>
                    <div class="value" style="color: var(--red);">{summary['critical_incidents']}</div>
                </div>

                <div class="radar-box">
                    <div class="radar-circle">
                        <div class="radar-dot"></div>
                    </div>
                    <div style="position:absolute; color:var(--text-muted); font-family:'JetBrains Mono'; font-size:0.7rem; bottom: 15px;">
                        SCANNING...
                    </div>
                </div>
            </div>

            <div class="news-feed" id="news-container">
                </div>
        </div>

        <div class="ticker-wrap">
            <div class="ticker-title">RAW DATA</div>
            <div class="ticker-marquee">
                <div class="ticker-move" id="ticker-container">
                    </div>
            </div>
        </div>

        <script>
            const rawData = {events_json};
            
            // Live Clock
            function updateClock() {{
                const now = new Date();
                document.getElementById('live-clock').innerText = now.toISOString().substring(11, 19) + ' LOCAL';
            }}
            setInterval(updateClock, 1000);
            updateClock();

            const container = document.getElementById('news-container');
            const ticker = document.getElementById('ticker-container');
            
            let tickerHTML = '';
            
            const colors = {{
                'HIGH': 'var(--red)',
                'MEDIUM': 'var(--yellow)',
                'LOW': 'var(--cyan)'
            }};

            rawData.forEach((item) => {{
                const dotColor = colors[item.threat_level];
                
                // Build Card
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <div>
                        <div class="card-meta">
                            <span>${{item.id}}</span>
                            <span class="time-badge">${{item.time_label}}</span>
                        </div>
                        <div class="card-title">${{item.title}}</div>
                        <div class="card-desc">${{item.description}}</div>
                    </div>
                    <div class="threat-indicator" style="color: ${{dotColor}}">
                        <div class="threat-dot" style="background: ${{dotColor}}"></div>
                        ${{item.threat_level}} THREAT
                    </div>
                `;
                container.appendChild(card);

                // Build Ticker Item
                tickerHTML += `<div class="ticker-item"><span class="ticker-time">[${{item.time_label}}]</span> ${{item.title}}</div>`;
            }});

            ticker.innerHTML = tickerHTML;
        </script>
    </body>
    </html>
    """
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    return os.path.abspath("index.html")

if __name__ == "__main__":
    raw_data = scrape_security_news()
    summary = process_security_data(raw_data)
    report_path = generate_nasa_report(summary, raw_data)
    
    # === יצירת הסיכום היפה ב-GitHub Actions ===
    if "GITHUB_STEP_SUMMARY" in os.environ:
        repo = os.environ.get("GITHUB_REPOSITORY", "user/repo")
        owner = repo.split('/')[0]
        repo_name = repo.split('/')[1] if '/' in repo else repo
        pages_url = f"https://{owner}.github.io/{repo_name}/"
        
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write("## 🌍 OSN Command Center Updated Successfully!\n\n")
            f.write(f"### 🚀 [>>> CLICK HERE TO ACCESS LIVE WAR ROOM <<<]({pages_url})\n\n")
            f.write(f"**Current Threat Level:** `{summary['alert_level']}` | **Incidents in Last Hour:** `{summary['last_hour_count']}`\n")

    # פתיחה אוטומטית בדפדפן רק אם אנחנו מריצים לוקאלית (לא ב-GitHub)
    try:
        if "GITHUB_ACTIONS" not in os.environ:
            webbrowser.open('file://' + report_path)
    except:
        pass
