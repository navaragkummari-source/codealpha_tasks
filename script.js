document.addEventListener('DOMContentLoaded', () => {
    // Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const nextBtn = document.getElementById('nav-next');
    const prevBtn = document.getElementById('nav-prev');

    let currentIndex = 0;
    let visibleItems = [];

    // Helper to update visible items based on current filter
    const updateVisibleItems = () => {
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    };

    const openLightbox = (index) => {
        updateVisibleItems();
        currentIndex = index;
        const imgSrc = visibleItems[currentIndex].querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        // Clear src slightly after transition
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.setAttribute('src', '');
            }
        }, 300);
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxImage();
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxImage();
    };

    const updateLightboxImage = () => {
        const imgSrc = visibleItems[currentIndex].querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
    };

    // Attach click events to gallery items
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Find its index relative to currently visible items
            updateVisibleItems();
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    // Lightbox controls events
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent lightbox click
        showNext();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
});
