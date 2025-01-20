const opt_elements = Array.from(document.querySelectorAll(".opt"));
const type_element = {
  time: document.getElementById("cfg_time_element"),
  words: document.getElementById("cfg_words_element"),
};

const basicOptions = {
  time: [5, 10, 20, 120],
  words: [2, 5, 10, 100],
};

var cfg;

async function setText(test_type) {
  const options = basicOptions[test_type];
  opt_elements.forEach((element, index) => {
    element.innerText = options[index];
  })
}

async function setTestType(type) {
  if (cfg.test.type === type) return;

  await writeWordCfg(type, null);
  cfg = await window.electronAPI.getConfig();
  await setText(type);
}

function notSameOption(type, content) {
  return  (type === "time" && content !== cfg.test.time) || 
          (type === "words" && content !== cfg.test.words);
}

function setTypeOption(option_element) {
  if (notSameOption(cfg.test.type, option_element.textContent)) {
    writeWordCfg(cfg.test.type, option_element.textContent);
  }
}

async function writeWordCfg(type, value) {
  try {
    await window.electronAPI.writeConfig(type, value);
    cfg = await window.electronAPI.getConfig();
    await loadTest(cfg);
  } catch (error) {
    window.electronAPI.error(`WriteWordCfg: ${error.message}`);
  }
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