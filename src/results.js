function showResults(time, words) {
    window.electronAPI.log("Time: " + time / 100);
    window.electronAPI.log("Words typed: " + words);
    window.electronAPI.log("WPM: " + words / (time / 6000));

}