const randomWordsToggle = document.getElementById('random-words-toggle');
const customTextToggle = document.getElementById('custom-text-toggle');
const customTextField = document.getElementById('custom-text-field');
const speakerToggle = document.getElementById('speaker-toggle-radio');
const voiceDropDown = document.getElementById('voice-drop-down');
const customTextDiv = document.getElementById('custom-text-div');
const randomiseToggle = document.getElementById('randomise-toggle-radio');

const randomWordsDisplay = document.getElementById('current-word');

const previousButton = document.getElementById('previous-button');
const playButton = document.getElementById('play-button');
const resetButton = document.getElementById('reset-button');
const nextButton = document.getElementById('next-button');

const speedDropDown = document.getElementById('speed-drop-down');
const customSpeedInput = document.getElementById('custom-speed-input');
const customSpeedButton = document.getElementById('custom-speed-button');
const submitCustomTextButton = document.getElementById('submit-custom-text-button');

const avgWPMSpan = document.getElementById('avg-wpm-span');
const avgLPMSpan = document.getElementById('avg-lpm-span');
const instLPMSpan = document.getElementById('inst-lpm-span');
const noOfWordsSpan = document.getElementById('no-of-words-span');
const noOfLettersSpan = document.getElementById('no-of-letters-span');
const timeElapsedSpan = document.getElementById('time-elapsed-span');
const currentWordDiv = document.getElementById('current-word-div');

let randomWords = [];
let customWords = [];
let currentMode = 'random';
let noOfWords = 0;
let noOfLetters = 0;
let avgWPM = 0;
let avgLPM = 0;
let instLPM = 0;
let timeElapsed = 0;
let timePeriod = 3000;
let currentSpeed = 20;
let voices = [];
let customTextIndex = 0;

let isPlaying = false;
let ifRandomise = false;
let ifSpeak = true;
let ifRestart = false;

const specialCharacters = ['.', ',', ':', ';', '-', '?', '/', '\\', '>', '<', '=', '%', '#', '"', '\'', '(', ')', '$', '~', '+', '&', '@', '!', '^', '*', '[', ']', '{', '}', '|', '_', '\u2013', '\u2014', '\u201C', '\u201D', '\n'];
const minSpeed = 15;
const maxSpeed = 35;
const defaultSpeed = 20;

function fillSpeedDropDown () {
    for (let currentSpeed = minSpeed; currentSpeed <= maxSpeed; currentSpeed++) {
        const option = document.createElement("option");
        option.value = currentSpeed;
        option.textContent = currentSpeed + " WPM";
        if (currentSpeed == defaultSpeed) {
            option.selected = true;
        }
        speedDropDown.appendChild(option);

        if (currentSpeed == maxSpeed) {
            const customOption = document.createElement("option");
            customOption.value = 'Custom';
            customOption.textContent = 'Custom';
            speedDropDown.appendChild(customOption);
        }
    }
}

fillSpeedDropDown();

function ifSpecialCharacter (inputWord) {
    return specialCharacters.includes(inputWord);
}

function getSpellWord(inputWord) {
    var spellWord = inputWord;
    switch (inputWord) {
        case '.':
            spellWord = 'fullstop';
            break;
        case ',':
            spellWord = 'Comma';
            break;
        case ':':
            spellWord = 'colon';
            break;
        case ';':
            spellWord = 'semicolon';
            break;
        case '-':
            spellWord = 'hifen';
            break;
        case '?':
            spellWord = 'question-mark';
            break;
        case '/':
            spellWord = 'forward-slash';
            break;
        case '\\':
            spellWord = 'backward-slash';
            break;
        case '>':
            spellWord = 'greater-than';
            break;
        case '<':
            spellWord = 'less-than';
            break;
        case '=':
            spellWord = "equals-to";
            break;
        case '%':
            spellWord = 'percentage';
            break;
        case '#':
            spellWord = 'hash-tag';
            break;
        case '"':
            spellWord = 'double-quote';
            break;
        case '\'':
            spellWord = 'single-quote';
            break;
        case '(':
            spellWord = 'open-bracket';
            break;
        case ')':
            spellWord = 'closed-bracket';
            break;
        case '$':
            spellWord = 'dollar-symbol';
            break;
        case '~':
            spellWord = 'tilde';
            break;
        case '+':
            spellWord = 'plus';
            break;
        case '&':
            spellWord = 'and';
            break;
        case '@':
            spellWord = 'at-symbol';
            break;
        case '!':
            spellWord = 'exclamation-mark';
            break;
        case '^':
            spellWord = 'caret-symbol';
            break;
        case '*':
            spellWord = 'star-symbol';
            break;
        case '[':
            spellWord = 'open-square-bracket';
            break;
        case ']':
            spellWord = 'closed-square-bracket';
            break;
        case '{':
            spellWord = 'open-flower-bracket';
            break;
        case '}':
            spellWord = 'closed-flower-bracket';
            break;
        case '|':
            spellWord = 'vertical-bar';
            break;
        case '_':
            spellWord = 'underscore';
            break;
        case '\u2013':
            spellWord = 'en-dash';
            break;
        case '\u2014':
            spellWord = 'em-dash';
            break;
        case '\u201C':
            spellWord = 'opening-double-quote';
            break;
        case '\u201D':
            spellWord = 'closing-double-quote';
            break;
        case '\n':
            spellWord = 'new-line';
            break;
    }
    return spellWord;
}

