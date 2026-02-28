.justify-center {
    justify-content: center;
}

.align-center {
    text-align: center;
}

body {
    margin: 2.5vh auto;
    padding: 1vh;
    min-height: 92vh;
    box-shadow: 0 0 2rem rgba(255, 248, 220, 0.85);
    border-style: groove;
    border-color: rgb(104, 72, 57);
    border-width: 0.5vh 0;
    background-image: url("../Images/grunge-paper-background.jpg");
    background-color: rgb(134, 109, 79);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    color: #1b1109;
    font-family: "Garamond", serif;
}

#nav-flex {
    display: flex;
    align-items: center;
}

.navbar {
    border-style: hidden hidden double hidden;
    border-color: #2b1a0f;
    padding: 0.5rem;
    font-size: 80%;
    @media only screen and (min-width: 450px) {
        font-size: 120%;
    }
}

#navbar-bar {
    background-color: #2b1a0f;
    padding: 1% 0.2rem;
    margin-right: 0.25rem;
    align-self: stretch;
}

#navLink {
    background-color: #491309;
    padding-top: 1.5rem;
    padding-left: 0.25rem;
    box-shadow: -0.5rem -0.5rem 1rem rgba(25, 25, 25, 0.5) inset;
    text-decoration: none;
    color: #bfa76a;
    transition: color 0.5s;
    text-transform: uppercase;
    text-shadow: 1px 1px rgb(27, 27, 27);
    border-right: 2px solid #2b1a0f;
    border-left: 2px solid #2b1a0f;
    border-bottom: 2px solid #2b1a0f;
    padding-right: 5px;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 1rem;
    transition: all 0.3s ease;
}

#navLink:hover {
    color: #e6d6a8;
    text-shadow: 0 0 4px rgba(230, 214, 168, 0.35);
}

h1 {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    box-shadow:
        0 8px 15px rgba(0, 0, 0, 0.2),  /* main drop shadow */
        0 0 6px rgba(255, 240, 200, 0.15); /* soft glow */
    transform: rotateZ(0.5deg); /* optional tiny tilt for curl illusion */
    color: #ffb36b;
    text-shadow:
    0 0 6px rgba(255, 140, 0, 0.4),
    0 0 12px rgba(255, 90, 0, 0.2);
}

#contentEntries {
    display: grid;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto auto;
}

#contentEntries a {
    padding: 1rem 2rem;
    background: #69472d;
    border-radius: 0.5rem;
    border: 2px dashed #2b1a0f;
    color: #bfa76a;
    transition: color 0.5s;
    font-size: auto;
    text-shadow: 1px 1px rgb(27, 27, 27);
    box-shadow: -0.5rem -0.5rem 1rem rgba(25, 25, 25, 0.5) inset;
}

#contentEntries a:hover {
    color: #e6d6a8;
    text-shadow: 0 0 4px rgba(230, 214, 168, 0.35);
}
#contentEntries a:active {
    color: rgb(231, 142, 101);
    animation: crystalPulse 4s infinite ease-in-out;
}

.gallery {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.gallery p {
    text-shadow:
    0 0 6px rgba(0, 0, 0, 1),
    0 0 12px rgba(0, 0, 0, 1);
}

.galleryPic {
    height: 100%;
    width: 100%;
    object-fit: contain;
}

.galleryContainer {
    flex-direction: column;
    display: flex;
    aspect-ratio: 3 / 4;
    width: clamp(150px, 35vw, 500px);
}

.search-wrapper {
    margin-top: 0.25rem;
    position: relative;
    min-width: 200px;
    width: auto;
}

#searchInput {
    width: 100%;
    padding: 0.25rem;
    font-family: "Garamond", serif;
    border: 2px solid #5a3e2b;
    border-radius: 5px;
    background-color: #d1c3a6;
    outline: none;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;

    background: #c2b49a;
    border: 1px solid #5a3e2b;
    border-radius: 2.5px;
    border-top: none;

    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

    z-index: 2;

    opacity: 0;
    visibility: hidden;
    transform: translateY(-5px);

    transition:
        opacity 0.25s ease,
        transform 0.25s ease,
        visibility 0.25s;
}

