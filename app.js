const gameContainer = document.getElementById("game");
const startButton = document.querySelector("#start-button");
const startOverDiv = document.querySelector("#start-over");
const scoreTicker = document.querySelector("#score");
const highScore = document.querySelector("#high-score");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function updateColor(element) {
  element.style.backgroundColor = element.classList[0];
}

function flipOver() {
  for (let element of gameContainer.children) {
    if (element.dataset.status !== "matched") {
      element.style.backgroundColor = "white";
      element.classList.remove("active");
      canClick = true;
    }
  }
}

function checkMatch(element1, element2) {
  if (element1.classList[0] === element2.classList[0]) {
    return true;
  }
}

function checkGameWon() {
  let win = true;
  for (let element of gameContainer.children) {
    if (element.dataset.status !== "matched") {
      win = false;
    }
  }
  return win;
}

function displayEndingScreen() {
  gameContainer.classList.add("hidden");
  startOverDiv.classList.remove("hidden");
  highScore.innerText = `Best Score: ${localStorage.bestScore}`;
}

function restart() {
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  startOverDiv.classList.add("hidden");
  startButton.classList.remove("hidden");
  scoreTicker.classList.add("hidden");
  attempts = 0;
  scoreTicker.innerText = `Attempts: ${attempts}`;
}

function mainGuard(element) {
  if (
    element.id === "game" ||
    !canClick ||
    element.classList.contains("active")
  ) {
    return true;
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);

let currentElement = "";
let canClick = true;
let attempts = 0;
highScore.innerText = `Best Score: ${
  localStorage.bestScore ? localStorage.bestScore : 0
}`;

//eventhandlers
startButton.addEventListener("click", function () {
  gameContainer.classList.remove("hidden");
  startButton.classList.add("hidden");
  scoreTicker.classList.remove("hidden");
});

gameContainer.addEventListener("click", function (e) {
  if (mainGuard(e.target)) return;
  canClick = false;
  e.target.classList.add("active");
  if (!currentElement) {
    currentElement = e.target;
    canClick = true;
  } else {
    if (checkMatch(currentElement, e.target)) {
      currentElement.dataset.status = "matched";
      e.target.dataset.status = "matched";
      currentElement = "";
      canClick = true;
      if (checkGameWon()) {
        setTimeout(displayEndingScreen, 1000);
        const storedScore = Number(localStorage.bestScore);
        if (!storedScore) {
          localStorage.bestScore = attempts;
        } else {
          storedScore > attempts
            ? (localStorage.bestScore = attempts)
            : (localStorage.bestScore = localStorage.bestScore);
        }
      }
    } else {
      attempts++;
      scoreTicker.innerText = `Attempts: ${attempts}`;
      setTimeout(flipOver, 1000);
      currentElement = "";
    }
  }
  updateColor(e.target);
});

startOverDiv.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    restart();
  }
});
