// const container = document.getElementById("container");

let words = 25;

function loadTest(data) {
    if(!data){
        console.error("loadTest data is Null for some reason");
        return;
    }

    for (let i = 0; i < words; i++) {
        let rand = Math.floor(Math.random() * data.words.length); 

        
        console.log(data.words[rand]);
        // var text = document.createTextNode(data.words[rand]);
        // container.appendChild(text);
    }

}

module.exports = { loadTest };