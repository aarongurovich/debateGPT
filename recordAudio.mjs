const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const output = document.getElementById('output');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const recordingInfo = document.getElementById('recordingInfo');
const timer = document.getElementById('timer');

let audioRecorder;
let audioChunks = [];
let recordingStartTime;
let timerInterval;

// Update status indicator
function updateStatus(status, message) {
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = message;
}

// Update output message
function updateOutput(message, type = '') {
    output.className = `output-message ${type}`;
    output.querySelector('span').textContent = message;
}

// Format time for timer
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start timer
function startTimer() {
    recordingStartTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        timer.textContent = formatTime(elapsed);
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Reset timer
function resetTimer() {
    timer.textContent = '00:00';
}

// Initialize media recorder
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Initialize the media recorder object
        audioRecorder = new MediaRecorder(stream);
        
        // dataavailable event is fired when the recording is stopped
        audioRecorder.addEventListener('dataavailable', e => {
            audioChunks.push(e.data);
        });
        
        // start recording when the start button is clicked
        startButton.addEventListener('click', () => {
            audioChunks = [];
            audioRecorder.start();
            
            // Update UI
            startButton.disabled = true;
            stopButton.disabled = false;
            playButton.disabled = true;
            
            updateStatus('recording', 'Recording in progress...');
            updateOutput('Recording started! Speak now.', 'recording');
            recordingInfo.classList.add('active');
            startTimer();
        });
        
        // stop recording when the stop button is clicked
        stopButton.addEventListener('click', () => {
            audioRecorder.stop();
            
            // Update UI
            startButton.disabled = false;
            stopButton.disabled = true;
            playButton.disabled = false;
            
            updateStatus('stopped', 'Recording complete');
            updateOutput('Recording stopped! Click play to hear your audio.', 'success');
            recordingInfo.classList.remove('active');
            stopTimer();
        });
        
        // play the recorded audio when the play button is clicked
        playButton.addEventListener('click', () => {
            const blobObj = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(blobObj);
            const audio = new Audio(audioUrl);
            
            // Update UI for playing state
            updateStatus('ready', 'Playing audio...');
            updateOutput('Playing your recorded audio!', 'playing');
            playButton.disabled = true;
            
            audio.play();
            
            // Re-enable play button when audio ends
            audio.addEventListener('ended', () => {
                updateStatus('ready', 'Ready to record');
                updateOutput('Playback complete. Ready for next recording.', 'success');
                playButton.disabled = false;
            });
            
            // Handle audio errors
            audio.addEventListener('error', () => {
                updateStatus('ready', 'Ready to record');
                updateOutput('Error playing audio. Please try recording again.', '');
                playButton.disabled = false;
            });
        });
        
        // Initial UI state
        updateStatus('ready', 'Ready to record');
        updateOutput('Click "Start Recording" to begin', '');
        
    }).catch(err => {
        // If the user denies permission to record audio, then display an error.
        console.error('Error accessing microphone:', err);
        updateStatus('ready', 'Microphone access denied');
        updateOutput('Please allow microphone access to use this recorder.', '');
        startButton.disabled = true;
    });