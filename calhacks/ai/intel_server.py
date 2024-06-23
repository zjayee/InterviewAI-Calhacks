from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fabric import Connection
from dotenv import dotenv_values
from pydantic import BaseModel

# config = dotenv_values(".env")

# HOST_IP = config["HOST_IP"]
# GATEWAY_IP = config["GATEWAY_IP"]
# SSH_KEY = config["SSH_KEY"]

HOST_IP = "100.82.142.94"
GATEWAY_IP = "146.152.232.8"
SSH_KEY = "ssh.pub"

app = FastAPI()

origins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserPrompt(BaseModel):
    prompt: str

@app.post("/generate/")
def generate_image(args: UserPrompt):
    playground = Connection(host=HOST_IP,
                        gateway=Connection(GATEWAY_IP),
                        user="ubuntu",
                        connect_kwargs={
                          "key_filename": [SSH_KEY]
                        })
  
    playground.run(f"python3 inference.py --prompt '{args.prompt}'")
    playground.get("/home/ubuntu/inference.jpeg")

    playground.close()

    return FileResponse("inference.jpeg", media_type="image/jpeg")

playground = Connection(host=HOST_IP,
                        gateway=Connection('guest@146.152.232.8'),
                        connect_kwargs={
                          "key_filename": [SSH_KEY]
                        })
playground.run("python3 inference.py --checkpoint_path \"checkpoints/wav2lip_gan.pth\" --face \"intel_ceo.mp4\" --audio \"sample_audio.m4a\"")