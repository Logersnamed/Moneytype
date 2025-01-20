const test = document.getElementById("test");
const caret = document.getElementById("caret");
const timer = document.getElementById("timer");

let testData;
let config;

let wordsInTest = 0;

let minPreloadWords = 10;
let maxPreloadWords = 20;
let maxOverflow = 10;

let activeWord = 0;
let activeLetter = 0;

let isFirst = 1;
let time = 0;
let timeLeft = 0;
let interval;

let words = [];

function setClass(element, newClass) {
  element.className = newClass;
}

function handleBackscpace(input) {
  let currWordEl = test.children[activeWord];
  let currLetterEl = currWordEl.children[activeLetter];
  let isFirstIt = true;

  // In overflow
  while (activeLetter - 1 >= words[activeWord].wordLength && (input.ctrlKey || isFirstIt)) {
    isFirstIt = false;
    --activeLetter;

    --words[activeWord].overflow;

    --words[activeWord].lastActiveLetter;
    currWordEl.children[activeLetter].remove();

    moveCaret();
  }

  while (input.ctrlKey || isFirstIt) {
    // Return to previous letter
    if (activeLetter) {
      --activeLetter;
      words[activeWord].lastActiveLetter = activeLetter;

      currLetterEl = currWordEl.children[activeLetter];
      if (currLetterEl.className === "incorrect") {
        words[activeWord].mistakeIds.pop();
      }
      else if (currLetterEl.className === "correct") {
        words[activeWord].correctIds.pop();
      }

      setClass(currLetterEl, "untyped");
      isFirstIt = false;
      moveCaret();

      continue;
    }

    // Return to previous word
    if (activeWord && isFirstIt) {
      setClass(currWordEl, "word");

      --activeWord;
      activeLetter = words[activeWord].lastActiveLetter;

      currWordEl = test.children[activeWord];

      setClass(currWordEl, "active-word");
      isFirstIt = false;
    }

    moveCaret();

    return;
  }
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

  words.push({
    wordLength: wordElement.children.length,
    uniqueMistakeIds: [],
    mistakeIds: [],
    correctIds: [],
    overflow: 0,
    lastActiveLetter: 0,
    timeStart: 0,
    timeEnd: 0,
    time: 0,
    speed: 0,
  })

  wordsInTest++;
}

function preloadWords() {
  const wordLeftInTest = wordsInTest - activeWord;

  if (wordLeftInTest < minPreloadWords) {
    let preload;
    if (config.test.type === "words") {
      preload = config.test.words > maxPreloadWords - wordLeftInTest ? maxPreloadWords - wordLeftInTest : config.test.words;
    } else if (config.test.type === "time") {
      preload = maxPreloadWords - wordLeftInTest;
    }

    for (let i = 0; i < preload; ++i) {
      addWordToTest(getRandomWord(testData));
    }
  }
}

function handleSpace() {
  if (!activeLetter || activeWord + 1 >= test.children.length) return;

  if ((wordsInTest < config.test.words && config.test.type === "words") || config.test.type === "time") {
    preloadWords();
  }

  setClass(test.children[activeWord], "word");

  words[activeWord].timeEnd = time;
  words[activeWord].time = words[activeWord].timeEnd - words[activeWord].timeStart;
  words[activeWord].speed = 6000 / time;

  window.electronAPI.log(JSON.stringify(words[activeWord], null, 2));

  activeLetter = 0;
  ++activeWord;
  words[activeWord].lastActiveLetter = activeLetter;
  words[activeWord].timeStart = time;

  setClass(test.children[activeWord], "active-word");

  moveCaret();

  return;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(updateTime, 10);
}

function updateTime() {
  time += 1;

  if (config.test.type === "time") {
    timeLeft = config.test.time - time / 100;
    if (timeLeft <= 0) {
      stopTime();
      words[activeWord].timeEnd = time;
      words[activeWord].time = words[activeWord].timeEnd - words[activeWord].timeStart;
      words[activeWord].speed = 6000 / time;

      timeLeft = 0;
      showResults(time, activeWord + (activeLetter >= words[activeWord].wordLength && words[activeWord].mistakeIds.length === 0), words);
    }
    timer.innerText = timeLeft.toFixed(2);
  } else if (config.test.type === "words") {
    timer.innerText = (time / 100).toFixed(2);
  }
}

function stopTime() {
  clearInterval(interval);
}

function processUserInput(input) {
  let currWordEl = test.children[activeWord];

  if (isFirst) {
    words[0].timeStart = time;
    startTimer();
    isFirst = 0;
  }
  
  // Handle overflow
  if (activeLetter >= words[activeWord].wordLength) {
    if (words[activeWord].lastActiveLetter - words[activeWord].wordLength >= maxOverflow) return;

    const letter = document.createElement("letter");
    letter.textContent = input.key;
    letter.classList.add("overflowed");
    currWordEl.appendChild(letter);

    ++words[activeWord].overflow;
    if (!words[activeWord].uniqueMistakeIds.includes(activeLetter)) {
      words[activeWord].uniqueMistakeIds.push(activeLetter);
    }    

    ++activeLetter;
    words[activeWord].lastActiveLetter = activeLetter;

    moveCaret();

    return;
  }

  let currLetterEl = currWordEl.children[activeLetter];

  if (input.key === currLetterEl.textContent) {
    setClass(currLetterEl, "correct");
    words[activeWord].correctIds.push(activeLetter);
  } else {
    setClass(currLetterEl, "incorrect");
    words[activeWord].mistakeIds.push(activeLetter);

    if (!words[activeWord].uniqueMistakeIds.includes(activeLetter)) {
      words[activeWord].uniqueMistakeIds.push(activeLetter);
    }    
  }

  ++activeLetter;
  words[activeWord].lastActiveLetter = activeLetter;

  moveCaret();

  if (activeWord + 1 >= test.children.length && activeLetter >= words[activeWord].wordLength && words[activeWord].mistakeIds.length === 0) {
    stopTime();
    showResults(time, config.test.words, words);
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

async function loadTest(cfg) {
  if (!cfg) {
    window.electronAPI.error("loadTest cfg is Null for some reason");
    return;
  }

  config = cfg;

  test.innerHTML = "";

  wordsInTest = 0;
  words = [];

  timer.innerText = config.test.type === "time" ? config.test.time : 0;
  activeWord = 0;
  activeLetter = 0;

  isFirst = 1;
  time = 0;
  clearInterval(interval);

  document.querySelectorAll(".test-active").forEach((test_active) => {
    test_active.style.display = "";
  });
  document.querySelectorAll(".test-results").forEach((test_results) => {
    test_results.style.display = "none";
  });

  preloadWords();

  setClass(test.children[activeWord], "active-word");
  moveCaret();
}

window.electronAPI.loadTestData((data) => { testData = data });
window.electronAPI.loadTesto((cfg) => { loadTest(cfg) });