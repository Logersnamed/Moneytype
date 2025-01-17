// const container = document.getElementById('container');
// container.innerHTML("w");
// container.innerText("w");

// function displayDebugMessage(message) {
//   const debugContainer = document.createElement("div");
//   debugContainer.style.color = "red";
//   debugContainer.textContent = message;
//   document.body.appendChild(debugContainer);
// }


// let words = 25;

// async function loadTest(data) {
//   if (!data) {
//     console.error("loadTest data is Null for some reason");
//     return;
//   }

//   container.innerHTML("dawdawdadwawda");

//   for (let i = 0; i < words; i++) {
//     let rand = Math.floor(Math.random() * data.words.length);

//     console.log(data.words[rand]);
//     var text = document.createTextNode(data.words[rand]);
//     container.appendChild(text);
//   }
// }

// window.electronAPI.onLoadTestData((data) => {
//   loadTest(data);
// });

// window.electronAPI.onNavigationUpdate(() => {
//   displayDebugMessage("wdawdawda");
//   container.innerHTML("dawdawdadwawda");
// });