const card = document.getElementById("card");
const heartRain = document.querySelector(".heart-rain");
const nightToggle = document.getElementById("nightToggle");
const bgMusic = document.getElementById("bgMusic");
const refreshBtn = document.getElementById("refreshBtn");
const birthdayCard = document.getElementById("birthdayCard");



const countdown = document.getElementById("countdown");
const birthday = new Date("February 27, 2023 00:00:00");



let musicStarted = false;
let currentStep = -1;
let currentStory = null;   // yesStory or noStory
let branchStep = 0;        // index for yes/no story
let userChoice = null; // "yes" or "no"

const greetingStep = document.getElementById("greetingStep");
const storyStep = document.getElementById("storyStep");

const storyImage = document.getElementById("storyImage");
const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");


const nextBtn = document.getElementById("nextBtn");

const finalChoice = document.getElementById("finalChoice");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const storyEndBtn = document.getElementById("storyEndBtn");




const storySteps = [

  { text:" I would like to take you on a journey.\n Actually it's a little story.In this story, you make decisions.",
    image: "images/story/img1.png"

  },
  {
    
    text: "Here's your ticket.\nGrab this. I'm at the next station waiting for you.",
    image: "images/story/img2.png"
  },
  
  {
    
    text: "You stepped onto the train.\n The train started moving, and we were on our way.",
    image: "images/story/img3.png"
  },
  {
    
    text: "The view outside was calm and beautiful.\nTime felt slower.",
    image: "images/story/img4.png"
  },
  {
    
    text: "The train stopped.\nYou stepped off.",
    image: "images/story/img5.png"
  },
  {
   
    text: "I was there when you arrived.\nI wanted to ask you something.",
    image: "images/story/img6.png"
  },
  {
    
    text: "I know everything was bit sudden, you are confused, and you might be overthinking thigs a lot recently.",
    image:  "images/story/img7.png"
  },
  {
    
    text: "But today is a special day.\nA day of love being celebreated. A day that reminds us to cherish the people we care about.",
    image:  "images/story/img6.png"
  },

  {
    
    text: "so i have one question to ask you.",
    image: "images/story/img6.png"
  }
  
];





let redHeartCount = 0;
let birthdayUnlocked = false;
let manualNightMode = false;



/* ================= STORY HANDLING ================= */

// card.addEventListener("click", () => {
//   card.classList.toggle("open");
//   heartRain.style.filter = card.classList.contains("open")
//     ? "blur(1px)"
//     : "none";

//   if (card.classList.contains("open")) {
//   if (currentStory) {
//     if (branchStep < currentStory.length - 1) {
//       branchStep++;
//       renderBranchStory();
//     }
//   } else {
//     renderStory();
//   }
// }

// });


card.addEventListener("click", () => {
  card.classList.toggle("open");
  heartRain.style.filter = card.classList.contains("open")
    ? "blur(1px)"
    : "none";
});

refreshBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // don’t close card
  location.reload();  // clean restart
});


nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  // 👉 BRANCH STORY MODE
  if (currentStory) {
    if (branchStep < currentStory.length - 1) {
      branchStep++;
      renderBranchStory();
    }
    return;
  }

  // 👉 MAIN STORY MODE
  if (currentStep === -1) {
    greetingStep.classList.remove("active");

    setTimeout(() => {
      greetingStep.classList.add("hidden");
      storyStep.classList.remove("hidden");
      currentStep = 0;
      renderStory();
    }, 600);
    return;
  }

  if (currentStep < storySteps.length - 1) {
    transitionStep(() => {
      currentStep++;
      renderStory();
    });
  }
});


/* Fade helpers */

function fadeOutGreeting(callback) {
  const greeting = document.getElementById("greetingStep");
  greeting.classList.remove("show");

  setTimeout(() => {
    greeting.classList.add("hidden");
    callback();
  }, 600);
}

function fadeOutStory(callback) {
  storyStep.classList.remove("show");
  setTimeout(callback, 600);
}

/* ---------------- TRANSITIONS ---------------- */

