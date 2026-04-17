/**
 * INVEST QUEST — script.js
 * 기능: 스무스 스크롤, 섹션 등장 애니메이션 (Intersection Observer)
 */

// ── 1. "앱 데모 보기" 버튼 → 데모 섹션으로 스무스 스크롤 ──
document.addEventListener('DOMContentLoaded', () => {

  const demoBtn = document.getElementById('demo-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('demo');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 헤더 내 모든 앵커도 스무스 스크롤 적용
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 2. Intersection Observer: 섹션 등장 효과 ──
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 한 번 등장 후 재관찰 불필요
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,    // 요소의 12%가 보이면 트리거
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  // ── 3. 헤더 스크롤 시 그림자 강조 ──
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

});




// ── 4. 기능 카드별 이미지 팝업 ──
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalTitle = document.getElementById('imageModalTitle');
  const modalImage = document.getElementById('featurePreviewImage');
  const closeBtn = document.getElementById('imageModalClose');
  const prevBtn = document.getElementById('imagePrevBtn');
  const nextBtn = document.getElementById('imageNextBtn');
  const counter = document.getElementById('imageModalCounter');

  if (!modal || !modalTitle || !modalImage || !prevBtn || !nextBtn || !counter) return;

  let galleryImages = [];
  let currentIndex = 0;

  const buildImageList = (baseName, count) => {
    const list = [];
    for (let i = 1; i <= count; i += 1) {
      list.push(`pictures/${baseName}_${i}.png`);
    }
    return list;
  };

  const updateImage = () => {
    if (!galleryImages.length) return;
    modalImage.src = galleryImages[currentIndex];
    modalImage.alt = `${modalTitle.textContent} ${currentIndex + 1}`;
    counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  };

  const openModal = (title, baseName, count) => {
    modalTitle.textContent = title;
    galleryImages = buildImageList(baseName, count);
    currentIndex = 0;
    updateImage();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    galleryImages = [];
    currentIndex = 0;
  };

  document.querySelectorAll('.feature-card__video-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.feature-card');
      if (!card) return;
      const baseName = card.dataset.gallery || '';
      const count = Number(card.dataset.count || '1');
      const title = card.dataset.title || '기능 화면 미리보기';
      openModal(title, baseName, count);
    });
  });

  prevBtn.addEventListener('click', () => {
    if (!galleryImages.length) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateImage();
  });

  nextBtn.addEventListener('click', () => {
    if (!galleryImages.length) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateImage();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
});
