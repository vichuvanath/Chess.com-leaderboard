import httpx
import asyncio

async def test_fetch():
    username = "Tharani_13"
    api_url = "https://api.chess.com/pub/player"
    async with httpx.AsyncClient(verify=False) as client:
        headers = {"User-Agent": "Mozilla/5.0"}
        print(f"Testing {username}...")
        try:
            resp = await client.get(f"{api_url}/{username}", headers=headers)
            print(f"Profile Status: {resp.status_code}")
            if resp.status_code == 200:
                print(f"Profile Data: {resp.json().get('username')}")
                
            stats_resp = await client.get(f"{api_url}/{username}/stats", headers=headers)
            print(f"Stats Status: {stats_resp.status_code}")
            if stats_resp.status_code == 200:
                print("Stats Data Found")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(test_fetch())
