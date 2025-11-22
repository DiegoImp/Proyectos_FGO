
export function initAudio() {
    const audioPlayer = document.getElementById("ost-player");
    const volumeSlider = document.getElementById("volume-slider");
    const soundControl = document.querySelector(".index_element--music");
    const volumeDisplay = document.getElementById("volume-display");

    function updateVolume() {
        if (audioPlayer && volumeSlider) audioPlayer.volume = volumeSlider.value / 100;
    }

    function updateVolumeDisplay() {
        if (volumeDisplay && volumeSlider) volumeDisplay.textContent = volumeSlider.value;
    }

    function toggleAudio() {
        if (!audioPlayer) return;
        audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
    }

    if (soundControl) {
        soundControl.addEventListener("click", (e) => {
            if (e.target.id === "volume-slider") return;
            toggleAudio();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener("input", () => {
            updateVolume();
            updateVolumeDisplay();
        });
    }

    // Inicializar
    updateVolume();
    updateVolumeDisplay();

    // Escuchar evento personalizado para togglear audio desde otros módulos
    document.addEventListener('toggle-audio', () => {
        toggleAudio();
    });
}