function transitionStep(callback) {
  storyStep.classList.remove("active");
  setTimeout(callback, 600);
}





function renderStory() {

  // Greeting visible
  if (currentStep === -1) {
    greetingStep.classList.add("active");
    storyStep.classList.add("hidden");
    finalChoice.classList.add("hidden");
    return;
  }

  const step = storySteps[currentStep];

  storyImage.classList.remove("show");

  storyImage.onload = () => {
    storyImage.classList.add("show");
  };

  storyImage.src = step.image;
  storyText.innerHTML = step.text.replace(/\n/g, "<br>");

  console.log("Loading image:", step.image);


  storyStep.classList.remove("hidden");

  // requestAnimationFrame(() => {
  //   storyStep.classList.add("active");
  // });


  storyStep.classList.remove("active");

    setTimeout(() => {
      storyStep.classList.add("active");
    }, 50); 

  

  if (currentStep === storySteps.length - 1) {
    finalChoice.classList.remove("hidden");
    nextBtn.style.display = "none";
  } else {
    finalChoice.classList.add("hidden");
    nextBtn.style.display = "inline-block";
  }
}

function startBranchStory(storyArray) {
  currentStory = storyArray;
  branchStep = 0;

  finalChoice.classList.add("hidden");
  nextBtn.style.display = "inline-block"; // 👈 SHOW NEXT
  storyEndBtn.classList.add("hidden");
  storyStep.classList.remove("hidden");
  storyStep.classList.add("active");

  renderBranchStory();
}

function renderBranchStory() {
  const step = currentStory[branchStep];

  storyImage.classList.remove("show");
  storyImage.onload = () => storyImage.classList.add("show");
  storyImage.src = step.image + "?t=" + Date.now(); // force reload

  storyText.innerHTML = step.text.replace(/\n/g, "<br>");

  if (branchStep === currentStory.length - 1) {
    nextBtn.style.display = "none";
    storyEndBtn.classList.remove("hidden");
  } else {
    nextBtn.style.display = "inline-block";
    storyEndBtn.classList.add("hidden");
  }
}



/* ================= EVERYTHING BELOW IS UNCHANGED ================= */




/* Night mode toggle button */
nightToggle.addEventListener("click", () => {
  manualNightMode = !manualNightMode;
  updateNightMode();
});


const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", (e) => {
  e.stopPropagation();

  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  }
});


/* Night mode detection */
function checkNightMode() {
  if (!manualNightMode) {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6; // 6 PM to 6 AM
    
    if (isNight) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }
  }
}

function updateNightMode() {
  if (manualNightMode) {
    document.body.classList.add("night-mode");
  } else {
    document.body.classList.remove("night-mode");
  }
}

// Check on page load
checkNightMode();

// Check every minute for time changes (only if manual mode is off)
setInterval(() => {
  if (!manualNightMode) {
    checkNightMode();
  }
}, 60000);

