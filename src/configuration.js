const cfg_time_element = document.getElementById("cfg_time_element");
const cfg_words_element = document.getElementById("cfg_words_element");

const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");

var cfg;

async function setText(test_type) {
  window.electronAPI.log(cfg);

  if (test_type === "words") {
    opt1.innerText = 10;
    opt2.innerText = 25;
    opt3.innerText = 50;
    opt4.innerText = 100;
  } else if (test_type === "time") {
    opt1.innerText = 15;
    opt2.innerText = 30;
    opt3.innerText = 60;
    opt4.innerText = 120;
  }
}

cfg_time_element.addEventListener("click", () => {
  (async () => {
    await writeWordCfg("time", null);

    cfg = await window.electronAPI.getConfig();
    await setText("time");
  })();
});

cfg_words_element.addEventListener("click", () => {
  (async () => {
    await writeWordCfg("words", null);

    cfg = await window.electronAPI.getConfig();
    await setText("words");
  })();
});

function notSameOption(type, content) {
  return  (type === "time" && content !== cfg.test.time) || 
          (type === "words" && content !== cfg.test.words);
}

opt1.addEventListener("click", () => {
  if (notSameOption(cfg.test.type, opt1.textContent)) {
    writeWordCfg(cfg.test.type, opt1.textContent);
  }
});

opt2.addEventListener("click", () => {
  if (notSameOption(cfg.test.type, opt2.textContent)) {
    writeWordCfg(cfg.test.type, opt2.textContent);
  }
});

opt3.addEventListener("click", () => {
  if (notSameOption(cfg.test.type, opt3.textContent)) {
    writeWordCfg(cfg.test.type, opt3.textContent);
  }
});

opt4.addEventListener("click", () => {
  if (notSameOption(cfg.test.type, opt4.textContent)) {
    writeWordCfg(cfg.test.type, opt4.textContent);
  }
});

(async () => {
  await window.electronAPI.log();

  cfg = await window.electronAPI.getConfig();

  await window.electronAPI.log(cfg.test.type);

  await setText(cfg.test.type);
})();

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