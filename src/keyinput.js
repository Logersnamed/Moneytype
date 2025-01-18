let escapeKey = "Escape";

document.addEventListener("keydown", handleInput);

function handleInput(input) {
    window.electronAPI.log(input.key);
    
    if (input.key === escapeKey) {
        (async () => {
            const config = await window.electronAPI.getConfig();
            const testData = await window.electronAPI.getTestData();
            window.loadTest(testData);
        })();
    }
    else if (input.key === "Backspace"){
        window.handleBackscpace(input);
    }
    else if (input.key.length == 1) {
        window.processUserInput(input);
    }
}