document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const nodes = document.querySelectorAll('.node');
    let currentIndex = 0;
    
    if (!slider) return;
    
    const totalSlides = nodes.length;
    let isAnimating = false;

    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide !== null) {
        currentIndex = parseInt(savedSlide);
        slider.style.transition = 'none';
        goToSlide(currentIndex);
        setTimeout(() => {
            slider.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentIndex = index;
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}vw)`;
        
        nodes.forEach(node => node.classList.remove('active'));
        nodes[currentIndex].classList.add('active');
        
        localStorage.setItem('currentSlide', currentIndex);
        
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 800); 
    }

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            if (isAnimating) return;
            const index = parseInt(node.getAttribute('data-index'));
            goToSlide(index);
        });
    });

    let startX = 0;
    let endX = 0;

    window.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating) return;
        const diff = startX - endX;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }

    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        if (e.deltaY > 0) {
            goToSlide(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });
});