speechSynthesis.onvoiceschanged = populateVoices;

(async () => {
    randomWords = await loadWords();
})();

function populateVoices() {
    voices = speechSynthesis.getVoices();
    voiceDropDown.innerHTML = "";

    voices.forEach((voice, index) => {
        if (voice.lang == 'en-US') {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = "Voice " + (index+1).toString();
            if (voice.default) option.textContent += " — Default";
            voiceDropDown.appendChild(option);
        }
    });
}

randomWordsToggle.addEventListener('change', function() {
    if (this.checked) {
        currentMode = 'random';
        isPlaying = true;
        customTextDiv.style.display = 'none';
        playButton.click();
    }
});

customTextToggle.addEventListener('change', function () {
    if (this.checked) {
        currentMode = 'custom';
        isPlaying = true;
        customTextDiv.style.display = 'block';
        previousButton.style.display = (currentMode == 'custom' && !ifRandomise ? 'inline-block' : 'none');
        nextButton.style.display = (currentMode == 'custom' && !ifRandomise ? 'inline-block' : 'none');
        playButton.click();
    }
});

speakerToggle.addEventListener('change', function () {
    ifSpeak = !ifSpeak;
});

randomiseToggle.addEventListener('change', function () {
    ifRandomise = this.checked;
    previousButton.style.display = (currentMode == 'custom' && !ifRandomise ? 'inline-block' : 'none');
    nextButton.style.display = (currentMode == 'custom' && !ifRandomise ? 'inline-block' : 'none');
});

speedDropDown.addEventListener('change', function() {
    if (this.value === 'Custom') {
        customSpeedInput.style.display = 'inline-block';
        customSpeedInput.focus();
        customSpeedButton.style.display = 'inline-block';
    } else {
        customSpeedInput.style.display = 'none';
        customSpeedButton.style.display = 'none';
        currentSpeed = parseInt(speedDropDown.value);
    }
});

customSpeedButton.addEventListener('click', function () {
    currentSpeed = (customSpeedInput.value ? customSpeedInput.value : currentSpeed);
});

function getCleanTimeText (timeInputInSeconds) {
    let timeInSeconds = parseInt(timeInputInSeconds);
    let hours = parseInt(timeInSeconds/3600);
    timeInSeconds = timeInSeconds - hours*3600;
    let minutes = parseInt(timeInSeconds/60);
    let seconds = timeInSeconds - minutes*60;
    let retString = (hours > 0 ? hours.toString() + "h ": "")
                    + (minutes > 0 ? minutes.toString() + "m ": "")
                    + seconds.toString() + "s";
    return retString;
}

function refineWords (text) {
    customWords = [];
    var currentWord = "";
    for (let idx = 0; idx < text.length; idx++) {
        const element = text[idx];
        if (element == ' ') {
            if (currentWord.length > 0) customWords.push(currentWord);
            currentWord = '';
        }
        else if (ifSpecialCharacter(element)) {
            if (currentWord.length > 0) customWords.push(currentWord);
            customWords.push(element);
            currentWord = '';
        }
        else currentWord = currentWord + element;
    }
    if (currentWord.length > 0) customWords.push(currentWord);
}

submitCustomTextButton.addEventListener('click', function () {
    customTextIndex = 0;
    playButton.textContent = 'Play';
    isPlaying = false;
    let text = customTextField.value;
    if (text.length == 0) {
        alert('Pls submit non-empty text!');
        return;
    }
    refineWords(text);
    updateScrollingButtonsStatus();
});

customTextField.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

function updateScrollingButtonsStatus () {
    previousButton.disabled = (customTextIndex > 0 ? false : true);
    nextButton.disabled = (customTextIndex < customWords.length-1 ? false : true);
}

