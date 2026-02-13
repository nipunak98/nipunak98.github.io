const card = document.getElementById("card");
const heartRain = document.querySelector(".heart-rain");
const nightToggle = document.getElementById("nightToggle");
const bgMusic = document.getElementById("bgMusic");
const refreshBtn = document.getElementById("refreshBtn");
const birthdayCard = document.getElementById("birthdayCard");



const countdown = document.getElementById("countdown");
// const birthday = new Date("February 27, 2023 00:00:00");


let vallyActive = true;
let musicStarted = false;
let userMutedMusic = false;
let currentStep = -1;
let currentStory = null;   // yesStory or noStory
let branchStep = 0;        // index for yes/no story
let userChoice = null; // "yes" or "no"
let isTransitioning = false;
let heartTapCount = 0;



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

const preloadImages = [
  "images/story/img2.jpg",
  "images/story/img3.jpg",
  "images/story/img4.jpg",
  "images/story/img5.jpg",
  "images/story/img6.jpg",
  "images/story/img7.jpg",
  "images/story/img9.jpg",
  "images/story/img10.jpg",
  "images/story/img11.jpg",
  

  "images/vally/exited.webp",
  "images/vally/pointing.webp",
  "images/vally/Happy jump.webp",
  "images/vally/hands n hips.webp",
  "images/vally/nerd explain.webp",
  "images/vally/explain.webp",
  "images/vally/secret.webp",
  "images/vally/pointing up.webp",
  "images/vally/refresh.webp",
  "images/vally/sad concern.webp",
  "images/vally/laughing shy.webp",
  "images/vally/explain question.webp",
  "images/vally/music.webp",
  "images/vally/moon.webp",
  
];

/* ================= IMAGE CACHE ================= */

const imageCache = {};
let vallyReady = false;

function preloadAndDecode(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onload = async () => {
      if (img.decode) {
        try {
          await img.decode();
        } catch (e) {}
      }
      imageCache[src] = img;
      resolve();
    };
  });
}

Promise.all(
  preloadImages.map(src => preloadAndDecode(src))
).then(() => {
  vallyReady = true;
  console.log("All images fully decoded ✅");
});



function warmUpStoryImage() {
  if (!storyImage) return;

  // Use first real story image
  storyImage.src = "images/story/img2.jpg";
  storyImage.style.visibility = "hidden";

  requestAnimationFrame(() => {
    storyImage.style.visibility = "visible";
  });
}



const storySteps = [

  { text:" I Have A Little message For you...💌"
  },
  {
    
    text: "I hope This Card Brings a Smile to your Face 😊<br> and Warms your Heart 💖",
    image: "images/story/img2.jpg"
  },
  
  {
    
    text: "I Value Your Frendship A Lot, and I wanted to create something special for you on this Valentine's day 💫",
    image: "images/story/img3.jpg"
  },
  {
    
    text: "I wanna Say That you are not forgotten, you are cared for and you are Appriciated 💕",
    image: "images/story/img4.jpg"
  },
  {
    
    text: "So, Always Stay Happy, Keep Smiling Laughing and Enjoying Life💫",
    image: "images/story/img5.jpg"
  },
  {
   
    text: "And I wish you Helthy, Successful and Love filled life ahead 💖",
    image: "images/story/img66.jpg"
  },
  {
    text: "Eat healthy, Sleep well, Take care of yourself,  and never forget to be kind to yourself and others 💫",
    image: "images/story/img7.jpg"

  },
  {
    
    text: "I know we have some ups and downs between us, but no matter what you can always count on me to be there for you Mate.",
    image:  "images/story/img9.jpg"
  },
  {
    
    text: "I hope that this card can be a little reminder of how much you are cared and valued, not just by me but by many people around you.",
    image:  "images/story/img11.jpg"
  },

  {
    
    text: "so i have one question to ask you.",
    image: "images/story/img6.jpg"
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
// });

card.addEventListener("click", () => {
  if (vallyActive) return;

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

  if (isTransitioning) return;
  isTransitioning = true;
  nextBtn.disabled = true;

  // 👉 BRANCH STORY MODE
  if (currentStory) {
    if (branchStep < currentStory.length - 1) {
      branchStep++;
      renderBranchStory();
    }
    unlockNext();
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
      unlockNext()
    });
    return;
  }

  if (currentStep < storySteps.length - 1) {
    transitionStep(() => {
      currentStep++;
      renderStory();
      unlockNext();
    });
  }
});


