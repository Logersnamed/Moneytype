const custom_input = document.getElementById("custom-input");
const custom_popup = document.getElementById("custom-popup");
const custom_close = document.getElementById("custom-close");
const custom_submit = document.getElementById("custom-submit");

function setPopupVisibility(isVisible) {
  window.disableTestInput(isVisible);
  custom_popup.style.display = isVisible ? "grid" : "none";
}

function intArrayToFloat(array, numsAfterPoint) {
  if (!array) return 0;
  let length = array.length - 1;
  let num = 0;
  for(let i = length; i >= 0; --i) {
    num += array[i] * (Math.pow(10, length - i - numsAfterPoint));
  }
  return num;
}

function getTimeFromText(text) {
  let time = {
    hrs: 0,
    min: 0,
    sec: 0,
  }
  let currNumbers = [];
  let numsAfterPoint = 0;
  let isFloat = false;

  for (const char of text) {
    if(!isNaN(parseFloat(char))) {
      currNumbers.push(char);
      if (isFloat) ++numsAfterPoint;
      continue;
    } 
    else if (char === 's' || char === 'S') {
      time.sec += intArrayToFloat(currNumbers, numsAfterPoint);
    } 
    else if (char === 'm' || char === 'M') {
      time.min += intArrayToFloat(currNumbers, numsAfterPoint);
    } 
    else if (char === 'h' || char === 'H') {
      time.hrs += intArrayToFloat(currNumbers, numsAfterPoint);
    } 
    else if ((char === '.'  || char === ',') && !numsAfterPoint) {
      isFloat = true;
      continue;
    }
    else {
      continue;
    }

    currNumbers = [];
    numsAfterPoint = 0;
    isFloat = false;
  }

  return time.hrs * 3600 + time.min * 60 + time.sec + intArrayToFloat(currNumbers, numsAfterPoint);
}

function setCustomValue() {
  const totalTime = getTimeFromText(custom_input.value);

  if (totalTime !== cfg.test[cfg.test.type]){
    if (totalTime) {
      cfg.test[cfg.test.type] = cfg.test.type === "words" ? Math.ceil(totalTime) : totalTime;
      window.electronAPI.writeConfig(cfg);
      loadTest(cfg);
    } 
    else {
      window.electronAPI.log("Not a number");
    }
  }
}

function customKeyInput(input) {
  if (input.key === "Enter" || input.key === "Escape") {
    if (input.key === "Enter") {
      setCustomValue();
      updateOptionsButtons();
    }

    setPopupVisibility(false);
    document.removeEventListener("keydown", customKeyInput);
  }
}

function submitOption() {
  setCustomValue();
  setPopupVisibility(false);
  window.updateOptionsButtons();

  custom_submit.removeEventListener("click", submitOption);
}

function closePopup() {
  setPopupVisibility(false);
  custom_close.removeEventListener("click", closePopup);
}

function customOption() {
  setPopupVisibility(true);

  custom_input.value = "";
  custom_input.focus();

  document.addEventListener("keydown", customKeyInput);
  custom_submit.addEventListener("click", submitOption);
  custom_close.addEventListener("click", closePopup);
}