.search-results.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.result-link {
    display: block;
    padding: 5px;
    text-decoration: none;
    color: inherit;
}

.result-link:hover {
    background-color: rgba(90, 62, 43, 0.2);
}

.result-link:hover .result-title {
    color: #8b2f1a;
    /* subtle warm ink highlight */
}

.result-link.selected {
    background-color: rgba(90, 62, 43, 0.2);
}

.result-link.selected .result-title {
    color: #8b2f1a;
}

.result-title {
    color: brown;
    font-weight: bold;
    text-decoration: underline;
}

.result-type {
    color: #3f2d1f;
}

.result-item {
    border-bottom: 1px solid rgba(90, 62, 43, 0.3);
}

.result-empty {
    font-style: italic;
    opacity: 0.7;
    padding: 5px;
}

.result-none {
    color: #6b1f1f;
    font-style: italic;
    padding: 5px;
}

.result-empty,
.result-none {
    opacity: 0;
    animation: inkAppear 0.8s ease forwards;
}

@keyframes inkAppear {
    0% {
        opacity: 0;
        filter: blur(2px);
        letter-spacing: 2px;
    }

    50% {
        opacity: 0.6;
        filter: blur(1px);
    }

    100% {
        opacity: 1;
        filter: blur(0);
        letter-spacing: normal;
    }
}

@keyframes crystalPulse {
  0% { text-shadow: 0 0 3px rgba(200, 220, 255, 0.2); }
  50% { text-shadow: 0 0 6px rgba(200, 220, 255, 0.4); }
  100% { text-shadow: 0 0 3px rgba(200, 220, 255, 0.2); }
}

#downloadLink {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #8B5E3C;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;
    animation: crystalPulse 4s infinite ease-in-out;
}

#downloadLink:hover {
    background-color: #a07450;
}

#downloadLink:active {
    background-color: #5c3e28;
}

#navLink.active {
    color: rgb(127, 246, 255);
    text-shadow: 0 0 4px rgba(230, 214, 168, 0.35);
}

#navLink:active {
    color: rgb(231, 142, 101);
}

a:hover {
    color: #e6d6a8;
    text-shadow: 0 0 4px rgba(230, 214, 168, 0.35);
}

a:active {
    color: rgb(57, 208, 235);
    animation: crystalPulse 4s infinite ease-in-out;
}

.sound-toggle {
    background: rgba(151, 93, 54, 0.5);
    border: 2px dashed #5a3e2b;
    border-radius: 50%;
    font-size: 1rem;
    align-items: center;
    justify-content: center;
    padding: unset;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    margin-left: auto;
}

.sound-toggle:hover {
    background: rgba(117, 84, 55, 0.5);
}

.sound-toggle:active {
    background-color: rgba(192, 118, 69, 0.5);
}

hr {
    border-color: #2b1a0f;
    color: #2b1a0f;
    background-color: #2b1a0f;
}

.home-block {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 1s ease-out, transform 1s ease-out;
}

.home-block.visible {
    opacity: 1;
    transform: translateY(0);
}

#dust-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 5;
    /* Make sure it's above background */
}

.dust {
    position: absolute;
    background: rgba(100, 202, 205, 0.801);
    border-radius: 50%;
    opacity: 0;
    animation: floatDust linear forwards;
}

@keyframes floatDust {
    0% {
        transform: translateY(0px) translateX(0px);
        opacity: 0;
    }

    15% {
        opacity: 0.5;
    }

    80% {
        opacity: 0.4;
    }

    100% {
        transform: translateY(-100vh) translateX(var(--drift));
        opacity: 0;
    }
}

html {
    box-shadow: 0 0 2rem black inset;
}
