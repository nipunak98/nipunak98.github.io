const card = document.getElementById("card");
const heartRain = document.querySelector(".heart-rain");
const nightToggle = document.getElementById("nightToggle");
let manualNightMode = false;

card.addEventListener("click", () => {
  card.classList.toggle("open");
});

/* Night mode toggle button */
nightToggle.addEventListener("click", () => {
  manualNightMode = !manualNightMode;
  updateNightMode();
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
    heart.style.cursor = "pointer";
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      burstHeart(e.clientX, e.clientY);
      heart.remove();
    });
  }

  setTimeout(() => {
    heart.remove();
  }, 12000);
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
  createTapHeart(e.clientX, e.clientY);
});

/* Heart spawn rate (mobile-safe) */
setInterval(createHeart, 100);
