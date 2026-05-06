import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Listing all models:")
for m in genai.list_models():
    print(f"Name: {m.name}")
    print(f"Display Name: {m.display_name}")
    print(f"Supported methods: {m.supported_generation_methods}")
    print("-" * 20)
