const opt_elements = Array.from(document.querySelectorAll(".opt"));
const type_element = {
  time: document.getElementById("cfg_time_element"),
  words: document.getElementById("cfg_words_element"),
};
const custom_opt = document.getElementById("custom-option");

const basicOptions = {
  time: [15, 30, 60, 120],
  words: [10, 25, 50, 100],
};

let cfg;

function setText(test_type) {
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

  let selectedFound = false;
  custom_opt.className = "custom-opt";

  opt_elements.forEach((element) => {
    if (element.textContent == cfg.test[cfg.test.type]) {
      element.className = "opt-selected";
      selectedFound = true;
    }
    else {
      element.className = "opt";
    }
  })

  if (!selectedFound) {
    custom_opt.className = "custom-opt-selected";
  }
}

async function setTypeOption(option_element) {
  if (cfg.test[cfg.test.type] !== option_element.textContent) {
    cfg.test[cfg.test.type] = await option_element.textContent;
    window.electronAPI.writeConfig(cfg);
    loadTest(cfg);

    updateOptionsButtons();
  }
}

async function setTestType(type) {
  if (cfg.test.type !== type) {
    cfg.test.type = await type;
    window.electronAPI.writeConfig(cfg);
    loadTest(cfg);

    setText(type);
    updateOptionsButtons();
  }
}

window.electronAPI.loadConfiguration(async (config) => {
  cfg = await config;
  setText(cfg.test.type);
  updateOptionsButtons();

  type_element.time.addEventListener("click", () => { setTestType("time") });
  type_element.words.addEventListener("click", () => { setTestType("words") });
  opt_elements.forEach((element) => {
    element.addEventListener("click", () => { setTypeOption(element) })
  })
  custom_opt.addEventListener("click", () => { customOption() });
});