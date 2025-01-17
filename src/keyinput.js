let escapeKey = "Escape";

document.addEventListener("keydown", handleInput);

function handleInput(input) {
    window.electronAPI.log(input.key);
    
    if (input.key === escapeKey) {
        (async () => {
            const testData = await window.electronAPI.getTestData();
            window.loadTest(testData);
        })();
    }
    else {
        window.processUserInput(input);
    }
}