document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const nodes = document.querySelectorAll('.node');
    let currentIndex = 0;
    
    // Если на странице нет слайдера (например, страница фотогалереи), скрипт просто ничего не делает
    if (!slider) return;
    
    const totalSlides = nodes.length;
    let isAnimating = false;

    // Восстанавливаем позицию из localStorage при загрузке страницы,
    // чтобы при возврате из галереи остаться на том же слайде
    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide !== null) {
        currentIndex = parseInt(savedSlide);
        // Убираем анимацию для моментального перехода
        slider.style.transition = 'none';
        goToSlide(currentIndex);
        // Возвращаем анимацию обратно с небольшой задержкой
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
        
        // Сохраняем номер текущего слайда
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

    // Touch Swipe Support
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

    // Mouse Wheel Scroll Support
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        if (e.deltaY > 0) {
            goToSlide(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });
});
