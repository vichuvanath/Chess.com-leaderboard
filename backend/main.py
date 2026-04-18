from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import httpx
import asyncio

app = FastAPI(title="Chess Community API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Chess API is running"}

class User(BaseModel):
    username: str

class CommunityCreate(BaseModel):
    name: str

class Community(BaseModel):
    id: str
    name: str

CHESS_COM_API = "https://api.chess.com/pub/player"

async def fetch_chess_stats(username: str):
    # Use follow_redirects=True because Chess.com often redirects case-sensitive usernames (e.g., 301 Moved)
    async with httpx.AsyncClient(verify=False, follow_redirects=True) as client:
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
            # Fetch profile
            profile_resp = await client.get(f"{CHESS_COM_API}/{username}", headers=headers)
            if profile_resp.status_code != 200:
                print(f"Profile fetch failed for {username}: Status {profile_resp.status_code}")
                return None
            profile_data = profile_resp.json()
            
            # Fetch stats
            stats_resp = await client.get(f"{CHESS_COM_API}/{username}/stats", headers=headers)
            if stats_resp.status_code != 200:
                print(f"Stats fetch failed for {username}: Status {stats_resp.status_code}")
                return None
            stats_data = stats_resp.json()
            
            avatar = profile_data.get("avatar", f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}")
            blitz = stats_data.get("chess_blitz", {}).get("last", {}).get("rating", 0)
            rapid = stats_data.get("chess_rapid", {}).get("last", {}).get("rating", 0)
            
            return {
                "username": username,
                "name": profile_data.get("name", username),
                "avatar": avatar,
                "blitz": blitz,
                "rapid": rapid,
                "title": profile_data.get("title", "")
            }
        except Exception as e:
            print(f"Fetch error for {username}: {str(e)}")
            return None

import sqlite3
from contextlib import contextmanager
DB_FILE = "chess_app.db"

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        with open("schema.sql", "r") as f:
            cursor.executescript(f.read())
        cursor.execute("SELECT COUNT(*) FROM communities")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO communities (id, name) VALUES (?, ?)", ("global-arena", "Global Arena"))
            for u in ["hikaru", "magnus24", "nihalsarin", "firouzja2003"]:
                cursor.execute("INSERT INTO users (community_id, username) VALUES (?, ?)", ("global-arena", u))
        conn.commit()

init_db()

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_FILE)
    try:
        yield conn
    finally:
        conn.close()

titled_players = []

async def refresh_titled_players():
    global titled_players
    async with httpx.AsyncClient() as client:
        try:
            titles = ["GM", "IM", "FM", "CM", "WGM", "WIM", "WFM", "WCM"]
            all_found = []
            for title in titles:
                resp = await client.get(f"https://api.chess.com/pub/titled/{title}")
                if resp.status_code == 200:
                    all_found.extend(resp.json().get("players", []))
            titled_players = list(set(all_found))
            print(f"Cached {len(titled_players)} titled players")
        except Exception as e:
            print(f"Failed to fetch titled players: {e}")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(refresh_titled_players())

@app.get("/search-users")
async def search_users(q: str):
    if len(q) < 1: return []
    q_low = q.lower()
    
    # Prioritize START matches in cache
    starts_with = sorted([p for p in titled_players if p.lower().startswith(q_low)], key=len)
    contains = sorted([p for p in titled_players if q_low in p.lower() and not p.lower().startswith(q_low)], key=len)
    
    results = starts_with + contains
    return results[:10]

@app.get("/communities", response_model=List[Community])
async def get_communities():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM communities")
        return [Community(id=row[0], name=row[1]) for row in cursor.fetchall()]

@app.post("/communities", response_model=Community)
async def create_community(comm: CommunityCreate):
    comm_id = comm.name.lower().replace(" ", "-")
    with get_db() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO communities (id, name) VALUES (?, ?)", (comm_id, comm.name))
            conn.commit()
            return Community(id=comm_id, name=comm.name)
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="Community already exists")

@app.post("/communities/{comm_id}/users")
async def add_user(comm_id: str, user: User):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM communities WHERE id = ?", (comm_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Community not found")
        try:
            cursor.execute("INSERT INTO users (community_id, username) VALUES (?, ?)", (comm_id, user.username))
            conn.commit()
        except sqlite3.IntegrityError:
            pass
    return {"message": "User added"}

@app.get("/communities/{comm_id}/leaderboard")
async def get_leaderboard(comm_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM communities WHERE id = ?", (comm_id,))
        comm_row = cursor.fetchone()
        if not comm_row:
            raise HTTPException(status_code=404, detail="Community not found")
        cursor.execute("SELECT username FROM users WHERE community_id = ?", (comm_id,))
        usernames = [row[0] for row in cursor.fetchall()]
    
    tasks = [fetch_chess_stats(u) for u in usernames]
    results = await asyncio.gather(*tasks)
    return {
        "name": comm_row[0],
        "players": [r for r in results if r is not None]
    }
