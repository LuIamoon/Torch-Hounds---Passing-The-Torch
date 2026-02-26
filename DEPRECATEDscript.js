/* //LEGACY
  // Audio handling
  const openSound = new Audio("Sounds/parchment-open.mp3");
  const moveSound = new Audio("Sounds/parchment-move.mp3");

  const toggleBtn = document.getElementById("soundToggle");
  let soundEnabled = true;

  openSound.volume = 1;
  moveSound.volume = 0.5;

  const typeSound = new Audio("Sounds/quill-scratch.mp3");
  const ambientSound = new Audio("Sounds/ambient-room.mp3");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const ambientTrack = audioContext.createMediaElementSource(ambientSound);
    //const track = audioContext.createMediaElementSource(ambientSound);
    const ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0;
    
    ambientTrack.connect(ambientGain);
    ambientGain.connect(audioContext.destination);

    const delay = audioContext.createDelay();
    delay.delayTime.value = 0.08;
    ambientTrack.connect(delay);
    delay.connect(audioContext.destination);

    function fadeInSound(gainNode, duration = 2, finalVolume = 0.15) {
    const now = audioContext.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(finalVolume, now + duration);
    }
    function fadeOutSound(gainNode, duration = 2) {
    const now = audioContext.currentTime;
    const currentVolume = gainNode.gain.value;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(currentVolume, now);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Pause AFTER fade
    setTimeout(() => {
        ambientSound.pause();
    }, duration * 1000);
    }
// End of audio handling
*/

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const toggleBtn = document.getElementById("soundToggle");
  const dustContainer = document.getElementById("dust-container");

  // =============================
  // BASIC SOUND EFFECTS
  // =============================
  const openSound = new Audio("Sounds/parchment-open.mp3");
  const moveSound = new Audio("Sounds/parchment-move.mp3");
  const typeSound = new Audio("Sounds/quill-scratch.mp3");
  openSound.volume = 1;
  moveSound.volume = 0.5;
  typeSound.volume = 0.1;

  let soundEnabled = localStorage.getItem("soundEnabled") !== "false"; // default true

  // =============================
  // AMBIENT AUDIO (Web Audio API)
  // =============================
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const ambientGain = audioContext.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(audioContext.destination);

  let ambientBuffer = null;
  let ambientSource = null;

  fetch("Sounds/ambient-room.mp3")
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(decoded => {
      ambientBuffer = decoded;
      if (soundEnabled) startAmbient(); // restore ambient immediately
    });

  function startAmbient(finalVolume = 0.15, fadeTime = 2) {
    if (!ambientBuffer) return;
    ambientSource = audioContext.createBufferSource();
    ambientSource.buffer = ambientBuffer;
    ambientSource.loop = true;
    ambientSource.connect(ambientGain);
    ambientSource.start(0);

    const now = audioContext.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setValueAtTime(0, now);
    ambientGain.gain.linearRampToValueAtTime(finalVolume, now + fadeTime);
  }

  function stopAmbient(fadeTime = 2) {
    if (!ambientSource) return;
    const now = audioContext.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
    ambientGain.gain.linearRampToValueAtTime(0, now + fadeTime);
    setTimeout(() => {
      if (ambientSource) {
        ambientSource.stop();
        ambientSource.disconnect();
        ambientSource = null;
      }
    }, fadeTime * 1000);
  }

  // Restore toggle button text
  toggleBtn.textContent = soundEnabled ? "🔊" : "🔇";

  toggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    toggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) startAmbient();
    else stopAmbient();
  });

  document.addEventListener("click", () => {
    audioContext.resume();
    if (soundEnabled && !ambientSource) startAmbient();
  }, { once: true });

  // =============================
  // SEARCH SYSTEM WITH PERSISTENCE
  // =============================
  let currentIndex = -1;
  let currentResults = [];
  let dataCache = [];

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      dataCache = data;

      // Restore previous search
      const savedQuery = localStorage.getItem("searchQuery") || "";
      input.value = savedQuery;
      if (savedQuery) triggerSearch(savedQuery);

      // Input listener
      input.addEventListener("input", (e) => {
        const query = input.value.toLowerCase();
        localStorage.setItem("searchQuery", input.value);
        triggerSearch(query);
      });

      input.addEventListener("focus", () => {
        if (input.value.trim() && results.innerHTML.trim()) {
          results.classList.add("active");
        }
      });

      // Key navigation
      input.addEventListener("keydown", handleKeyNavigation);

      // Click outside to close
      document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
          results.classList.remove("active");
          currentIndex = -1;
        }
      });
    })
    .catch(err => console.error("Search data failed to load:", err));

  function triggerSearch(query) {
    results.innerHTML = "";
    currentIndex = -1;

    if (!query) {
      results.innerHTML = `<div class="result-item result-empty">The crystals grows silent...</div>`;
      results.classList.add("active");
      setTimeout(() => {
        if (!input.value) results.classList.remove("active");
      }, 2500);
      return;
    }

    const filtered = dataCache.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      results.innerHTML = `<div class="result-item result-none">No crystal resonates with that...</div>`;
    } else {
      filtered.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `<a href="${item.url}" class="result-link">
          <span class="result-title">${item.title}</span>
          <span class="result-type"> — ${item.type}</span>
        </a>`;
        results.appendChild(div);
      });
    }

    if (soundEnabled && filtered.length > 0) {
      openSound.currentTime = 0;
      openSound.play();
    }

    results.classList.add("active");
    currentResults = Array.from(results.querySelectorAll(".result-link"));
    currentResults.forEach((link, index) => {
      link.addEventListener("mouseenter", () => {
        currentIndex = index;
        updateSelection();
      });
    });
  }

  function handleKeyNavigation(e) {
    if (!currentResults.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % currentResults.length;
      updateSelection();
      playMoveSound();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + currentResults.length) % currentResults.length;
      updateSelection();
      playMoveSound();
    }
    if (e.key === "Enter" && currentIndex >= 0) {
      currentResults[currentIndex].click();
    }
  }

  function updateSelection() {
    currentResults.forEach(link => link.classList.remove("selected"));
    if (currentIndex >= 0) {
      currentResults[currentIndex].classList.add("selected");
      currentResults[currentIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function playMoveSound() {
    if (!soundEnabled) return;
    if (moveSound.paused) moveSound.play();
    else moveSound.currentTime = 0;
  }

  // =============================
  // DUST PARTICLES
  // =============================
  function createDust() {
    const dust = document.createElement("div");
    dust.classList.add("dust");

    const size = Math.random() * 3 + 1;
    dust.style.width = size + "px";
    dust.style.height = size + "px";

    const drift = (Math.random() - 0.5) * 80;
    dust.style.setProperty("--drift", drift + "px");

    dust.style.left = Math.random() * window.innerWidth + "px";
    dust.style.top = window.innerHeight + "px";

    const duration = 20 + Math.random() * 15;
    dust.style.animationDuration = duration + "s";

    dustContainer.appendChild(dust);
    setTimeout(() => dust.remove(), duration * 1000);
  }

  setInterval(createDust, 500);

});