from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

# Initialize FastAPI app
app = FastAPI(
    title="Sample FastAPI Application",
    description="A simple API demonstrating FastAPI features",
    version="1.0.0"
)

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
    return {"message": "Welcome to FastAPI!", "status": "OK"}

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