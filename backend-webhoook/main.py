from fastapi import FastAPI, Request, Header

app = FastAPI()

@app.post("/github-webhook")
async def github_webhook(request: Request, x_github_event: str = Header(None)):
    payload = await request.json()
    print(f"Received event: {x_github_event}")
    print(payload)
    return {"status": "ok"} 