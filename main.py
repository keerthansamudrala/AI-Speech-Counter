from fastapi import FastAPI, UploadFile, File, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
import datetime
import whisper

# Load whisper model
model = whisper.load_model("base")

app = FastAPI()

@app.post("/upload-audio")
async def save_audio(file: UploadFile = File(...)):
    #allowed file formats 
    allowed_extensions = [".mp3", ".wav", ".m4a", ".webm"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    #Check the extension
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Please upload: {allowed_extensions}"
        )

    # Create folder if it doesn't exist
    if not os.path.exists("recordings"):
        os.makedirs("recordings")

    # Unique filename logic
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_name = f"speech_{timestamp}{file_ext}"
    
    # file location
    file_location = f"recordings/{unique_name}"
        
    # read the file content
    content = await file.read()
    with open(file_location, "wb+") as file_object:
        file_object.write(content)

    # file sent to whisper    
    try:
        # Whisper processes the file you just saved
        result = model.transcribe(file_location)
        full_text = result["text"]

        # Basic filler word logic
        fillers = ["um", "uh", "ah", "like", "so"]
        words = full_text.lower().split()
        count = sum(1 for w in words if w.strip(",.?!") in fillers)

        #  Return the report instead of just the "saved" message
        return {
            "info": "Analysis Complete",
            "transcript": full_text,
            "filler_count": count,
            "total_words": len(words),
            "filename": unique_name
        }

    except Exception as e:
        # If AI fails, we still let them know the file was saved
        return {
            "info": "File saved, but transcription failed",
            "error": str(e),
            "path": file_location
        }


#Allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#verify connection
@app.get("/status")
async def get_status():
    return {"status": "Backend is connected!"}