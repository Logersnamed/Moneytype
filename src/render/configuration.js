const opt_elements = Array.from(document.querySelectorAll(".opt"));
const type_element = {
  time: document.getElementById("cfg_time_element"),
  words: document.getElementById("cfg_words_element"),
};

const basicOptions = {
  time: [5, 15, 60, 120],
  words: [2, 5, 50, 100],
};

let cfg;

async function setText(test_type) {
  const options = basicOptions[test_type];
  opt_elements.forEach((element, index) => {
    element.innerText = options[index];
  })
}

function updateOptionsButtons() {
  for (const type in type_element) {
    const element = type_element[type];
    element.className = (element.textContent === cfg.test.type) ? "opt-type-selected" : "opt-type";
  }

  opt_elements.forEach((element) => {
    element.className = (element.textContent === cfg.test[cfg.test.type]) ? "opt-selected" : "opt";
  })
}

async function setTypeOption(option_element) {
  if (cfg.test[cfg.test.type] !== option_element.textContent) {
    cfg.test[cfg.test.type] = await option_element.textContent;

    await window.electronAPI.writeConfig(cfg);
    loadTest(cfg);
    updateOptionsButtons();
  }
}

async function setTestType(type) {
  if (cfg.test.type === type) return;
    cfg.test.type = await type;

    await window.electronAPI.writeConfig(cfg);
    await loadTest(cfg);

    setText(type);
    updateOptionsButtons();
}

window.electronAPI.loadConfiguration(async (config) => {
  cfg = config;
  await setText(cfg.test.type);
  updateOptionsButtons();


  type_element.time.addEventListener("click", () => { setTestType("time") });
  type_element.words.addEventListener("click", () => { setTestType("words") });
  opt_elements.forEach((element) => {
    element.addEventListener("click", () => { setTypeOption(element) })
  })
});