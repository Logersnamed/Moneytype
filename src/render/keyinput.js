document.addEventListener("keydown", handleInput);

let escapeKey = "Escape";
let line = 1;
let inputDisabled = false;

function setLine(value) { line = value }

function getLine() { return line }

function disableTestInput(disable) {inputDisabled = disable}

async function handleInput(input) {
    if (inputDisabled || input.metaKey || input.altKey) return;

    const y_before = window.getCurrentLetterY();
    let isBackspace = false;

    if (input.key === escapeKey  && !input.ctrlKey) {
        const cfg = await window.electronAPI.getConfig();
        window.loadTest(cfg);
        return;
    }
    else if (input.key === "Backspace"){
        window.handleBackscpace(input);
        isBackspace = true;
    }
    else if (input.key === " " && !input.ctrlKey) {
        window.handleSpace();
    }
    else if (input.key.length == 1 && !input.ctrlKey) {
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