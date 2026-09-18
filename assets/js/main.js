/**
 * @file assets/js/main.js
 * @description Handles interactivity for Davide Lombardi's website.
 * Includes mobile menu logic, scroll-triggered animations
 * (Intersection Observer), and a musical Easter Egg ("Hidden Notes").
 */

document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Mobile Menu ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    const toggleMenu = () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      mobileMenuBtn.setAttribute('aria-expanded', newState);
      mobileMenuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', !newState);
      document.body.style.overflow = newState ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!mobileMenu.classList.contains('open')) return;

      if (e.key === 'Escape') {
        toggleMenu();
        mobileMenuBtn.focus();
      } else if (e.key === 'Tab') {
        const focusable = mobileMenu.querySelectorAll('a[href], button');
        const first = mobileMenuBtn;
        const last = focusable.length ? focusable[focusable.length - 1] : first;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  // --- Intersection Observer for Animations ---
  // Adds the .in-view class to elements with .reveal when they enter the viewport
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observerOptions = {
      root: null, // use the viewport as container
      rootMargin: '0px 0px -10% 0px', // trigger animation slightly before fully in view
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Stop observing once animated (performance optimization)
        }
      });
    }, observerOptions);

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers that do not support IntersectionObserver
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // --- Hidden Notes (Easter Egg) ---
  const HIDDEN_TRACKS = [
    { id: 'c33q87s03h4', start: 1554, title: 'Rachmaninov — Concerto n. 2' },
    { id: 'kYJ7w4V67pQ', start: 45,   title: 'Čajkovskij — Concerto n. 1' },
    { id: 'k5q4Gf54n1I', start: 35,   title: 'Rachmaninov — Concerto n. 3' },
    { id: 'wX-yUaJ9H5g', start: 326,  title: 'Brahms — Concerto n. 1' },
    { id: '7T4z6MI4hkU', start: 0,    title: 'Mozart — Aria da Don Giovanni' },
    { id: '-ySDS5dsXSw', start: 5,    title: 'Mozart — Ouverture, Le nozze di Figaro' }
  ];

  const audioFrame = document.getElementById('hiddenAudioFrame');
  const npBar = document.getElementById('nowPlayingBar');
  const npLabel = document.getElementById('npLabel');
  const npClose = document.getElementById('npClose');
  const npOpen = document.getElementById('npOpen');
  const allNotes = document.querySelectorAll('.hidden-note');
  let activeNoteEl = null;

  function stopHiddenTrack() {
    audioFrame.src = '';
    npBar.classList.remove('show');
    if (activeNoteEl) {
      activeNoteEl.classList.remove('playing');
      activeNoteEl = null;
    }
  }

  function playHiddenTrack(track, noteEl) {
    if (activeNoteEl) activeNoteEl.classList.remove('playing');
    
    // Construct YouTube embed URL
    audioFrame.src = `https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&start=${track.start}`;
    npLabel.textContent = track.title;
    
    if (npOpen) {
      npOpen.href = `https://www.youtube.com/watch?v=${track.id}&t=${track.start}s`;
    }
    
    npBar.classList.add('show');
    noteEl.classList.add('playing');
    activeNoteEl = noteEl;
  }

  allNotes.forEach(el => {
    const idx = parseInt(el.getAttribute('data-track'), 10);
    const track = HIDDEN_TRACKS[idx];
    if (!track) return;
    
    const trigger = () => {
      if (activeNoteEl === el) {
        stopHiddenTrack();
      } else {
        playHiddenTrack(track, el);
      }
    };
    
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  if (npClose) {
    npClose.addEventListener('click', stopHiddenTrack);
  }

  // --- YouTube Facade ---
  const ytFacade = document.getElementById('yt-facade');
  if (ytFacade) {
    ytFacade.addEventListener('click', () => {
      const vid = ytFacade.getAttribute('data-vid');
      const start = ytFacade.getAttribute('data-start') || 0;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '100%');
      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&start=${start}`);
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      
      ytFacade.innerHTML = '';
      ytFacade.appendChild(iframe);
      ytFacade.style.cursor = 'default';
    });
  }
});
