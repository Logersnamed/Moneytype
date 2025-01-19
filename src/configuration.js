const cfg_time_element = document.getElementById("cfg_time_element");
const cfg_words_element = document.getElementById("cfg_words_element");

const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");

var cfg;

async function setText(test_type) {
  if (test_type === "words") {
    opt1.innerText = 2;
    opt2.innerText = 5;
    opt3.innerText = 10;
    opt4.innerText = 100;
  } else if (test_type === "time") {
    opt1.innerText = 5;
    opt2.innerText = 10;
    opt3.innerText = 20;
    opt4.innerText = 120;
  }
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

async function writeWordCfg(t_p, v_l) {
  try {
    await window.electronAPI.writeConfig(t_p, v_l);
    cfg = await window.electronAPI.getConfig();
    
    const testData = await window.electronAPI.getTestData();
    await loadTest(testData);
    
  } catch (error) {
    window.electronAPI.error(`1WriteWordCfg: ${error.message}`);
  }
}

window.electronAPI.loadConfiguration(async () => {
  cfg = await window.electronAPI.getConfig();

  await setText(cfg.test.type);

  cfg_time_element.addEventListener("click", () => { setTestType("time") });
  cfg_words_element.addEventListener("click", () => { setTestType("words") });

  opt1.addEventListener("click", () => { setTypeOption(opt1) });
  opt2.addEventListener("click", () => { setTypeOption(opt2) });
  opt3.addEventListener("click", () => { setTypeOption(opt3) });
  opt4.addEventListener("click", () => { setTypeOption(opt4) });
});