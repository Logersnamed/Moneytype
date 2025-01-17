const test = document.getElementById("test");

let words = 25;
let activeWord = 0;
let activeLetter = 0;
let wordLengths = [];

function setClass(element, newClass) {
  element.classList.remove(element.className);
  element.classList.add(newClass);
}

//if (input.key === "Backspace" && input.ctrlKey)
//special function for backspace
function processUserInput(input) {
  if (activeWord >= test.children.length) {
    window.electronAPI.log("No more words");
    return;
  }
  let currWordEl = test.children[activeWord];

  if (input.key === "Backspace" && activeLetter - 1 >= wordLengths[activeWord]) {
    --activeLetter;

    currWordEl.children[activeLetter].remove();

    return;
  }

  if (activeLetter >= wordLengths[activeWord] && input.key !== " " && input.key !== "Backspace") {
    if (input.key.length !== 1) return;
    const letter = document.createElement("letter");
    letter.textContent = input.key;
    letter.classList.add("overflowed");
    currWordEl.appendChild(letter);

    ++activeLetter;

    return;
  }

  let currLetterEl = currWordEl.children[activeLetter];

  if (input.key === "Backspace") {
    if (activeLetter) {
      window.electronAPI.log(activeLetter);
      --activeLetter;
      currLetterEl = currWordEl.children[activeLetter];

      setClass(currLetterEl, "untyped");
    } else if (activeWord) {
      setClass(currWordEl, "word");

      --activeWord;
      activeLetter = wordLengths[activeWord];

      currWordEl = test.children[activeWord];

      setClass(currWordEl, "active-word");
    }
    return;
  } else if (input.key.length !== 1) return;

  if (input.key === " ") {
    if (!activeLetter) return;
    setClass(currWordEl, "word");

    lastPrevLetter = activeLetter;

    ++activeWord;
    activeLetter = 0;

    setClass(test.children[activeWord], "active-word");
  } else if (input.key === currLetterEl.textContent) {
    setClass(currLetterEl, "correct");
    ++activeLetter;
  } else if (input.key !== currLetterEl.textContent) {
    setClass(currLetterEl, "incorrect");
    ++activeLetter;
  }
}

function loadTest(data) {
  if (!data) {
    window.electronAPI.error("ERROR: loadTest data is Null for some reason");
    return;
  }

  test.innerHTML = "";
  activeWord = 0;
  activeLetter = 0;
  wordLengths = [];

  for (let i = 0; i < words; i++) {
    let rand = Math.floor(Math.random() * data.words.length);

    const word = data.words[rand];

    const wordElement = document.createElement("div");
    wordElement.classList.add("word");
    test.appendChild(wordElement);

    word.split("").forEach((char) => {
      const letter = document.createElement("letter");
      letter.textContent = char;
      letter.classList.add("untyped");
      wordElement.appendChild(letter);
    });

    wordLengths[i] = wordElement.children.length;
  }
  setClass(test.children[activeWord], "active-word");
}

window.electronAPI.onLoadTestData((data) => {
  loadTest(data);
});
