const galleryData = [
    { id: 1, src: 'assets/nature_1.png', category: 'nature', title: 'Misty Mountains' },
    { id: 2, src: 'assets/nature_2.png', category: 'nature', title: 'Serene Forest' },
    { id: 3, src: 'assets/architecture_1.png', category: 'architecture', title: 'Modern Skyscraper' },
    { id: 4, src: 'assets/architecture_2.png', category: 'architecture', title: 'Classic Archway' },
    { id: 5, src: 'assets/abstract_1.png', category: 'abstract', title: 'Digital Waves' },
    { id: 6, src: 'assets/abstract_2.png', category: 'abstract', title: 'Neon Shapes' }
];

document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const imageCaption = document.getElementById('imageCaption');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentImageIndex = 0;
    let filteredImages = [...galleryData];

    // Render gallery
    function renderGallery(images) {
        galleryGrid.innerHTML = '';
        images.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            // We store the original index to reference properly dynamically
            item.dataset.index = index;
            item.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="item-overlay">
                    <h3>${img.title}</h3>
                </div>
            `;
            item.addEventListener('click', () => openLightbox(index, images));
            galleryGrid.appendChild(item);
        });
    }

    // Filtering logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            filteredImages = filter === 'all'
                ? galleryData
                : galleryData.filter(img => img.category === filter);

            renderGallery(filteredImages);
        });
    });

    // Lightbox logic
    function openLightbox(index, currentArray) {
        currentImageIndex = index;
        updateLightboxImage(currentArray);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage(currentArray) {
        const imgData = currentArray[currentImageIndex];
        // Brief fade out if we want smoother transitions between images, 
        // but updating src directly is fastest
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.title;
        imageCaption.textContent = imgData.title;
    }

    function navigateLightbox(direction) {
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        }
        updateLightboxImage(filteredImages);
    }

    // Event Listeners for Lightbox
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => navigateLightbox('next'));
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));

    // Close on overlay click
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });

    // Initial render
    renderGallery(galleryData);
});
