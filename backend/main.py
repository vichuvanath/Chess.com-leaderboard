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

# In-memory storage (for demonstration)
# In a real app, use a database
communities = {}
users_db = {} # community_id -> list of chess.com usernames

class User(BaseModel):
    username: str

class CommunityCreate(BaseModel):
    name: str

class Community(BaseModel):
    id: str
    name: str

CHESS_COM_API = "https://api.chess.com/pub/player"

async def fetch_chess_stats(username: str):
    async with httpx.AsyncClient() as client:
        try:
            # Fetch profile for avatar
            profile_resp = await client.get(f"{CHESS_COM_API}/{username}")
            profile_data = profile_resp.json()
            
            # Fetch stats
            stats_resp = await client.get(f"{CHESS_COM_API}/{username}/stats")
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
            return None

@app.get("/communities", response_model=List[Community])
async def get_communities():
    return [Community(id=k, name=v) for k, v in communities.items()]

@app.post("/communities", response_model=Community)
async def create_community(comm: CommunityCreate):
    comm_id = comm.name.lower().replace(" ", "-")
    if comm_id in communities:
        raise HTTPException(status_code=400, detail="Community already exists")
    communities[comm_id] = comm.name
    users_db[comm_id] = []
    return Community(id=comm_id, name=comm.name)

@app.post("/communities/{comm_id}/users")
async def add_user(comm_id: str, user: User):
    if comm_id not in communities:
        raise HTTPException(status_code=404, detail="Community not found")
    if user.username not in users_db[comm_id]:
        users_db[comm_id].append(user.username)
    return {"message": "User added"}

@app.get("/communities/{comm_id}/leaderboard")
async def get_leaderboard(comm_id: str):
    if comm_id not in communities:
        raise HTTPException(status_code=404, detail="Community not found")
    
    usernames = users_db[comm_id]
    tasks = [fetch_chess_stats(u) for u in usernames]
    results = await asyncio.gather(*tasks)
    
    # Filter out failed fetches
    valid_results = [r for r in results if r is not None]
    
    # Sort by blitz as default for now, frontend can handle sorting/filtering
    return {
        "name": communities[comm_id],
        "players": valid_results
    }

# Seed some data
communities["global-arena"] = "Global Arena"
users_db["global-arena"] = ["hikaru", "magnus24", "nihalsarin", "firouzja2003"]