previousButton.addEventListener('click', function () {
    isPlaying = false;
    if (customTextIndex > 0) {
        customTextIndex -= 1;
        previousButton.disabled = false;
    }
    if (customTextIndex == 0) {
        previousButton.disabled = true;
    }
    updateScrollingButtonsStatus();
    var selectedWord = customWords[customTextIndex];
    playButton.textContent = (noOfWords > 0 ? 'Resume' : 'Play');
    currentWordDiv.textContent = getSpellWord(selectedWord);
});

nextButton.addEventListener('click', function () {
    isPlaying = false;
    if (customTextIndex < customWords.length-1) {
        customTextIndex++;
        nextButton.disabled = false;
    }
    if (customTextIndex == customWords.length) {
        nextButton.disabled = true;
    }
    updateScrollingButtonsStatus();
    var selectedWord = customWords[customTextIndex];
    playButton.textContent = (noOfWords > 0 ? 'Resume' : 'Play');
    currentWordDiv.textContent = getSpellWord(selectedWord);
});

playButton.addEventListener('click', async function () {
    isPlaying = !isPlaying;
    if (playButton.textContent == 'Restart') {
        customTextIndex = 0;
    }
    playButton.textContent = (isPlaying ? 'Pause' : (noOfWords > 0 ? 'Resume' : 'Play'));
    updateScrollingButtonsStatus();
    
    while (isPlaying) {
        previousButton.disabled = (customTextIndex > 0 ? false : true);
        nextButton.disabled = (customTextIndex < customWords.length-1 ? false : true);
        if (currentMode == 'custom' && customWords.length == 0) {
            isPlaying = false;
            playButton.textContent = 'Play';
            alert("Please submit custom text!");
        }

        timePeriod = 60*1000/currentSpeed;
        let selectedWord = "";

        if (currentMode == "random") {
            let index = Math.floor(Math.random()*randomWords.length);
            selectedWord = randomWords[index];
        }

        if (currentMode == 'custom' && customWords.length != 0) {
            if (ifRandomise) {
                let index = Math.floor(Math.random()*customWords.length);
                selectedWord = customWords[index];
            }
            else {
                if (customTextIndex == customWords.length) {
                    isPlaying = false;
                    alert("Custom Text completed.");
                    playButton.textContent = 'Restart';
                    customTextIndex--;
                    currentWordDiv.textContent = getSpellWord(customWords[customTextIndex]);
                    updateScrollingButtonsStatus();
                    break;
                }
                else {
                    selectedWord = customWords[customTextIndex];
                }
                customTextIndex++;
            }
        }
        if (selectedWord.length > 0) {
            if (!ifSpecialCharacter(selectedWord)) {
                noOfWords += 1;
                noOfLetters += selectedWord.length;
                timeElapsed += timePeriod;
                avgWPM = noOfWords*1000*60/timeElapsed;
                avgLPM = noOfLetters*1000*60/timeElapsed;
                instLPM = selectedWord.length*1000*60/timePeriod;
            }
            else {
                selectedWord = getSpellWord(selectedWord);
            }
            
            avgWPMSpan.textContent = avgWPM.toFixed(2).toString();
            avgLPMSpan.textContent = avgLPM.toFixed(2).toString();
            instLPMSpan.textContent = instLPM.toFixed(2).toString();
            currentWordDiv.textContent = selectedWord;
            noOfWordsSpan.textContent = noOfWords.toString();
            noOfLettersSpan.textContent = noOfLetters.toString();
            timeElapsedSpan.textContent = getCleanTimeText(timeElapsed/1000);
            
            if (ifSpeak) speakWord(selectedWord);
        }
        await new Promise(resolve => setTimeout(resolve, timePeriod));
    }
});

resetButton.addEventListener('click', function () {
    isPlaying = false;
    noOfWords = 0;
    noOfLetters = 0;
    timeElapsed = 0;
    avgWPM = 0;
    avgLPM = 0;
    instLPM = 0;
    selectedWord = "Hello!";
    timeElapsed = 0;
    customTextIndex = 0;

    updateScrollingButtonsStatus();

    playButton.textContent = 'Play';
    avgWPMSpan.textContent = avgWPM.toString();
    avgLPMSpan.textContent = avgLPM.toString();
    instLPMSpan.textContent = instLPM.toString();
    currentWordDiv.textContent = selectedWord;
    noOfWordsSpan.textContent = noOfWords.toString();
    noOfLettersSpan.textContent = noOfLetters.toString();
    timeElapsedSpan.textContent = (timeElapsed/1000).toString() + "s";
    speechSynthesis.cancel();
});

async function loadWords () {
    const response = await fetch('words.txt');
    const text = await response.text();
    return text.split('\n').map(w => w.trim()).filter(Boolean);
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    const selectedVoice = voices[voiceDropDown.value];
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
}