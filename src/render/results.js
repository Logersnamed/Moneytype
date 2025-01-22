function showResults(time, wordsTyped, words) {
    document.querySelectorAll(".test-active").forEach((test_active) => {
        test_active.style.display = "none";
    });
    document.querySelectorAll(".test-results").forEach((test_results) => {
        test_results.style.display = "";
    });

    let totalCorrectLetters = 0;
    let totalUniqueMistakes = 0;
    let totalLetters = 0;
    let totalCorrectWords = 0;

    for (let i = 0; i < wordsTyped; ++i){
        if (words[i].mistakeIds.length === 0 && words[i].overflow === 0) ++totalCorrectWords;

        totalCorrectLetters += words[i].correctIds.length - words[i].uniqueMistakeIds.length;
        totalLetters += words[i].wordLength + words[i].overflow;
    }

    const wpm_element = document.getElementById("wpm");
    const acc_element = document.getElementById("acc");
    const wpm = totalCorrectWords * 6000.0 / time;
    wpm_element.innerText = wpm.toFixed(2);
    const acc = totalCorrectLetters / totalLetters;
    acc_element.innerText = acc.toFixed(2) * 100 + "%";
}