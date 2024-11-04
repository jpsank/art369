// document.body.onkeydown = function(keypress_event){
//   var key = keypress_event.key;
//   document.getElementById("key_display").innerHTML = key;
// };

document.addEventListener("keydown", function(event) {
  // Get the key pressed
  const key = event.key;
  
  // Display the key in the #key_display div
  const keyDisplay = document.getElementById("key_display");
  keyDisplay.textContent = `You pressed: ${key}`;
  
  // Optional: Add a sound effect (if you have audio files for keys)
  // Example for playing a sound on keypress
  // if (key === "a") {
  //   new Audio("sounds/a_sound.mp3").play();
  // }

  // Optional: Add some animation or style change
  keyDisplay.style.transition = "transform 0.1s";
  keyDisplay.style.transform = "scale(1.2)";
  
  // Return to normal scale after a short delay
  setTimeout(() => {
    keyDisplay.style.transform = "scale(1)";
  }, 100);
});
