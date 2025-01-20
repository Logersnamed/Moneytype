let escapeKey = "Escape";

document.addEventListener("keydown", handleInput);

function handleInput(input) {
    if (input.key === escapeKey) {
        (async () => {
            const cfg = await window.electronAPI.getConfig();
            window.loadTest(cfg);
        })();
    }
    else if (input.key === "Backspace"){
        window.handleBackscpace(input);
    }
    else if (input.key === " ") {
        window.handleSpace();
    }
    else if (input.key.length == 1) {
        window.processUserInput(input);
    }
}