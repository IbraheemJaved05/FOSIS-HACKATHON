from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Chat API",
    description="API for chatting with Mistral AI",
    version="1.0.0"
)

# Initialize Mistral client
client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

# Pydantic model for request body validation
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True

# In-memory storage for items
items_db = {}

@app.get("/")
async def root():
    """Root endpoint returning a welcome message"""
    return {"message": "Welcome to the AI Chat API", "status": "active"}

@app.get("/items/", response_model=List[Item])
async def get_items():
    """Get all items"""
    return list(items_db.values())

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    """Get a specific item by ID"""
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_id]

@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    """Create a new item"""
    # Generate a new ID (simple implementation)
    new_id = len(items_db) + 1
    items_db[new_id] = item
    return item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: Item):
    """Update an existing item"""
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db[item_id] = item
    return item

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    """Delete an item"""
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]
    return {"message": "Item deleted successfully"}

@app.get("/search/")
async def search_items(keyword: str = Query(None, min_length=3)):
    """Search items by name"""
    if not keyword:
        return list(items_db.values())
    
    results = [
        item for item in items_db.values()
        if keyword.lower() in item.name.lower()
    ]
    return results

class ChatRequest(BaseModel):
    message: str
    system_prompt: str = "You are a helpful AI assistant"
    temperature: float = 0.7
    max_tokens: int = 500

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Create the chat messages
        messages = [
            ChatMessage(role="system", content=request.system_prompt),
            ChatMessage(role="user", content=request.message)
        ]

        # Make the API call
        chat_response = client.chat(
            model="mistral-medium",
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )

        # Return the response
        return {
            "response": chat_response.choices[0].message.content,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 