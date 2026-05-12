import asyncio
import json
import os
import base64
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the latest flash model
try:
    # Try gemini-flash-latest first as it's a reliable alias
    MODEL_NAME = 'gemini-flash-latest'
    model = genai.GenerativeModel(MODEL_NAME)
except:
    # Fallback to 2.0 flash if available
    MODEL_NAME = 'gemini-2.0-flash'
    model = genai.GenerativeModel(MODEL_NAME)

# Diagnostic: List available models to terminal
print(f"Starting server with model: {MODEL_NAME}")
try:
    print("Available models for your API key:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print(f"Could not list models: {e}")

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Initialize chat session with Gemini
    chat = model.start_chat(history=[])
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_input = message_data.get("text", "")
            file_data = message_data.get("file_data")
            file_type = message_data.get("file_type")
            
            # Prepare message parts (File FIRST, then Text for better analysis)
            parts = []
            
            if file_data and file_type:
                try:
                    # Remove base64 prefix if present
                    if "," in file_data:
                        file_data = file_data.split(",")[1]
                    
                    file_bytes = base64.b64decode(file_data)
                    parts.append({
                        "mime_type": file_type,
                        "data": file_bytes
                    })
                    print(f"Attached file of type: {file_type}")
                except Exception as e:
                    print(f"Error processing file: {e}")

            if user_input:
                parts.append(user_input)
            elif file_data:
                parts.append("Please analyze this attached file.")
            
            if not parts:
                continue

            # Use Gemini to generate a streaming response
            try:
                # If no text or file, skip
                if not parts:
                    continue
                    
                response = chat.send_message(parts, stream=True)
                
                for chunk in response:
                    if chunk.text:
                        await websocket.send_json({
                            "type": "content",
                            "content": chunk.text,
                            "is_final": False
                        })
                        # Small delay to make the streaming feel natural in the UI
                        await asyncio.sleep(0.05)
                
                # Signal the end of the stream
                await websocket.send_json({
                    "type": "content",
                    "content": "",
                    "is_final": True
                })
                
            except Exception as e:
                print(f"Gemini Error ({MODEL_NAME}): {e}")
                await websocket.send_json({
                    "type": "content",
                    "content": f"\n\n[Error with {MODEL_NAME}: {str(e)}]",
                    "is_final": True
                })
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Server Error: {e}")
        try:
            await websocket.close()
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
