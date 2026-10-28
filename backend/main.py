
from fastapi import FastAPI

app = FastAPI(
    title="CampusPass API",
    description="Register and Login APIs for CampusPass",
    version="1.0.0"
)


@app.get("/")
def home():
    return {"message": "CampusPass API is running"}