/* Create falling hearts */
function createHeart() {
  const heart = document.createElement("div");
  
  // 30% chance for red heart, 70% for lavender
  const isRed = Math.random() < 0.3;
  
  if (isRed) {
    heart.classList.add("heart", "red-heart");
    heart.innerText = "❤️";
  } else {
    heart.classList.add("heart");
    heart.innerText = "💜";
  }

  const size = Math.random() * 20 + 20; // size in px (20-40px)
  heart.style.fontSize = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${Math.random() * 5 + 6}s`;

  heartRain.appendChild(heart);
  
  // Make red hearts clickable
   if (isRed) {
    heart.addEventListener("click", (e) => {
  e.stopPropagation();

  const rect = heart.getBoundingClientRect();
  burstHeart(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );

  heart.remove();

  if (!birthdayUnlocked) {
    redHeartCount++;
    if (redHeartCount === 27) unlockBirthday();
  }
});
  }

  setTimeout(() => heart.remove(), 12000);
}




/* Create burst mini hearts when red heart is clicked */
function burstHeart(x, y) {
  const burstCount = 8; // number of mini hearts
  
  for (let i = 0; i < burstCount; i++) {
    const miniHeart = document.createElement("div");
    miniHeart.innerText = "❤️";
    miniHeart.style.position = "fixed";
    miniHeart.style.left = `${x}px`;
    miniHeart.style.top = `${y}px`;
    miniHeart.style.pointerEvents = "none";
    miniHeart.style.fontSize = "1.5rem";
    miniHeart.style.textShadow = "0 0 10px #ff1744, 0 0 20px rgba(255, 23, 68, 0.5)";
    miniHeart.style.filter = "drop-shadow(0 0 8px rgba(255, 23, 68, 0.4))";
    
    heartRain.appendChild(miniHeart);
    
    // Calculate angle for each heart
    const angle = (i / burstCount) * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    
    // Animate burst
    let startTime = Date.now();
    const duration = 600;
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      miniHeart.style.opacity = 1 - progress;
      miniHeart.style.transform = `translate(${endX * easeOut}px, ${endY * easeOut}px) scale(${1 - progress * 0.7})`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        miniHeart.remove();
      }
    }
    
    animate();
  }
}






/* Unlock birthday card */
function unlockBirthday() {
  birthdayUnlocked = true;
  heartRain.innerHTML = "";
  card.style.opacity = "0";
  card.style.transform = "scale(0.92)";

  setTimeout(() => {
    birthdayCard.classList.remove("hidden");
    birthdayCard.classList.add("show");
  }, 600);
}

/* Create tap hearts */
function createTapHeart(x, y) {
  const heart = document.createElement("div");
  heart.classList.add("tap-heart");
  heart.innerText = "💙";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  
  heartRain.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 600);
}

/* Listen for taps anywhere on the page */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card")) {
    createTapHeart(e.clientX, e.clientY);
  }
});

/* Heart spawn rate (mobile-safe) */
// setInterval(createHeart, 100);
const isMobile = window.innerWidth < 768;
const heartInterval = isMobile ? 350 : 220;

setInterval(createHeart, heartInterval);


function updateCountdown() {
  const now = new Date();
  const timeRemaining = birthday - now;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdown.textContent = `Birthday is in ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  } else {
    countdown.textContent = "Happy Birthday!";
    // Show the hidden birthday card here
    const birthdayCard = document.getElementById("birthdayCard");
    birthdayCard.style.display = "block";
  }
}

setInterval(updateCountdown, 1000);

[nextBtn, storyEndBtn].forEach(btn => {
  btn.addEventListener("click", e => e.stopPropagation());
});


yesBtn.addEventListener("click", (e) => {
  userChoice = "yes";
  e.stopPropagation();
  startBranchStory(yesStory);
});

noBtn.addEventListener("click", (e) => {
  userChoice = "no";
  e.stopPropagation();
  startBranchStory(noStory);
});

storyEndBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  endStory();
});



/* ================= VALLY GUIDE LOGIC ================= */

const vallyOverlay = document.getElementById("vallyOverlay");
const vallyText = document.getElementById("vallyText");
const vallyImage = document.getElementById("vallyImage");
const vallyNext = document.getElementById("vallyNext");

let vallyStep = 0;


let vallyEnding = [];
let vallyEndingStep = 0;

let isVallyTyping = false;
let vallyTypingInterval = null;




