from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize client with API key from environment variable
client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

# Create the chat messages
messages = [
    ChatMessage(role="system", content="You are an ai-tutour"),
    ChatMessage(role="user", content="whats the meaning of ibraheem")
]

# Make the API call
chat_response = client.chat(
    model="mistral-medium",
    messages=messages,
    temperature=0.7,
    top_p=1,
    max_tokens=500
)

# Print the response
print(chat_response.choices[0].message.content)