/* Fade helpers */

function unlockNext() {
  requestAnimationFrame(() => {
    isTransitioning = false;
    nextBtn.disabled = false;
  });
}

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





// function renderStory() {

//   // Greeting visible
//   if (currentStep === -1) {
//     greetingStep.classList.add("active");
//     storyStep.classList.add("hidden");
//     finalChoice.classList.add("hidden");
//     return;
//   }

//   const step = storySteps[currentStep];

//   // storyImage.classList.remove("show");

//   // storyImage.onload = () => {
//   //   requestAnimationFrame(() =>{
//   //     storyImage.classList.add("show");

//   //   });
    
//   // };

//   storyImage.onload = null;
//   storyImage.src = step.image;


//   storyImage.src = step.image;
//   storyText.innerHTML = step.text.replace(/\n/g, "<br>");

//   console.log("Loading image:", step.image);


//   storyStep.classList.remove("hidden");




//   storyStep.classList.remove("active");

//     setTimeout(() => {
//       storyStep.classList.add("active");
//     }, 50); 

  

//   if (currentStep === storySteps.length - 1) {
//     finalChoice.classList.remove("hidden");
//     nextBtn.style.display = "none";
//   } else {
//     finalChoice.classList.add("hidden");
//     nextBtn.style.display = "inline-block";
//   }
// }


// function renderStory() {
//   const step = storySteps[currentStep];

//   storyText.innerHTML = step.text.replace(/\n/g, "<br>");

//   if (step.image) {
//     storyImage.src = step.image;
//     storyImage.style.display = "block";
//   } else {
//     storyImage.style.display = "none";
//   }

//   storyStep.classList.add("active");

//   if (currentStep === storySteps.length - 1) {
//     finalChoice.classList.remove("hidden");
//     nextBtn.style.display = "none";
//   } else {
//     finalChoice.classList.add("hidden");
//     nextBtn.style.display = "inline-block";
//   }
// }

function renderStory() {
  const step = storySteps[currentStep];

  //  Lock next button until paint finishes
  isTransitioning = true;
  nextBtn.disabled = true;

  // Update everything BEFORE paint
  storyText.innerHTML = step.text.replace(/\n/g, "<br>");

  if (step.image) {
    storyImage.src = step.image;
    storyImage.style.display = "block";
  } else {
    storyImage.style.display = "none";
  }

  // Force atomic paint
  requestAnimationFrame(() => {
    storyStep.classList.add("active");

    unlockNext(); //  unlock after render
  });

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

  isTransitioning = true;
  nextBtn.disabled = true;

  storyText.innerHTML = step.text.replace(/\n/g, "<br>");

  if (step.image) {
    storyImage.src = step.image;
    storyImage.style.display = "block";
  } else {
    storyImage.style.display = "none";
  }

  requestAnimationFrame(() => {
    unlockNext();
  });

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
    userMutedMusic = false;     // ✅ user allows music
    bgMusic.play().catch(() => {});
    musicToggle.textContent = "🔊";
  } else {
    userMutedMusic = true;      // ✅ user intentionally muted
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
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  burstHeart(centerX, centerY);
  heartTapCount++;
  showHeartCounter(centerX, centerY);
  

  heart.remove();

  if (!birthdayUnlocked) {
    redHeartCount++;
    if (redHeartCount === 24) unlockBirthday();
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

function showHeartCounter(x, y) {
  const counter = document.createElement("div");
  counter.className = "heart-counter";
  counter.textContent = heartTapCount;

  counter.style.left = `${x}px`;
  counter.style.top = `${y}px`;

  document.body.appendChild(counter);

  setTimeout(() => {
    counter.remove();
  }, 800);
}


function launchConfettiCannons(amountPerSide = 80) {
  const colors = [
    "#ff4d6d",
    "#ffbe0b",
    "#3a86ff",
    "#8338ec",
    "#06d6a0",
    "#ff006e"
  ];

  const total = amountPerSide * 2;

  for (let i = 0; i < total; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    const size = Math.random() * 6 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.5}px`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(piece);

    // Decide left or right cannon
    const fromLeft = i < amountPerSide;

    const startX = fromLeft ? 0 : window.innerWidth;
    const startY = window.innerHeight * 0.75;

    piece.style.left = `${startX}px`;
    piece.style.top = `${startY}px`;

    // Angle
    const angle = fromLeft
      ? Math.random() * 60 - 30      // shoot right side
      : Math.random() * 60 + 150;    // shoot left side

    const velocity = Math.random() * 8 + 8;

    let vx = Math.cos(angle * Math.PI / 180) * velocity;
    let vy = Math.sin(angle * Math.PI / 180) * velocity;


    let x = startX;
    let y = startY;
    let gravity = 0.35;
    let rotation = Math.random() * 360;
    let rotationSpeed = Math.random() * 10;

    function animate() {
      vy += gravity;
      x += vx;
      y += vy;
      rotation += rotationSpeed;

      piece.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotation}deg)`;

      if (y < window.innerHeight + 100) {
        requestAnimationFrame(animate);
      } else {
        piece.remove();
      }
    }

    animate();
  }
}


