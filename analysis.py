import unittest
import json
import os
import webbrowser

# ==========================================
# PART 1: GLOBAL SECURITY ANALYSIS LOGIC
# ==========================================

def load_raw_data():
    """Simulating high-level global security data fetch"""
    return [
        {"country": "Israel", "threat_level": "High", "type": "Cyber Warfare", "status": "Active"},
        {"country": "United States", "threat_level": "Medium", "type": "Satellite Intel", "status": "Monitoring"},
        {"country": "United Kingdom", "threat_level": "Low", "type": "Encrypted Comms", "status": "Secure"},
        {"country": "Ukraine", "threat_level": "Critical", "type": "Ground Operations", "status": "Alert"},
        {"country": "Taiwan", "threat_level": "High", "type": "Naval Maneuvers", "status": "Active"}
    ]

def process_security_data(data):
    """Analyzing threat vectors and priority levels"""
    critical_threats = [item for item in data if item['threat_level'] in ['High', 'Critical']]
    return {
        "total_nodes": len(data),
        "alert_level": "ALPHA-RED" if len(critical_threats) > 2 else "BRAVO-YELLOW",
        "critical_incidents": len(critical_threats),
        "system_status": "OPERATIONAL / SECURE"
    }

def generate_nasa_style_report(summary, raw_data):
    """Generates a high-end, futuristic HTML report"""
    
    rows = ""
    for item in raw_data:
        status_color = "#ff0055" if item['threat_level'] in ['High', 'Critical'] else "#00ff99"
        rows += f"""
        <tr>
            <td>{item['country']}</td>
            <td style="color: {status_color}; font-weight: bold; text-shadow: 0 0 10px {status_color};">
                {item['threat_level'].upper()}
            </td>
            <td>{item['type']}</td>
            <td><span class="status-badge" style="border-color: {status_color};">{item['status']}</span></td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>COMMAND CENTER | SECURITY ANALYSIS</title>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
        <style>
            :root {{
                --bg-color: #050a0f;
                --card-bg: rgba(16, 25, 39, 0.8);
                --accent-blue: #00d2ff;
                --neon-green: #00ff99;
                --neon-red: #ff0055;
            }}
            body {{
                background-color: var(--bg-color);
                background-image: 
                    radial-gradient(circle at 2px 2px, rgba(0, 210, 255, 0.1) 1px, transparent 0);
                background-size: 40px 40px;
                color: white;
                font-family: 'Share Tech Mono', monospace;
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }}
            .header {{
                text-align: left;
                width: 100%;
                max-width: 1000px;
                border-left: 4px solid var(--accent-blue);
                padding-left: 20px;
                margin-bottom: 40px;
                text-transform: uppercase;
                letter-spacing: 3px;
            }}
            .header h1 {{ margin: 0; font-size: 2.5em; color: var(--accent-blue); }}
            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                width: 100%;
                max-width: 1000px;
                margin-bottom: 40px;
            }}
            .stat-card {{
                background: var(--card-bg);
                border: 1px solid rgba(0, 210, 255, 0.3);
                padding: 20px;
                border-radius: 5px;
                box-shadow: inset 0 0 15px rgba(0, 210, 255, 0.1);
                position: relative;
                overflow: hidden;
            }}
            .stat-card::after {{
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
                background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
            }}
            .stat-label {{ color: rgba(255,255,255,0.6); font-size: 0.8em; margin-bottom: 10px; }}
            .stat-value {{ font-size: 1.8em; color: var(--accent-blue); text-shadow: 0 0 10px rgba(0,210,255,0.5); }}
            
            table {{
                width: 100%;
                max-width: 1000px;
                border-collapse: collapse;
                background: var(--card-bg);
                backdrop-filter: blur(10px);
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.1);
            }}
            th {{
                background: rgba(0, 210, 255, 0.1);
                padding: 15px;
                text-align: left;
                color: var(--accent-blue);
                border-bottom: 1px solid rgba(0, 210, 255, 0.3);
            }}
            td {{ padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }}
            tr:hover {{ background: rgba(255,255,255,0.02); }}
            
            .status-badge {{
                padding: 4px 10px;
                border: 1px solid;
                border-radius: 3px;
                font-size: 0.7em;
                text-transform: uppercase;
            }}
            .scanline {{
                width: 100%;
                height: 100px;
                z-index: 10;
                background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,210,255,0.05) 50%, rgba(0,0,0,0) 100%);
                opacity: 0.1;
                position: fixed;
                bottom: 100%;
                animation: scan 4s linear infinite;
            }}
            @keyframes scan {{
                0% {{ bottom: 100%; }}
                100% {{ bottom: -100px; }}
            }}
        </style>
    </head>
    <body>
        <div class="scanline"></div>
        <div class="header">
            <div style="font-size: 0.8em; opacity: 0.6;">Global Intelligence Command</div>
            <h1>Security Data Report</h1>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">TOTAL NODES SCAN</div>
                <div class="stat-value">{summary['total_nodes']}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">ALERT STATUS</div>
                <div class="stat-value" style="color: {var('--neon-red') if 'ALPHA' in summary['alert_level'] else var('--accent-blue')}">
                    {summary['alert_level']}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">CRITICAL EVENTS</div>
                <div class="stat-value">{summary['critical_incidents']}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">SYSTEM HEALTH</div>
                <div class="stat-value" style="color: var(--neon-green); font-size: 1em;">{summary['system_status']}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>GEOGRAPHIC REGION</th>
                    <th>THREAT LEVEL</th>
                    <th>VECTOR TYPE</th>
                    <th>OPERATIONAL STATUS</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; font-size: 0.7em; opacity: 0.4;">
            SECURE ACCESS ONLY | ENCRYPTED REPORT ID: {os.urandom(4).hex().upper()}
        </div>
    </body>
    </html>
    """
    
    file_path = os.path.abspath("index.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    return file_path

# ==========================================
# PART 2: EXECUTION & AUTO-OPEN
# ==========================================

if __name__ == "__main__":
    print(">>> INITIALIZING SECURITY SCAN...")
    
    # 1. Run Logic
    raw_data = load_raw_data()
    summary = process_security_data(raw_data)
    
    # 2. Generate Report
    report_path = generate_nasa_style_report(summary, raw_data)
    
    print(f">>> REPORT GENERATED AT: {report_path}")
    print(">>> OPENING COMMAND CENTER...")
    
    # 3. AUTO-OPEN THE FILE IN BROWSER
    webbrowser.open('file://' + report_path)