const vallyIntro = [
  {
    text: "Hi! I’m Vally 😊<br>I'm your Valentine's day card.",
    image: "images/vally/exited.png"
  },
  {
    text: "Heyy, I know youu...😊<br> You are Sajeeka, right!?.",
    image: "images/vally/pointing.png"
  },
  {
    text: "Guy who created me told me about you!<br> hello, how are you?<br>You are amazing as the stroies i heard about you .",
    image: "images/vally/pointing.png"
  },
  {
    text: "well, this is a special card,<br> it’s not like the other cards<br> you have seen before.<br>💖",
    image: "images/vally/exited.png"
  },
  {
    text: "I'm the only card in the world that is talking!<br>and creator made me just for you!<br>Isn’t that amazing?😊",
    image: "images/vally/hands n hips.png"
  },

  {
    text: "Please allow me to show you around.",
    image: "images/vally/explain.png"
  },

  {
    text: "This is a special card 💌<br>You can tap it to open.<br> creator left you a ticket <br>for a train ride inside the card",
    image: "images/vally/nerd explain.png"
  },
   {
    text: "Grab it and step on the train!<br> It will take you to a little journey.",
    image: "images/vally/pointing up.png"
  },

   {
    text: "Oh!, almost forgot... <br>there are three buttons.<br> the refresh button will load the card",
    image: "images/vally/refresh.png"
  },
   {
    text: "Moon button is for the dark mode<br> in case it's too bright to your eyes.",
    image: "images/vally/moon.png"
  },

  {
    text: "and fianlly, the music button.<br> you can turn it on and off as you like 🎵",
    image: "images/vally/music.png"
  },

  
  {
    text: "There are tiny hearts falling too 💜❤️<br>Some are more special than others 😉",
    image: "images/vally/Happy jump.png"
  },
  {
    text: "Pssst...<br> try tapping on the red hearts<br> if you see them!<br> They have a little surprise <br>for you 🎁",
    image: "images/vally/secret.png"
  },
  {
    text: "I want to apologize in advance, if there are mishaps in the card.",
    image: "images/vally/sad concern.png"
  },
  {
    text: "Creator said he tried everything <br>to make it work perfectly, <br>but you know, sometimes things just don’t go as planned 😅",
    image: "images/vally/nerd explain.png"
  },
  {
    text: "Creator said he made me with one brain cell, so I might be a little slow sometimes 🧠💤",
    image: "images/vally/explain question.png"
  },
  {
    text: "He said you have 2 very big brain cells,<br> so you are already smarter than me!<br> But please be patient with me<br> if I mess up sometimes 🙏",
    image: "images/vally/laughing shy.png"

  },
   {
    text: "Okay, I think that’s all for the introduction.<br> I’ll be here if you need me!<br> Just tap the next button<br> to start your journey!",
    image: "images/vally/Happy jump.png"
  }
];


const vallyYesEnding = [
  {
    text: "I knew it 💖<br>I could feel it somehow.",
    image: "images/vally/exited.png"
  },
  {
    text: "Love takes courage…<br>and you chose it ✨",
    image: "images/vally/Happy jump.png"
  },
  {
    text: "I’m very happy for you 💌",
    image: "images/vally/Happy jump.png"
  }, 
   {
    text: "Didn't you found the surprice yet? <br> Try tapping on the red hearts if you see them!<br> They have a little surprise for you 🎁",
    image: "images/vally/nerd explain.png"
  },
];

const vallyNoEnding = [
  {
    text: "That’s okay 🌱",
    image: "images/vally/calm.png"
  },
  {
    text: "Being honest is braver than saying yes for the wrong reasons.",
    image: "images/vally/calm.png"
  },
  {
    text: "Thank you for being true to your heart 💙",
    image: "images/vally/calm.png"
  }
];


const yesStory = [
  {
    text: "You said yes… 💖",
    image: "images/story/img8.png"
  },
  {
    text: "That honestly means a lot.",
    image: "images/story/img8.png"
  },
  {
    text: "I’ve been waiting to hear that.",
    image: "images/story/img8.png"
  }
];

const noStory = [
  {
    text: "You said no… 🌱",
    image: "images/story-no-1.png"
  },
  {
    text: "And that’s completely okay.",
    image: "images/story-no-2.png"
  },
  {
    text: "Thank you for being honest.",
    image: "images/story-no-3.png"
  }
];






window.addEventListener("load", () => {
  showVallyIntro();
});





function showVallyIntro() {
  document.querySelector(".scene").style.filter = "blur(4px)";
  vallyOverlay.classList.remove("hidden");
  vallyStep = 0;
  updateVally();
}

// function updateVally() {
//   const step = vallyIntro[vallyStep];
//   vallyText.innerHTML = step.text;
//   vallyImage.src = step.image;
// }

function updateVally() {
  const step = vallyIntro[vallyStep];
  vallyImage.src = step.image;

  typeVallyText(step.text);
}


