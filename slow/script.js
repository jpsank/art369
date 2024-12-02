// Initial cat stats
let hunger = 5;
let energy = 5;
let happiness = 5;

// Function to update the cat's status
function updateStatus() {
    const status = document.getElementById("status");
    const catImage = document.getElementById("catImage");

    if (hunger < 3) {
        status.innerText = "Status: Hungry!";
        catImage.style.backgroundImage = "url('cat-hungry.png')";
    } else if (energy < 3) {
        status.innerText = "Status: Tired!";
        catImage.style.backgroundImage = "url('cat-tired.png')";
    } else if (happiness < 3) {
        status.innerText = "Status: Sad!";
        catImage.style.backgroundImage = "url('cat-sad.png')";
    } else {
        status.innerText = "Status: Happy!";
        catImage.style.backgroundImage = "url('cat-happy.png')";
    }
}

// Play meow sound
function playMeow() {
    const audio = new Audio("cat-meow.mp3");
    audio.play();
}

// Action functions
function feedCat() {
    if (hunger < 10) hunger += 2;
    happiness += 1;
    updateStatus();
}

function playWithCat() {
    if (energy > 0) {
        energy -= 2;
        happiness += 2;
    } else {
        happiness -= 1;
    }
    updateStatus();
}

function restCat() {
    if (energy < 10) energy += 3;
    hunger -= 1;
    updateStatus();
}

function petCat() {
    const catImage = document.getElementById("catImage");
    catImage.style.transform = "scale(1.1)";
    catImage.style.transform = "rotate(5deg)";
    setTimeout(() => {
        catImage.style.transform = "rotate(-5deg)";
    }, 100);
    setTimeout(() => {
        catImage.style.transform = "scale(1)";
    }, 1000);

    happiness += 1;
    playMeow();
    updateStatus();
}

// Game timer to gradually decrease stats
setInterval(() => {
    hunger -= 1;
    energy -= 1;
    happiness -= 1;
    updateStatus();
}, 3000); // Adjust the time interval as desired
