const opt_elements = Array.from(document.querySelectorAll(".opt"));
const type_element = {
  time: document.getElementById("cfg_time_element"),
  words: document.getElementById("cfg_words_element"),
};
const custom_opt = document.getElementById("custom-option");
const custom_popup = document.getElementById("custom-popup");
const custom_input = document.getElementById("custom-input");

const basicOptions = {
  time: [15, 30, 60, 120],
  words: [10, 25, 50, 100],
};

let cfg;

async function setText(test_type) {
  const options = basicOptions[test_type];
  opt_elements.forEach((element, index) => {
    element.innerText = options[index];
  })
}

function updateOptionsButtons() {
  window.electronAPI.log("Updating")
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

function setCustomOpt() {
  const text = custom_input.value;
  if (text !== cfg.test[cfg.test.type]){
    if (!isNaN(parseFloat(text)) && isFinite(text) && text > 0) {
      if (cfg.test.type === "words") {
        cfg.test[cfg.test.type] = Math.ceil(text);
      } else {
        cfg.test[cfg.test.type] = text;
      }

      window.electronAPI.log(text);
  
      window.electronAPI.writeConfig(cfg);
      loadTest(cfg);
    }
    else {
      window.electronAPI.log("Not a number");
    }
  }
}

async function customOption() {
  window.disableInput(true);
  custom_popup.style.display = "grid";
  const custom_submit = document.getElementById("custom-submit");
  const custom_close = document.getElementById("custom-close");
  
  custom_input.value = '';
  custom_input.focus();

  custom_close.addEventListener("click",  () =>{
      custom_popup.style.display = "none";
      window.disableInput(false);
  })

  document.addEventListener("keydown", (input) => {
    window.electronAPI.log(input.key + " !!!Need to remove this listener!!! Line 106");

    if (input.key === "Enter") {
      setCustomOpt();

      custom_popup.style.display = "none";
      window.disableInput(false);
      updateOptionsButtons();

      return;
    }
    else if (input.key === "Escape") {
      custom_popup.style.display = "none";
      window.disableInput(false);
      return;
    }
  });

  custom_submit.addEventListener("click", () => {
    setCustomOpt();

    custom_popup.style.display = "none";
    window.disableInput(false);
    updateOptionsButtons();
    return;
  })
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
  custom_opt.addEventListener("click", () => { customOption() });
});