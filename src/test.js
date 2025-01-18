const test = document.getElementById("test");
const caret = document.getElementById("caret");

let testData;
let config;

let testType;

let words;
let activeWord = 0;
let activeLetter = 0;
let wordLengths = [];
let lastWordLetter = [];

let minPreloadedWords = 10;
let maxPreloadWords = 15;
let maxOverflow = 10;

function setClass(element, newClass) {
  element.classList.remove(element.className);
  element.classList.add(newClass);
}

function handleBackscpace(input) {
  let currWordEl = test.children[activeWord];
  let currLetterEl = currWordEl.children[activeLetter];
  let isFirstIt = true;

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

function preloadWords() {
  if (words - activeWord < minPreloadedWords) {
    let preload = maxPreloadWords - (words - activeWord);
    for (let i = 0; i < preload; ++i) {
      addWordToTest(getRandomWord(testData));
    }
    words += preload;
  }
}

function processUserInput(input) {
  let currWordEl = test.children[activeWord];

  if (input.key === " ") {
    if (!activeLetter || activeWord + 1 >= test.children.length) return;

    setClass(currWordEl, "word");

    ++activeWord;
    activeLetter = 0;
    lastWordLetter[activeWord] = activeLetter;

    setClass(test.children[activeWord], "active-word");

    if (testType === "time") preloadWords();

    moveCaret();

    return;
  }

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

  let currLetterEl = currWordEl.children[activeLetter];

  setClass(currLetterEl, input.key === currLetterEl.textContent ? "correct" : "incorrect");

  ++activeLetter;
  lastWordLetter[activeWord] = activeLetter;

  moveCaret();

  if (activeWord + 1 >= test.children.length && activeLetter >= wordLengths[activeWord]) {
    showResults(52, 52);
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

async function loadConfig() {
  const configData = await window.electronAPI.getConfig();
  config = configData;
  testType = config.test.type;
  words = config.test.words;
}

function loadTest(data) {
  (async () => {
    await loadConfig();

    if (!data) {
      window.electronAPI.error("ERROR: loadTest data is Null for some reason");
      return;
    }

    if (!config) {
      window.electronAPI.error("ERROR: loadTest config is Null for some reason");
      return;
    }

    test.innerHTML = "";
    activeWord = 0;
    activeLetter = 0;
    wordLengths = [];
    lastWordLetter = [];

    testData = data;

    const minWords = testType === "time" ? minPreloadedWords : words;

    for (let i = 0; i < minWords; i++) {
      wordLengths[i] = addWordToTest(getRandomWord(data));
    }

    words = minWords;

    setClass(test.children[activeWord], "active-word");

    moveCaret();
  })();
}

window.electronAPI.onLoadTestData((data) => {
  loadTest(data);
});
