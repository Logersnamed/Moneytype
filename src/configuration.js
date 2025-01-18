const ten = document.getElementById("10");
const twentyfive = document.getElementById("25");
const fifty = document.getElementById("50");
const hundred = document.getElementById("100");

ten.addEventListener("click", () => {
  writeWordCfg(10);
});

twentyfive.addEventListener("click", () => {
  writeWordCfg(25);
});

fifty.addEventListener("click", () => {
  writeWordCfg(50);
});

hundred.addEventListener("click", () => {
  writeWordCfg(100);
});

async function writeWordCfg(words) {
  try {
    await window.electronAPI.writeConfig(words);

    const testData = await window.electronAPI.getTestData();

    await loadTest(testData);
  } catch (error) {
    window.electronAPI.error(`WriteWordCfg: ${error.message}`);
  }
}