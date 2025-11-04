// // Get references to the elements
// const speedDropdown = document.getElementById('speedDropdown');
// const customSpeedInput = document.getElementById('customSpeed');

// // Listen for dropdown changes
// speedDropdown.addEventListener('change', function() {
//     if (this.value === 'custom') {
//         // Show the custom input field
//         customSpeedInput.style.display = 'inline-block';
//         customSpeedInput.focus(); // Automatically focus on the input
//     } else {
//         // Hide the custom input field
//         customSpeedInput.style.display = 'none';
//     }
// });

// // Function to get the current speed (in WPM)
// function getCurrentSpeed() {
//     if (speedDropdown.value === 'custom') {
//         // Return custom value, or default to 20 if empty/invalid
//         return parseInt(customSpeedInput.value) || 20;
//     } else {
//         return parseInt(speedDropdown.value);
//     }
// }

// // You can test this by calling getCurrentSpeed() later

// // Get references to tab elements
// const randomTab = document.getElementById('randomTab');
// const customTab = document.getElementById('customTab');

// // Get references to display elements
// const randomWordDisplay = document.getElementById('randomWordDisplay');
// const customTextInput = document.getElementById('customTextInput');
// const currentWordSpan = document.getElementById('currentWord');

// // Variable to track current mode
// let currentMode = 'random'; // 'random' or 'custom'

// // Tab click handlers
// randomTab.addEventListener('click', function() {
//     // Switch to random mode
//     currentMode = 'random';
    
//     // Update tab styling
//     randomTab.classList.add('active');
//     customTab.classList.remove('active');
    
//     // Show random word display, hide custom input
//     randomWordDisplay.style.display = 'flex';
//     customTextInput.style.display = 'none';
// });

// customTab.addEventListener('click', function() {
//     // Switch to custom mode
//     currentMode = 'custom';
    
//     // Update tab styling
//     customTab.classList.add('active');
//     randomTab.classList.remove('active');
    
//     // Show custom input, hide random word display
//     randomWordDisplay.style.display = 'none';
//     customTextInput.style.display = 'block';
// });

// // Function to get current mode
// function getCurrentMode() {
//     return currentMode;
// }

// // Function to update the displayed word (for random mode)
// function updateDisplayedWord(word) {
//     currentWordSpan.textContent = word;
// }

// // Function to get custom text (for custom mode)
// function getCustomText() {
//     return customTextInput.value.trim();
// }


const randomWordsToggle = document.getElementById('random-words-toggle');
const customTextToggle = document.getElementById('custom-text-toggle');

const randomWordsDisplay = document.getElementById('current-word');
const customTextDisplay = document.getElementById('custom-text-field');

let currentMode = 'random';

randomWordsToggle.addEventListener('change', function() {
    if (this.checked) {
        currentMode = 'random';
        customTextDisplay.style.display = 'none';
    }
});

customTextToggle.addEventListener('change', function () {
    if (this.checked) {
        currentMode = 'custom';
        customTextDisplay.style.display = 'block';
    }
})