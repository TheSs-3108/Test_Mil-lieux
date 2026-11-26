const track = document.getElementById('slider-track');

if (track && track.querySelectorAll('img').length > 1) {
    const images = track.querySelectorAll('img');
    const totalImages = images.length;
    const slideWidth = 100 / totalImages;
    let index = 0;

    // Largeur calculée dynamiquement selon le nombre d'images
    track.style.width = `calc(100% * ${totalImages})`;

    function changerImage() {
        index++;
        track.style.transition = "transform 2.0s cubic-bezier(0.4, 0, 0.2, 1)";
        track.style.transform = `translateX(-${index * slideWidth}%)`;

        setTimeout(() => {
            if (index >= totalImages - 1) {
                track.style.transition = "none";
                index = 0;
                track.style.transform = `translateX(0)`;
                void track.offsetWidth;
            }
        }, 2000);
    }

    // Démarre à la fin de l'écran d'intro (s'il est affiché)
    const startSlider = () => setInterval(changerImage, 7000);
    if (document.documentElement.classList.contains('has-intro')) {
        window.addEventListener('intro:done', startSlider, { once: true });
    } else {
        startSlider();
    }
}