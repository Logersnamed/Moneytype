const opt_elements = Array.from(document.querySelectorAll(".opt"));
const type_element = {
  time: document.getElementById("cfg_time_element"),
  words: document.getElementById("cfg_words_element"),
};

const basicOptions = {
  time: [5, 10, 20, 120],
  words: [2, 5, 10, 100],
};

let cfg;

async function setText(test_type) {
  const options = basicOptions[test_type];
  opt_elements.forEach((element, index) => {
    element.innerText = options[index];
  })
}

async function setTypeOption(option_element) {
  if (cfg.test[cfg.test.type] !== option_element.textContent) {
    cfg.test[cfg.test.type] = await option_element.textContent;

    await window.electronAPI.writeConfig(cfg);
    loadTest(cfg);
  }
}

async function setTestType(type) {
  if (cfg.test.type === type) return;
    cfg.test.type = await type;

    await window.electronAPI.writeConfig(cfg);
    await loadTest(cfg);

    setText(type);
}

window.electronAPI.loadConfiguration(async (config) => {
  cfg = config;
  await setText(cfg.test.type);

  type_element.time.addEventListener("click", () => { setTestType("time") });
  type_element.words.addEventListener("click", () => { setTestType("words") });
  opt_elements.forEach((element) => {
    element.addEventListener("click", () => { setTypeOption(element) })
  })
});