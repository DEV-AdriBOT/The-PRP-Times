document.addEventListener('DOMContentLoaded', () => {
  const book = document.getElementById('book');
  if (!book) return;

  const storageKey = 'prp-current-issue';
  const pages = Array.from(book.querySelectorAll('.page'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const indicator = document.getElementById('page-indicator');
  const meta = document.getElementById('page-meta');
  const nav = document.getElementById('issue-nav');
  const hint = document.getElementById('reader-hint');

  const navCards = [];
  let current = 0;
  let touchStartX = null;

  const hideHint = () => {
    if (hint) {
      hint.classList.add('hidden');
    }
  };

  const issueLabel = (page) =>
    page?.dataset?.title ||
    (page?.dataset?.issue ? `Issue ${page.dataset.issue}` : `Page ${pages.indexOf(page) + 1}`);

  const issueSubtitle = (page) => page?.dataset?.subtitle || 'Placeholder edition';

  const updateButtons = () => {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
    if (indicator) {
      indicator.textContent = `${issueLabel(pages[current])} · ${current + 1}/${pages.length}`;
    }
    if (meta) {
      meta.textContent = issueSubtitle(pages[current]);
    }
    navCards.forEach((card, index) => {
      card.classList.toggle('is-active', index === current);
    });
  };

  const showPage = (index, { suppressHint = false } = {}) => {
    if (index < 0 || index >= pages.length) return;

    pages.forEach((page, i) => {
      page.classList.toggle('is-active', i === index);
      page.classList.toggle('is-before', i < index);
      page.classList.toggle('is-after', i > index);
      page.style.zIndex = pages.length - i;
    });

    current = index;
    updateButtons();

    try {
      localStorage.setItem(storageKey, pages[current].dataset.issue || String(current));
    } catch (err) {
      // ignore storage errors
    }

    if (!suppressHint) {
      hideHint();
    }
  };

  const goNext = () => {
    if (current < pages.length - 1) {
      showPage(current + 1);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      showPage(current - 1);
    }
  };

  pages.forEach((page) => {
    page.classList.add('is-after', 'is-loading');
    const iframe = page.querySelector('iframe');
    if (iframe) {
      const markLoaded = () => page.classList.remove('is-loading');
      iframe.addEventListener('load', markLoaded, { once: true });
      if (iframe.complete) {
        markLoaded();
      }
    } else {
      page.classList.remove('is-loading');
    }
  });

  if (nav) {
    pages.forEach((page, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'issue-card';
      card.innerHTML = `
        <span class="issue-card-title">${issueLabel(page)}</span>
        <span class="issue-card-subtitle">${issueSubtitle(page)}</span>
      `;
      card.addEventListener('click', () => {
        showPage(index);
        hideHint();
      });
      nav.appendChild(card);
      navCards.push(card);
    });
  }

  nextBtn.addEventListener('click', () => {
    goNext();
    hideHint();
  });
  prevBtn.addEventListener('click', () => {
    goPrev();
    hideHint();
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowRight') {
      goNext();
      hideHint();
    } else if (evt.key === 'ArrowLeft') {
      goPrev();
      hideHint();
    }
  });

  book.addEventListener('touchstart', (evt) => {
    if (evt.touches.length === 1) {
      touchStartX = evt.touches[0].clientX;
    }
  });

  book.addEventListener('touchend', (evt) => {
    if (touchStartX === null) return;
    const touchEndX = evt.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
      hideHint();
    }
    touchStartX = null;
  });

  let initialIndex = 0;
  try {
    const storedIssue = localStorage.getItem(storageKey);
    if (storedIssue) {
      const storedIndex = pages.findIndex((page) => page.dataset.issue === storedIssue);
      if (storedIndex >= 0) {
        initialIndex = storedIndex;
      }
    }
  } catch (err) {
    initialIndex = 0;
  }

  showPage(initialIndex, { suppressHint: true });
});
