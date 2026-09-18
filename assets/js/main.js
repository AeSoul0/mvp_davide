  document.getElementById('year').textContent = new Date().getFullYear();

  const LIKE_NAMESPACE = 'davidelombardipianoforte.biz';
  const LIKE_KEY = 'profile-likes';
  const likeCountEl = document.getElementById('likeCount');
  const likeBtn = document.getElementById('likeBtn');
  const likeIcon = document.getElementById('likeIcon');

  async function loadLikeCount(){
    try{
      const res = await fetch(`https://abacus.jasoncameron.dev/get/${LIKE_NAMESPACE}/${LIKE_KEY}`);
      const data = await res.json();
      likeCountEl.textContent = (data && typeof data.value === 'number') ? data.value : 0;
    }catch(e){
      likeCountEl.textContent = '—';
    }
  }

  if (likeBtn){
    likeBtn.addEventListener('click', async () => {
      likeBtn.disabled = true;
      try{
        const res = await fetch(`https://abacus.jasoncameron.dev/hit/${LIKE_NAMESPACE}/${LIKE_KEY}`);
        const data = await res.json();
        if (data && typeof data.value === 'number'){
          likeCountEl.textContent = data.value;
        }
        likeIcon.classList.remove('pulse');
        void likeIcon.offsetWidth;
        likeIcon.classList.add('pulse');
      }catch(e){
        /* silent fail, count just won't update */
      }finally{
        likeBtn.disabled = false;
      }
    });
  }

  loadLikeCount();

  const HIDDEN_TRACKS = [
    { id: 'l4zkc7KEvYM', start: 1554, title: 'Rachmaninov — Concerto n. 2' },
    { id: 'ItSJ_woWnmk', start: 45,   title: 'Čajkovskij — Concerto n. 1' },
    { id: 'MOOfoW5_2iE', start: 35,   title: 'Rachmaninov — Concerto n. 3' },
    { id: 'mNcQGsF2uIw', start: 326,  title: 'Brahms — Concerto n. 1' },
    { id: '7T4z6MI4hkU', start: 0,    title: 'Mozart — Aria da Don Giovanni' },
    { id: '-ySDS5dsXSw', start: 5,    title: 'Mozart — Ouverture, Le nozze di Figaro' }
  ];

  const audioFrame = document.getElementById('hiddenAudioFrame');
  const npBar = document.getElementById('nowPlayingBar');
  const npLabel = document.getElementById('npLabel');
  const npClose = document.getElementById('npClose');
  const allNotes = document.querySelectorAll('.hidden-note');
  let activeNoteEl = null;

  function stopHiddenTrack(){
    audioFrame.src = '';
    npBar.classList.remove('show');
    if (activeNoteEl){ activeNoteEl.classList.remove('playing'); activeNoteEl = null; }
  }

  const npOpen = document.getElementById('npOpen');

  function playHiddenTrack(track, noteEl){
    if (activeNoteEl) activeNoteEl.classList.remove('playing');
    audioFrame.src = `https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&start=${track.start}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;
    npLabel.textContent = track.title;
    if (npOpen) npOpen.href = `https://www.youtube.com/watch?v=${track.id}&t=${track.start}s`;
    npBar.classList.add('show');
    noteEl.classList.add('playing');
    activeNoteEl = noteEl;
  }

  allNotes.forEach(el => {
    const idx = parseInt(el.getAttribute('data-track'), 10);
    const track = HIDDEN_TRACKS[idx];
    if (!track) return;
    const trigger = () => {
      if (activeNoteEl === el){ stopHiddenTrack(); }
      else { playHiddenTrack(track, el); }
    };
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); trigger(); }
    });
  });

  if (npClose) npClose.addEventListener('click', stopHiddenTrack);

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
