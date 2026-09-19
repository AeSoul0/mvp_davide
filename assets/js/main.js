/**
 * @file assets/js/main.js
 * @description Handles interactivity for Davide Lombardi's website.
 *
 * Includes:
 * - navbar scroll effect
 * - accessible mobile menu with focus management
 * - scroll-triggered reveal animations
 * - musical hidden notes / YouTube mini-player
 * - YouTube facade player
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // ---------------------------------------------------------------------------
  // Initial page state
  // ---------------------------------------------------------------------------

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Preserve anchor navigation when the page is opened with a hash.
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------------------
  // Dynamic footer year
  // ---------------------------------------------------------------------------

  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------------------------
  // Navbar scroll effect
  // ---------------------------------------------------------------------------

  const navbar = document.getElementById('navbar');

  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    updateNavbar();

    window.addEventListener('scroll', updateNavbar, {
      passive: true
    });
  }

  // ---------------------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------------------

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const getFocusableElements = () => {
      return [...mobileMenu.querySelectorAll(focusableSelector)];
    };

    const setMenuState = (isOpen, moveFocus = true) => {
      mobileMenuBtn.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      mobileMenuBtn.setAttribute(
        'aria-label',
        isOpen ? 'Chiudi menu' : 'Apri menu'
      );

      mobileMenu.classList.toggle('open', isOpen);
      mobileMenuBtn.classList.toggle('open', isOpen);

      mobileMenu.setAttribute(
        'aria-hidden',
        String(!isOpen)
      );

      if (isOpen) {
        mobileMenu.removeAttribute('inert');
        document.body.style.overflow = 'hidden';

        if (moveFocus) {
          const focusableElements = getFocusableElements();

          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      } else {
        mobileMenu.setAttribute('inert', '');
        document.body.style.overflow = '';

        if (moveFocus) {
          mobileMenuBtn.focus();
        }
      }
    };

    const toggleMenu = () => {
      const isOpen =
        mobileMenuBtn.getAttribute('aria-expanded') === 'true';

      setMenuState(!isOpen);
    };

    // Ensure the initial state is correct even if the HTML is edited manually.
    setMenuState(false, false);

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          setMenuState(false, false);
        }
      });
    });

    document.addEventListener('keydown', event => {
      if (!mobileMenu.classList.contains('open')) {
        return;
      }

      // Escape closes the menu and returns focus to the menu button.
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuState(false, true);
        return;
      }

      // Trap keyboard focus inside the mobile menu.
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Intersection Observer / reveal animations
  // ---------------------------------------------------------------------------

  const revealElements = document.querySelectorAll('.reveal');

  if (
    'IntersectionObserver' in window &&
    revealElements.length > 0
  ) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('in-view');
          observerInstance.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers without IntersectionObserver.
    revealElements.forEach(element => {
      element.classList.add('in-view');
    });
  }

  // ---------------------------------------------------------------------------
  // Hidden musical notes
  // ---------------------------------------------------------------------------

  const HIDDEN_TRACKS = [
    {
      id: 'c33q87s03h4',
      start: 1554,
      title: 'Rachmaninov — Concerto n. 2'
    },
    {
      id: 'kYJ7w4V67pQ',
      start: 45,
      title: 'Čajkovskij — Concerto n. 1'
    },
    null, // Removed Rachmaninov n. 3
    null, // Removed Brahms n. 1
    {
      id: '7T4z6MI4hkU',
      start: 0,
      title: 'Mozart — Aria da Don Giovanni'
    },
    {
      id: '-ySDS5dsXSw',
      start: 5,
      title: 'Mozart — Ouverture, Le nozze di Figaro'
    }
  ];

  const audioFrame = document.getElementById('hiddenAudioFrame');
  const nowPlayingBar = document.getElementById('nowPlayingBar');
  const nowPlayingLabel = document.getElementById('npLabel');
  const nowPlayingClose = document.getElementById('npClose');
  const nowPlayingOpen = document.getElementById('npOpen');
  const hiddenNotes = document.querySelectorAll('.hidden-note');

  let activeNoteElement = null;

  const stopHiddenTrack = () => {
    if (audioFrame) {
      audioFrame.src = '';
    }

    if (nowPlayingBar) {
      nowPlayingBar.classList.remove('show');
    }

    if (activeNoteElement) {
      activeNoteElement.classList.remove('playing');
      activeNoteElement = null;
    }
  };

  const playHiddenTrack = (track, noteElement) => {
    if (!audioFrame || !nowPlayingBar || !nowPlayingLabel) {
      return;
    }

    if (activeNoteElement) {
      activeNoteElement.classList.remove('playing');
    }

    audioFrame.src =
      `https://www.youtube-nocookie.com/embed/${track.id}` +
      `?autoplay=1&start=${track.start}`;

    nowPlayingLabel.textContent = track.title;

    if (nowPlayingOpen) {
      nowPlayingOpen.href =
        `https://www.youtube.com/watch?v=${track.id}` +
        `&t=${track.start}s`;
    }

    nowPlayingBar.classList.add('show');
    noteElement.classList.add('playing');

    activeNoteElement = noteElement;
  };

  hiddenNotes.forEach(noteElement => {
    const trackIndex = Number.parseInt(
      noteElement.getAttribute('data-track') || '',
      10
    );

    const track = HIDDEN_TRACKS[trackIndex];

    if (!track) {
      return;
    }

    const triggerTrack = () => {
      if (activeNoteElement === noteElement) {
        stopHiddenTrack();
        return;
      }

      playHiddenTrack(track, noteElement);
    };

    noteElement.addEventListener('click', triggerTrack);
  });

  if (nowPlayingClose) {
    nowPlayingClose.addEventListener(
      'click',
      stopHiddenTrack
    );
  }

  // ---------------------------------------------------------------------------
  // YouTube facade
  // ---------------------------------------------------------------------------

  const youtubeFacade = document.getElementById('yt-facade');

  if (youtubeFacade) {
    youtubeFacade.addEventListener('click', () => {
      // Prevent duplicate iframe creation after the facade has been replaced.
      if (youtubeFacade.querySelector('iframe')) {
        return;
      }

      const videoId =
        youtubeFacade.getAttribute('data-vid');

      const startTime =
        youtubeFacade.getAttribute('data-start') || '0';

      if (!videoId) {
        return;
      }

      const iframe = document.createElement('iframe');

      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '100%');

      iframe.setAttribute(
        'src',
        `https://www.youtube-nocookie.com/embed/${videoId}` +
        `?autoplay=1&start=${startTime}`
      );

      iframe.setAttribute(
        'title',
        'YouTube video player'
      );

      iframe.setAttribute('frameborder', '0');

      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; ' +
        'encrypted-media; gyroscope; picture-in-picture'
      );

      iframe.setAttribute('allowfullscreen', '');

      iframe.setAttribute(
        'referrerpolicy',
        'strict-origin-when-cross-origin'
      );

      const container = document.getElementById('yt-facade-container') || youtubeFacade;
      container.innerHTML = '';
      container.appendChild(iframe);
      container.style.cursor = 'default';

      iframe.addEventListener('load', () => {
        iframe.focus();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Hero video loading
  // ---------------------------------------------------------------------------

  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = navigator.connection && navigator.connection.saveData;

    if (!prefersReducedMotion && !isSaveData) {
      const loadVideo = () => {
        const sources = heroVideo.querySelectorAll('source');
        sources.forEach(source => {
          if (source.dataset.src) {
            source.src = source.dataset.src;
          }
        });
        heroVideo.load();
        heroVideo.play().catch(e => console.warn('Autoplay prevented', e));
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadVideo);
      } else {
        setTimeout(loadVideo, 1000);
      }
    }
  }
});