const test = document.getElementById("test");

let words = 25;
let activeWord = 0;
let activeLetter = 0;
let wordLengths = [];

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

      currLetterEl.classList.remove(currLetterEl.className);
      currLetterEl.classList.add("untyped");
    } else if (activeWord) {
      currWordEl.classList.remove(currWordEl.className);
      currWordEl.classList.add("word");

      --activeWord;
      activeLetter = wordLengths[activeWord];

      currWordEl = test.children[activeWord];

      setActiveWord(currWordEl);
    }
    return;
  } else if (input.key.length !== 1) return;

  if (input.key === " ") {
    if (!activeLetter) return;
    currWordEl.classList.remove(currWordEl.className);
    currWordEl.classList.add("word");

    lastPrevLetter = activeLetter;

    ++activeWord;
    activeLetter = 0;

    setActiveWord(test.children[activeWord]);
  } else if (input.key === currLetterEl.textContent) {
    currLetterEl.classList.remove(currLetterEl.className);
    currLetterEl.classList.add("correct");

    ++activeLetter;
  } else if (input.key !== currLetterEl.textContent) {
    currLetterEl.classList.remove(currLetterEl.className);
    currLetterEl.classList.add("incorrect");

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
  setActiveWord(test.children[activeWord]);
}

function setActiveWord(element) {
  element.classList.remove(element.className);
  element.classList.add("active-word");
}

window.electronAPI.onLoadTestData((data) => {
  loadTest(data);
});
