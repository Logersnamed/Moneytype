

function showResults(time, words) {
    document.querySelectorAll(".test-active").forEach((test_active) => {
        test_active.style.display = "none";
    });
    document.querySelectorAll(".test-results").forEach((test_results) => {
        test_results.style.display = "";
    });

    const wpm_element = document.getElementById("wpm");
    const wpm = (words / (time / 6000));
    wpm_element.innerText = wpm.toFixed(2);

    window.electronAPI.log("Time: " + time / 100);
    window.electronAPI.log("Words typed: " + words);
}