function fireCannonWaves(waves = 5, delay = 400) {
  let count = 0;

  const interval = setInterval(() => {
    launchConfettiCannons(60);
    count++;

    if (count >= waves) {
      clearInterval(interval);
    }
  }, delay);
}





/* Unlock birthday card */
function unlockBirthday() {
  birthdayUnlocked = true;
  heartRain.innerHTML = "";
  card.style.opacity = "0";
  card.style.transform = "scale(0.92)";

  updateCountdown();
  setInterval(updateCountdown, 1000);


  setTimeout(() => {
    birthdayCard.classList.remove("hidden");
    birthdayCard.classList.add("show");

    fireCannonWaves(6, 500); // 🎉 BOOM
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



function getNextBirthday() {
  const now = new Date();
  const currentYear = now.getFullYear();

  let birthday = new Date(`February 27, ${currentYear} 00:00:00`);

  // If this year's birthday already passed → use next year
  if (birthday < now) {
    birthday = new Date(`February 27, ${currentYear + 1} 00:00:00`);
  }

  return birthday;
}

let birthday = getNextBirthday();



function updateCountdown() {
  const now = new Date();
  const timeRemaining = birthday - now;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdown.textContent = `Your Birthday is in ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  } else {
    countdown.textContent = "Happy Birthday!";
    // Show the hidden birthday card here
    classList.remove("hidden")
    classList.add("show")
   
  }
}



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
    image: "images/vally/exited.webp"
  },
  {
    text: "Heyy, I know youu...😊<br> You are Sajeeka, right!?.",
    image: "images/vally/pointing.webp"
  },
  {
    text: "Guy who created me told me about you!<br> hello, how are you?<br>You are amazing as the stroies i heard about you .",
    image: "images/vally/pointing.webp"
  },
  {
    text: "well, this is a special card,<br> it’s not like the other cards<br> you have seen before.<br>💖",
    image: "images/vally/exited.webp"
  },
  {
    text: "I'm the only card in the world that is talking!<br>and creator made me just for you!<br>Isn’t that amazing?😊",
    image: "images/vally/hands n hips.webp"
  },

  {
    text: "Please allow me to show you around.",
    image: "images/vally/explain.webp"
  },

  {
    text: "This is a special card 💌<br>You can tap it to open.<br> creator Has A Message For you",
    image: "images/vally/nerd explain.webp"
  },
   {
    text: "I hope It Will Make Your day Better 💫",
    image: "images/vally/pointing up.webp"
  },

   {
    text: "Oh!, almost forgot... <br>there are three buttons.<br> the refresh button will load the card",
    image: "images/vally/refresh.webp"
  },
   {
    text: "Moon button is for the dark mode<br> in case it's too bright to your eyes.",
    image: "images/vally/moon.webp"
  },

  {
    text: "and fianlly, the music button.<br> you can turn it on and off as you like 🎵",
    image: "images/vally/music.webp"
  },

  
  {
    text: "There are tiny hearts falling too 💜❤️<br>Some are more special than others 😉",
    image: "images/vally/Happy jump.webp"
  },
  {
    text: "Pssst...<br> try tapping on the red hearts<br> if you see them!<br> They have a little surprise <br>for you 🎁",
    image: "images/vally/secret.webp"
  },
  {
    text: "I want to apologize in advance, if there are mishaps in the card.",
    image: "images/vally/sad concern.webp"
  },
  {
    text: "Creator said he tried everything <br>to make it work perfectly, <br>but you know, sometimes things just don’t go as planned 😅",
    image: "images/vally/nerd explain.webp"
  },
  {
    text: "Creator said he made me with one brain cell, so I might be a little slow sometimes 🧠💤",
    image: "images/vally/explain question.webp"
  },
  {
    text: "He said you have 2 very big brain cells,<br> so you are already smarter than me!<br> But please be patient with me<br> if I mess up sometimes 🙏",
    image: "images/vally/laughing shy.webp"

  },
   {
    text: "Okay, I think that’s all for the introduction.<br> I’ll be here if you need me!<br> Just tap the next button<br> to Read the message.",
    image: "images/vally/Happy jump.webp"
  }
];


const vallyYesEnding = [
  {
    text: "I knew it 💖<br>I could feel it somehow.",
    image: "images/vally/exited.webp"
  },
  {
    text: "Thank you for taking your time to see this card ✨",
    image: "images/vally/Happy jump.webp"
  },
  {
    text: "I’m very happy that you enjoyed it 💌",
    image: "images/vally/Happy jump.webp"
  }, 
   {
    text: "Didn't you found the surprice yet? <br> Try tapping on the red hearts if you see them!<br> They have a little surprise for you 🎁",
    image: "images/vally/nerd explain.webp"
  },
];

const vallyNoEnding = [
  {
    text: "Well, that was unexpected<br>But,that’s okay 🌱",
    image: "images/vally/laughing shy.webp"
  },
  {
    text: "Being honest is braver than saying yes for the wrong reasons.",
    image: "images/vally/laughing shy.webp"
  },
  {
    text: "Thank you for being true to your heart 💙",
    image: "images/vally/laughing shy.webp"
  },
  {
    text: "Didn't you found the surprice yet? <br> Try tapping on the red hearts if you see them!<br> They have a little surprise for you 🎁",
    image: "images/vally/nerd explain.webp"
  },
];


const yesStory = [
  {
    text: "You said yes… 💖",
    image: "images/story/img6.jpg"
  },
  {
    text: "That honestly means a lot.",
    image: "images/story/img6.jpg"
  },
  {
    text: "I’ve been waiting to hear that.",
    image: "images/story/img6.jpg"
  }
];

const noStory = [
  {
    text: "You said no… 🌱",
  },
  {
    text: "And that’s completely okay.",
  },
  {
    text: "Thank you for being honest.",
  },
 

];






// window.addEventListener("load", () => {
//   showVallyIntro();
// });

document.addEventListener("DOMContentLoaded", () => {
  warmUpStoryImage();
  showVallyIntro();
});



function showVallyIntro() {
  if (!vallyReady) {
    setTimeout(showVallyIntro, 100);
    return;
  }

  document.querySelector(".scene").classList.add("locked");
  document.querySelector(".scene").style.filter = "blur(4px)";
  vallyOverlay.classList.remove("hidden");
  vallyStep = 0;
  updateVally();
}





function updateVally() {
  const step = vallyIntro[vallyStep];

  const cached = imageCache[step.image];
  if (cached) {
    vallyImage.src = cached.src;
  } else {
    vallyImage.src = step.image; // fallback
  }

  typeVallyText(step.text);
}



 

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



// function hideVally() {
//   document.querySelector(".scene").style.filter = "none";
//   vallyOverlay.classList.add("hidden");
// }

function hideVally() {
  const scene = document.querySelector(".scene");
  scene.style.filter = "none";
  scene.classList.remove("locked");
  vallyOverlay.classList.add("hidden");

  vallyActive = false; //  allow interaction
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





function updateVallyEnding() {
  const step = vallyEnding[vallyEndingStep];

  const cached = imageCache[step.image];
  if (cached) {
    vallyImage.src = cached.src;
  } else {
    vallyImage.src = step.image;
  }

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

  // 🛑 DO NOT auto-play if user muted it manually
  if (userMutedMusic) return;

  if (!musicStarted) {
    fadeInAudio(bgMusic, 0.6, 2500);
    musicStarted = true;
  }

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }

  bgMusic.volume = 0.35;
  bgMusic.loop = true;

  musicToggle.textContent = "🔊";

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

