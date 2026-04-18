from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import sqlite3

app = FastAPI()
DB_FILE = "chess_app.db"

@app.get("/", response_class=HTMLResponse)
async def view_db():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Get communities
        cursor.execute("SELECT * FROM communities")
        communities = cursor.fetchall()
        
        # Get users
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        conn.close()

        html = f"""
        <html>
            <head>
                <title>Chess DB Viewer</title>
                <style>
                    body {{ font-family: sans-serif; background: #0f172a; color: white; padding: 40px; }}
                    h2 {{ color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 10px; }}
                    table {{ width: 100%; border-collapse: collapse; margin-bottom: 40px; background: #1e293b; border-radius: 8px; overflow: hidden; }}
                    th, td {{ padding: 15px; text-align: left; border-bottom: 1px solid #334155; }}
                    th {{ background: #334155; color: #38bdf8; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }}
                    tr:hover {{ background: #2d3748; }}
                    .container {{ max-width: 1000px; margin: 0 auto; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>RecordLeader Database Explorer</h1>
                    
                    <h2>Communities</h2>
                    <table>
                        <thead><tr><th>ID</th><th>Name</th></tr></thead>
                        <tbody>
                            {"".join([f"<tr><td>{r[0]}</td><td>{r[1]}</td></tr>" for r in communities])}
                        </tbody>
                    </table>

                    <h2>Linked Players</h2>
                    <table>
                        <thead><tr><th>Community ID</th><th>Username</th></tr></thead>
                        <tbody>
                            {"".join([f"<tr><td>{r[0]}</td><td>{r[1]}</td></tr>" for r in users])}
                        </tbody>
                    </table>
                    
                    <p style="color: #94a3b8; font-size: 0.8rem;">Auto-refreshing enabled. Powered by Antigravity.</p>
                </div>
                <script>setTimeout(() => location.reload(), 5000);</script>
            </body>
        </html>
        """
        return html
    except Exception as e:
        return f"<html><body><h1>Error reading DB</h1><p>{str(e)}</p></body></html>"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
