const randomWordsToggle = document.getElementById('random-words-toggle');
const customTextToggle = document.getElementById('custom-text-toggle');
const customTextButton = document.getElementById('custom-text-button');
const customTextField = document.getElementById('custom-text-field');
const speakerToggle = document.getElementById('speaker-toggle-radio');

const randomWordsDisplay = document.getElementById('current-word');

const playButton = document.getElementById('play-button');
const resetButton = document.getElementById('reset-button');

const speedDropDown = document.getElementById('speed-drop-down');
const customSpeedInput = document.getElementById('custom-speed-input');
const customSpeedButton = document.getElementById('custom-speed-button');

const avgWPMSpan = document.getElementById('avg-wpm-span');
const avgLPMSpan = document.getElementById('avg-lpm-span');
const noOfWordsSpan = document.getElementById('no-of-words-span');
const noOfLettersSpan = document.getElementById('no-of-letters-span');
const timeElapsedSpan = document.getElementById('time-elapsed-span');
const currentWordDiv = document.getElementById('current-word-div');

let randomWords;
let customWords;
let currentMode = 'random';
let isPlaying = false;
let noOfWords = 0;
let noOfLetters = 0;
let avgWPM = 0;
let avgLPM = 0;
let timeElapsed = 0;
let timePeriod = 3000; // setting default timePeriod to 3 seconds
let currentSpeed = 20;
let ifSpeak = true;

(async () => {
    randomWords = await loadWords();
})();

randomWordsToggle.addEventListener('change', function() {
    if (this.checked) {
        currentMode = 'random';
        customTextField.style.display = 'none';
        customTextButton.style.display = 'none';
    }
});

customTextToggle.addEventListener('change', function () {
    if (this.checked) {
        currentMode = 'custom';
        customTextField.style.display = 'block';
        customTextButton.style.display = 'block';
    }
});

customTextButton.addEventListener('click', function () {
    let text = customTextField.value;
    console.log("text: " + text);
    customWords = text.match(/[A-Za-z0-9]+/g) || [];
    customWords = text.match(/[A-Za-z0-9-]+/g) || [];
    console.log("Custom Words are: " + customWords.toString());
});

speakerToggle.addEventListener('change', function () {
    ifSpeak = !ifSpeak;
});

speedDropDown.addEventListener('change', function() {
    if (this.value === 'custom') {
        // Show the custom input field
        customSpeedInput.style.display = 'inline-block';
        customSpeedInput.focus(); // Automatically focus on the input
        customSpeedButton.style.display = 'inline-block';
    } else {
        // Hide the custom input field
        customSpeedInput.style.display = 'none';
        customSpeedButton.style.display = 'none';
        currentSpeed = parseInt(speedDropDown.value);
    }
});

customSpeedButton.addEventListener('click', function () {
    currentSpeed = (customSpeedInput.value ? customSpeedInput.value : currentSpeed);
    console.log (currentSpeed)
});

playButton.addEventListener('click', async function () {
    isPlaying = !isPlaying;
    playButton.textContent = (isPlaying ? 'Pause' : 'Play');
    
    while (isPlaying) {
        await new Promise(resolve => setTimeout(resolve, timePeriod));
        if (isPlaying) {
            timePeriod = 60*1000/currentSpeed;
            
            let randomIndex = Math.floor(Math.random()*randomWords.length);
            let selectedWord = randomWords[randomIndex];


            if (currentMode == 'custom') {
                randomIndex = Math.floor(Math.random()*customWords.length);
                selectedWord = customWords[randomIndex];
            }

            // making the first letter always capital
            selectedWord = selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1);
            
            noOfWords += 1;
            noOfLetters += selectedWord.length;
            timeElapsed += timePeriod;
            avgWPM = noOfWords*1000*60/timeElapsed;
            avgLPM = noOfLetters*1000*60/timeElapsed;
            
            avgWPMSpan.textContent = avgWPM.toFixed(2).toString();
            avgLPMSpan.textContent = avgLPM.toFixed(2).toString();
            currentWordDiv.textContent = selectedWord;
            noOfWordsSpan.textContent = noOfWords.toString();
            noOfLettersSpan.textContent = noOfLetters.toString();
            timeElapsedSpan.textContent = (timeElapsed/1000).toFixed(2).toString() + " secs";
            
            if (ifSpeak) speakWord(selectedWord);
        }
    }
    
})

resetButton.addEventListener('click', function () {
    isPlaying = false;
    noOfWords = 0;
    noOfLetters = 0;
    timeElapsed = 0;
    avgWPM = 0;
    avgLPM = 0;
    selectedWord = "Hello!!";
    timeElapsed = 0;

    currentMode = 'random';
    playButton.textContent = 'Play';
    avgWPMSpan.textContent = avgWPM.toString();
    avgLPMSpan.textContent = avgLPM.toString();
    currentWordDiv.textContent = selectedWord;
    noOfWordsSpan.textContent = noOfWords.toString();
    noOfLettersSpan.textContent = noOfLetters.toString();
    timeElapsedSpan.textContent = (timeElapsed/1000).toString() + " secs";
})

async function loadWords () {
    const response = await fetch('words.txt');
    const text = await response.text();
    return text.split('\n').map(w => w.trim()).filter(Boolean);
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}