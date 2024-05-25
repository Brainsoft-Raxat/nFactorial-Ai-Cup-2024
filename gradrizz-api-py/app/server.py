from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from langserve import add_routes
from .chain import chain
from .settings import settings
from .title_generator.title_generator import generate_title 

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatCreationRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    title: str


@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")


async def stream_openai_response(message: str):
    async def response_generator():
        for token in chain.stream({"question": message}):
            yield f"{token}"
            await asyncio.sleep(0)  # Yield control to the event loop
    return response_generator


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response_stream = await stream_openai_response(request.message)
        return StreamingResponse(response_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create_chat_title", response_model=ChatResponse)
async def create_chat(request: ChatCreationRequest):
    try:
        title = generate_title(request.message)
        return ChatResponse(title=title)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
