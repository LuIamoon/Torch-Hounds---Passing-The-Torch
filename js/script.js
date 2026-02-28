document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // ELEMENTS
  // =============================
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const toggleBtn = document.getElementById("soundToggle");
  const contentContainer = document.getElementById("content");
  const dustContainer = document.getElementById("dust-container");
  const downloadBtn = document.getElementById("downloadRef");

  // =============================
  // REVEAL EFFECT
  // =============================
  function animateBlocks() {
  const blocks = document.querySelectorAll(".home-block");

  blocks.forEach(block => {
    block.classList.remove("visible"); // reset
  });

  blocks.forEach((block, i) => {
    setTimeout(() => {
      block.classList.add("visible");
    }, i * 500);
  });
  }
  
  animateBlocks();
  // =============================
  // SPA PAGE LOADING
  // =============================

  async function loadPage(url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const temp = document.createElement("div");
      temp.innerHTML = html;

      const newContent = temp.querySelector("#content");
      if (!newContent) return;

      content.innerHTML = newContent.innerHTML;
      content.dataset.page = newContent.dataset.page || "";

      // Update nav highlighting
      updateActiveNav(url);

      // Call page-specific initialization (if you have a function on the page)
      if (typeof initPage === "function") initPage();

      setTimeout(() => {
        animateBlocks();
      }, 50);

    } catch (err) {
      console.error("Failed to load page:", err);
    }
  }

  function updateActiveNav(url) {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
      if (link.getAttribute("href") === url) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Intercept nav link clicks
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const url = link.getAttribute("href");
      loadPage(url);
    });
  });

  // =============================
  // BASIC SOUND EFFECTS
  // =============================
  const openSound = new Audio("./Sounds/parchment-open.mp3");
  const moveSound = new Audio("./Sounds/parchment-move.mp3");
  const typeSound = new Audio("./Sounds/quill-scratch.mp3");

  openSound.volume = 1;
  moveSound.volume = 0.5;
  typeSound.volume = 0.1;

  let soundEnabled = localStorage.getItem("soundEnabled") === "true" || true;

  // =============================
  // AMBIENT AUDIO (Web Audio API)
  // =============================
  const ambientAudio = new Audio("./Sounds/ambient-room.mp3");
  ambientAudio.loop = true;
  ambientAudio.volume = 0; // start silent

  function startAmbient(targetVolume = 0.15, fadeTime = 2000) {
  ambientAudio.play();

  const step = targetVolume / (fadeTime / 50);
  const fade = setInterval(() => {
    if (ambientAudio.volume < targetVolume) {
      ambientAudio.volume = Math.min(targetVolume, ambientAudio.volume + step);
    } else {
      clearInterval(fade);
    }
  }, 50);
  }

  function stopAmbient(fadeTime = 2000) {
  const step = ambientAudio.volume / (fadeTime / 50);

  const fade = setInterval(() => {
    if (ambientAudio.volume > 0) {
      ambientAudio.volume = Math.max(0, ambientAudio.volume - step);
    } else {
      ambientAudio.pause();
      clearInterval(fade);
    }
  }, 50);
  }

  // Toggle button
  toggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
  toggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    if (soundEnabled) {
      toggleBtn.textContent = "🔊";
      startAmbient();
    } else {
      toggleBtn.textContent = "🔇";
      stopAmbient();
    }
  });

  // Unlock audio on first interaction
  document.addEventListener("click", () => {
    if (soundEnabled) startAmbient();
  }, { once: true });

  // =============================
  // SEARCH SYSTEM
  // =============================
  let currentIndex = -1;
  let currentResults = [];

  // Load search data
  let searchData = [];
  fetch("./data.json")
    .then(res => res.json())
    .then(data => { searchData = data; });

  function handleSearchInput() {
    if (!searchData.length) return;

    if (soundEnabled) {
      const scratch = typeSound.cloneNode();
      scratch.playbackRate = 0.85 + Math.random() * 0.3;
      scratch.volume = 0.07 + Math.random() * 0.05;
      scratch.play();
    }

    const query = input.value.toLowerCase();
    results.innerHTML = "";
    currentIndex = -1;

    if (!query) {
      results.innerHTML = `<div class="result-item result-empty">The crystals grow silent...</div>`;
      results.classList.add("active");
      setTimeout(() => {
        if (results.classList.contains("active")) moveSound.play();
        if (!input.value) results.classList.remove("active");
      }, 2500);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );

    if (!filtered.length) {
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

    if (!results.classList.contains("active") && filtered.length > 0 && soundEnabled) {
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

  input.addEventListener("input", handleSearchInput);
  input.value = localStorage.getItem("lastSearch") || "";
  if (input.value) handleSearchInput();

  input.addEventListener("keydown", (e) => {
    if (!currentResults.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); currentIndex = (currentIndex + 1) % currentResults.length; updateSelection(); playMoveSound(); }
    if (e.key === "ArrowUp") { e.preventDefault(); currentIndex = (currentIndex - 1 + currentResults.length) % currentResults.length; updateSelection(); playMoveSound(); }
    if (e.key === "Enter" && currentIndex >= 0) currentResults[currentIndex].click();
  });

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

  document.addEventListener("click", (e) => {
    const clickedInsideSearch = input.contains(e.target) || results.contains(e.target);
    const hasResults = results.innerHTML.trim().length > 0;
    const hasQuery = input.value.trim().length > 0;
    if (!clickedInsideSearch) {
      results.classList.remove("active");
      currentIndex = -1;
      if (hasResults && hasQuery) {
        moveSound.play();
      }
    }
  });

  input.addEventListener("focus", () => {
    const hasQuery = input.value.trim().length > 0;
    const hasResults = results.innerHTML.trim().length > 0;
    if (hasQuery && hasResults) {
      results.classList.add("active");
      openSound.currentTime = 0;
      openSound.play();
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("lastSearch", input.value);
  });

  document.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;
    e.preventDefault();
    results.classList.remove("active");
    currentIndex = -1
    moveSound.currentTime = 0
    moveSound.play();
    loadPage(href);

    function updateActiveNav(url) {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
    if (link.getAttribute("href") === url) {
      link.classList.add("active"); // highlight this link
    } else {
      link.classList.remove("active");
    }
  });
}
  });

  window.addEventListener("popstate", e => {
    if (e.state && e.state.page) loadPage(e.state.page);
  });

  // =============================
  // FALLBACK FORCE DOWNLOAD
  // =============================
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.addEventListener("click", (e) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = downloadLink.href;
    link.download = "TorchHoundRef.png"; // set filename
    document.body.appendChild(link);     // some browsers require it in DOM
    link.click();
    link.remove();
  });

  // =============================
  // DUST EFFECT
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
