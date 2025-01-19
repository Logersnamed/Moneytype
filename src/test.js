const test = document.getElementById("test");
const caret = document.getElementById("caret");
const timer = document.getElementById("timer");

let testData;
let config;

let wordsTyped;
let activeWord = 0;
let activeLetter = 0;
let wordLengths = [];
let lastWordLetter = [];

let minPreloadedWords = 10;
let maxPreloadWords = 100;
let maxOverflow = 10;

let isFirst = 1;
let time = 0;
let timeLeft = 0;
var Interval;

function setClass(element, newClass) {
  element.classList.remove(element.className);
  element.classList.add(newClass);
}

function handleBackscpace(input) {
  let currWordEl = test.children[activeWord];
  let currLetterEl = currWordEl.children[activeLetter];
  let isFirstIt = true;

  // In overflow
  while (activeLetter - 1 >= wordLengths[activeWord] && (input.ctrlKey || isFirstIt)) {
    isFirstIt = false;
    --activeLetter;
    --lastWordLetter[activeWord];
    currWordEl.children[activeLetter].remove();

    moveCaret();
  }

  while (input.ctrlKey || isFirstIt) {
    // Return to previous letter
    if (activeLetter) {
      --activeLetter;
      lastWordLetter[activeWord] = activeLetter;

      currLetterEl = currWordEl.children[activeLetter];

      setClass(currLetterEl, "untyped");
      isFirstIt = false;
      moveCaret();

      continue;
    }

    // Return to previous word
    if (activeWord && isFirstIt) {
      setClass(currWordEl, "word");

      --activeWord;
      activeLetter = lastWordLetter[activeWord];

      currWordEl = test.children[activeWord];

      setClass(currWordEl, "active-word");
      isFirstIt = false;
    }

    moveCaret();

    return;
  }
}

function handleSpace() {
  if (!activeLetter || activeWord + 1 >= test.children.length) return;

  if ((config.test.words > maxPreloadWords && config.test.type === "words") || config.test.type === "time") {
    preloadWords();
  }

  setClass(test.children[activeWord], "word");

  activeLetter = 0;
  ++activeWord;
  lastWordLetter[activeWord] = activeLetter;

  setClass(test.children[activeWord], "active-word");

  moveCaret();

  return;
}

function preloadWords() {
  if (wordsTyped - activeWord < minPreloadedWords) {
    let preload = maxPreloadWords - (wordsTyped - activeWord);
    for (let i = 0; i < preload; ++i) {
      addWordToTest(getRandomWord(testData));
    }
    wordsTyped += preload;
  }
}

function startTimer() {
  clearInterval(Interval);
  Interval = setInterval(updateTime, 10);
}

function updateTime() {
  time += 1;

  if (config.test.type === "time") {
    timeLeft = config.test.time - time / 100;
    if (timeLeft <= 0) {
      stopTime();
      timeLeft = 0;
      showResults(time, activeWord + 1);
    }
    timer.innerText = timeLeft;
  } else {
    timer.innerText = time / 100;
  }
}

function stopTime() {
  clearInterval(Interval);
}

function processUserInput(input) {
  let currWordEl = test.children[activeWord];

  // Handle overflow
  if (activeLetter >= wordLengths[activeWord]) {
    if (lastWordLetter[activeWord] - wordLengths[activeWord] >= maxOverflow) return;

    const letter = document.createElement("letter");
    letter.textContent = input.key;
    letter.classList.add("overflowed");
    currWordEl.appendChild(letter);

    ++activeLetter;
    lastWordLetter[activeWord] = activeLetter;

    moveCaret();

    return;
  }

  if (isFirst) {
    startTimer();
    isFirst = 0;
  }

  let currLetterEl = currWordEl.children[activeLetter];

  setClass(currLetterEl, input.key === currLetterEl.textContent ? "correct" : "incorrect");

  ++activeLetter;
  lastWordLetter[activeWord] = activeLetter;

  moveCaret();

  if (activeWord + 1 >= test.children.length && activeLetter >= wordLengths[activeWord]) {
    stopTime();
    showResults(time, activeWord + 1);
    return;
  }
}

function moveCaret() {
  const isFromEnd = activeLetter - 1 >= 0; // Caret starts either at the begining of letter or at the end

  const currWordEl = test.children[activeWord];
  const targetLetterEl = currWordEl.children[activeLetter - isFromEnd];

  const rect = targetLetterEl.getBoundingClientRect();
  const testRect = test.getBoundingClientRect();

  const x = (isFromEnd ? rect.right : rect.left) - testRect.left;
  const y = rect.top - testRect.top;

  caret.style.transform = `translate(${x}px, ${y}px)`;
}

function getRandomWord(data) {
  let rand = Math.floor(Math.random() * data.words.length);

  return data.words[rand];
}

function addWordToTest(word) {
  const wordElement = document.createElement("div");
  wordElement.classList.add("word");
  test.appendChild(wordElement);

  word.split("").forEach((char) => {
    const letter = document.createElement("letter");
    letter.textContent = char;
    letter.classList.add("untyped");
    wordElement.appendChild(letter);
  });

  return wordElement.children.length;
}

async function loadTest(data) {
  if (!data) {
    window.electronAPI.error("loadTest data is Null for some reason");
    return;
  }

  config = await window.electronAPI.getConfig();

  if (!config) {
    window.electronAPI.error("loadTest config is Null for some reason");
    return;
  }

  test.innerHTML = "";
  timer.innerText = config.test.type === "time" ? config.test.time : 0;
  activeWord = 0;
  activeLetter = 0;
  wordLengths = [];
  lastWordLetter = [];

  isFirst = 1;
  time = 0;
  clearInterval(Interval);

  testData = data;

  const minWords = config.test.words;

  for (let i = 0; i < minWords; i++) {
    wordLengths[i] = addWordToTest(getRandomWord(data));
  }

  wordsTyped = minWords;

  setClass(test.children[activeWord], "active-word");
  moveCaret();
}

window.electronAPI.onLoadTestData((data) => {
  loadTest(data);
});