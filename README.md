<h1>🎙️ AI Speech Counter</h1>
<p>The AI Speech Counter is a diagnostic tool designed to transform raw vocal input into a structured Speech Performance Report. By recording speech in real-time and processing it through an intelligent backend, the application provides objective coaching data to help users refine their delivery for interviews, seminars, and public speaking.</p>
<br>

<h1>⚙️ System Workflow</h1>
<p>The application follows a modular "Record-Process-Display" asynchronous architecture:</p>
<ul>
  <li><strong>1. Capture:</strong> The system initializes a MediaRecorder instance to record high-quality audio (44.1kHz) while the user selects a specific scenario (e.g., Interview, Seminar).</li>
  <li><strong>2. Analyse:</strong> The backend normalizes the audio and utilizes the OpenAI Whisper STT engine for word-level timestamped transcription.</li>
  <li><strong>3. Report:</strong> Data is processed through algorithmic and LLM layers (GPT-4o-mini) to generate a crisp, data-driven dashboard.</li>
</ul>
<br>

<h1>🔑 Key Performance Outcomes</h1>
<table style="width:100%; text-align:left; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #1f1f1f; color: white;">
      <th style="padding: 12px; border: 1px solid #444;">Feature</th>
      <th style="padding: 12px; border: 1px solid #444;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Word Count</strong></td><td style="padding: 10px; border: 1px solid #444;">The total number of unique words successfully articulated.</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Speech Duration</strong></td><td style="padding: 10px; border: 1px solid #444;">Total time elapsed from the first word to the last.</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Delivery Speed</strong></td><td style="padding: 10px; border: 1px solid #444;">Calculated Words Per Minute (WPM) to measure pace.</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Filler Tally</strong></td><td style="padding: 10px; border: 1px solid #444;">Total count of "crutch words" (e.g., um, uh, like, so).</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Long Pauses</strong></td><td style="padding: 10px; border: 1px solid #444;">Frequency and location of silent intervals exceeding 2 seconds.</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Vocal Tone</strong></td><td style="padding: 10px; border: 1px solid #444;">Emotional analysis of the delivery (e.g., Confident, Anxious, Monotone).</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #444;"><strong>Performance Summary</strong></td><td style="padding: 10px; border: 1px solid #444;">A concise AI-generated brief highlighting strengths and key improvement areas.</td></tr>
  </tbody>
</table>
<br>

<h1>🚀 Getting Started</h1>
<h3>Prerequisites</h3>
<ul>
  <li>Python 3.13+</li>
  <li>Node.js 22+</li>
  <li>FFmpeg (Required for audio processing)</li>
</ul>

<h3>1. Backend Setup (FastAPI)</h3>
<pre style="background-color: #1a1a1a; color: #dcdcdc; padding: 20px; border-radius: 8px; overflow-x: auto; line-height: 1.8; font-family: 'Courier New', Courier, monospace;">
<code># Create and activate virtual environment
python -m venv Myenv
source Myenv/bin/activate    # Windows: Myenv\Scripts\activate          
<br>
# Install dependencies and run
pip install -r requirements.txt
<br>
# Start the FastAPI server
uvicorn main:app --reload</code></pre>

<h3>2. Frontend Setup (Next.js)</h3>
<pre style="background-color: #1a1a1a; color: #dcdcdc; padding: 15px; border-radius: 5px; overflow-x: auto;">
<code>cd frontend
npm install
npm run dev</code></pre>
<br>

<h1>🛠️ Technical Schema</h1>
<p>Structured JSON response used to populate the dashboard:</p>
<pre style="background-color: #1a1a1a; color: #dcdcdc; padding: 15px; border-radius: 5px; overflow-x: auto;">
<code>{
  "metrics": {
    "word_count": 500,
    "wpm": 166,
    "fillers": 12,
    "long_pauses": 3
  },
  "analysis": {
    "clarity": 0.88,
    "tone": "Confident",
    "summary": "Your delivery was professional..."
  }
}</code></pre>
