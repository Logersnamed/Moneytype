let escapeKey = "Escape";

document.addEventListener("keydown", handleInput);

let line = 1;
let inputDisabled = false;

function setLine(num) { line = num }

function getLine() { return line };

function disableInput(opt) {inputDisabled = opt};

async function handleInput(input) {
    if (inputDisabled) return;

    const y_before = window.getCurrentLetterY();
    let isBackspace = false;

    if (input.key === escapeKey) {
        const cfg = await window.electronAPI.getConfig();
        window.loadTest(cfg);
        return;
    }
    else if (input.key === "Backspace"){
        window.handleBackscpace(input);
        isBackspace = true;
    }
    else if (input.key === " ") {
        window.handleSpace();
    }
    else if (input.key.length == 1) {
        window.processUserInput(input);
    }
    else {
        return;
    }

    const y_after = window.getCurrentLetterY();

    if (y_after !== y_before) {
        isBackspace ? --line : ++line;
        if ((line !== 1 && isBackspace) || (!isBackspace && line !== 2)) {
            window.moveTest(y_before - y_after);
        }
    }

    window.moveCaret();
}