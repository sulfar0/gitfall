/* ===========================
   PLAYER & PLAYLIST
=========================== */
let songs = []; // isi dari settings.json
let currentIndex = 0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");

const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const currentCover = document.getElementById("current-cover");
const playlistEl = document.getElementById("playlist");

// Ambil JSON
function loadSongs() {
    fetch("settings.json")
        .then(res => res.json())
        .then(data => {
            songs = data;
            renderPlaylist();
            loadSongPlayer(currentIndex);
        })
        .catch(err => console.error("Gagal load JSON:", err));
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${song.cover}" alt="">
            <p>${song.title}</p>
            <small>${song.artist}</small>
        `;
        card.addEventListener("click", () => {
            currentIndex = index;
            loadSongPlayer(currentIndex);
            playSong();
        });
        playlistEl.appendChild(card);
    });
}

// Load ke player
function loadSongPlayer(index) {
    const song = songs[index];
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.src;
}

// Kontrol Play/Pause
function playSong() {
    audio.play();
    playBtn.textContent = "⏸";
}
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
    if (audio.paused) playSong();
    else pauseSong();
});

// Next / Prev
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSongPlayer(currentIndex);
    playSong();
});
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSongPlayer(currentIndex);
    playSong();
});

// Progress
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
});
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Auto next
audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSongPlayer(currentIndex);
    playSong();
});

// Volume
const volumeControl = document.getElementById("volume");
volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value / 100;
});
audio.volume = 0.5;
volumeControl.value = 50;

/* ===========================
   CAROUSEL
=========================== */
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function updateSlides() {
    slides.forEach((slide, idx) => {
        slide.classList.remove("active", "prev", "next");
        if (idx === currentSlide) {
            slide.classList.add("active");
        } else if (idx === (currentSlide - 1 + slides.length) % slides.length) {
            slide.classList.add("prev");
        } else if (idx === (currentSlide + 1) % slides.length) {
            slide.classList.add("next");
        }
    });
}

document.getElementById("nextBtn").addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
});

// Inisialisasi carousel
updateSlides();

/* ===========================
   START
=========================== */
loadSongs();
