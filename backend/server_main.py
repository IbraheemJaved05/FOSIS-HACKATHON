from fastapi import FastAPI
from pydantic import BaseModel
from mistralai.client import MistralClient
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os
import asyncio
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Define request body model
class ChatRequest(BaseModel):
    message: str = "whats the meaning of ibraheem"

# Initialize Mistral client with API key from environment variable
api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise ValueError("MISTRAL_API_KEY environment variable not set")

client = MistralClient(api_key=api_key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def generate_stream(messages):
    chat_response = client.chat_stream(
        model="mistral-medium",
        messages=messages,
        temperature=0.7,
        top_p=1,
        max_tokens=500
    )
    
    for chunk in chat_response:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content

@app.post("/")
async def chat_endpoint(chat_request: ChatRequest):
    # Create the chat messages
    messages = [
        {"role": "system", "content": "you need to provide me 3 steps, with each header, description and url please follow this rule strictly, follow ts strictly name: 'Introduction', completed: false, resource: 'https://example.com/intro' "},
        {"role": "user", "content": chat_request.message}
    ]

    return StreamingResponse(
        generate_stream(messages),
        media_type="text/event-stream"
    )