// vallyNext.addEventListener("click", () => {

//   // INTRO FLOW
//   if (!vallyEnding.length) {
//     vallyStep++;
//     if (vallyStep < vallyIntro.length) {
//       updateVally();
//     } else {
//       hideVally();
//     }
//     return;
//   }

//   // ENDING FLOW
//   vallyEndingStep++;

//   if (vallyEndingStep < vallyEnding.length) {
//     updateVallyEnding();
//   } else {
//     vallyNext.style.display = "none"; // end of conversation
//   }
// });


vallyNext.addEventListener("click", () => {
  startBackgroundMusic(); // Ensure music starts on first interaction with Vally
  if (isVallyTyping) return; // 🚫 don’t skip typing

  // INTRO FLOW
  if (!vallyEnding.length) {
    vallyStep++;
    if (vallyStep < vallyIntro.length) {
      updateVally();
    } else {
      hideVally();
    }
    return;
  }

  // ENDING FLOW
  vallyEndingStep++;
  if (vallyEndingStep < vallyEnding.length) {
    updateVallyEnding();
  } else {
    vallyNext.style.display = "none";
  }


   setTimeout(() => {
      hideVally();
    }, 9999);

});



function hideVally() {
  document.querySelector(".scene").style.filter = "none";
  vallyOverlay.classList.add("hidden");
}

function endStory() {
  storyEndBtn.classList.add("hidden");

  card.style.opacity = "0";
  card.style.transform = "scale(0.92) rotateX(12deg)";

  setTimeout(() => {
    card.style.display = "none";
    showVallyEnding();
  }, 800);
}


// function updateVallyEnding() {
//   const step = vallyEnding[vallyEndingStep];
//   vallyText.innerHTML = step.text;
//   vallyImage.src = step.image;

//   vallyText.style.opacity = 0;

// setTimeout(() => {
//   vallyText.innerHTML = step.text;
//   vallyImage.src = step.image;
//   vallyText.style.opacity = 1;
// }, 200);
// }


function updateVallyEnding() {
  const step = vallyEnding[vallyEndingStep];
  vallyImage.src = step.image;

  typeVallyText(step.text);
}


function showVallyEnding() {
  document.querySelector(".scene").style.filter = "blur(4px)";
   vallyOverlay.classList.remove("hidden");

  // Choose correct dialogue set
  vallyEnding = userChoice === "yes"
    ? vallyYesEnding
    : vallyNoEnding;

  vallyEndingStep = 0;
  vallyNext.style.display = "inline-block";
  updateVallyEnding();
}


function fadeInAudio(audio, targetVolume = 0.6, duration = 2000) {
  audio.volume = 0;
  audio.play();

  const stepTime = 50;
  const steps = duration / stepTime;
  const volumeStep = targetVolume / steps;

  const fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + volumeStep, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, stepTime);
}


function startBackgroundMusic() {
  if (!musicStarted) {
    fadeInAudio(bgMusic, 0.6, 2500); // volume, duration
    musicStarted = true;
  }

  bgMusic.volume = 0.35;
  bgMusic.loop = true;
  bgMusic.play().catch(() => {});
  musicStarted = true;

  document.removeEventListener("click", startBackgroundMusic);
  document.removeEventListener("touchstart", startBackgroundMusic);
}

// Start music on FIRST user interaction anywhere
document.addEventListener("click", startBackgroundMusic);
document.addEventListener("touchstart", startBackgroundMusic);



function typeVallyText(htmlText, speed = 35, callback) {
  clearInterval(vallyTypingInterval);
  isVallyTyping = true;
  vallyNext.disabled = true;

  vallyText.innerHTML = "";

  let i = 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;
  const text = tempDiv.innerHTML;

  vallyTypingInterval = setInterval(() => {
    vallyText.innerHTML = text.slice(0, i);
    i++;

    if (i > text.length) {
      clearInterval(vallyTypingInterval);
      isVallyTyping = false;
      vallyNext.disabled = false;
      callback && callback();
    }
  }, speed);
}

