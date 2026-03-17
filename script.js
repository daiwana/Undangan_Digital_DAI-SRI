/*
  script.js
  - Handles overlay opening
  - Countdown timer to 4 April 2026 09:00 WIB
  - Smooth scrolling for internal links
  - Fade-in on scroll using IntersectionObserver
*/

document.addEventListener('DOMContentLoaded', function(){
  // Overlay open button
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('openBtn');

  if(openBtn && overlay){
    openBtn.addEventListener('click', function(){
      // Prevent background scrolling while overlay is visible
      document.body.classList.add('opened');
      // ensure the page is at the very top and focus the header after opening
      try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){ window.scrollTo(0,0); }
      // add a closing class so CSS can animate scale/fade
      overlay.classList.add('closing');

      // Play background audio if available. This is triggered by a user gesture (click) so browsers allow playback.
      const audio = document.getElementById('bgAudio');
      if(audio){
        audio.play().catch(()=>{/* ignore */});
        // show the toggle now that user interacted
        const toggle = document.getElementById('audioToggle');
        if(toggle) { try{ toggle.style.display = 'flex'; }catch(e){ toggle.style.display = 'block'; } }
      }

      // small delay to allow closing animation then remove overlay
      overlay.style.transition = 'opacity .7s ease, visibility .7s ease, transform .6s ease';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';

      setTimeout(()=>{
        if(overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        // restore scrolling
        document.body.classList.remove('opened');
        // focus header/top for accessibility
        const home = document.getElementById('home');
        if(home){ try{ home.focus({preventScroll:true}); }catch(e){ home.focus(); } }
      },700);
    });

    // keyboard accessibility: Enter to open when button focused, Esc to close overlay
    openBtn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') { openBtn.click(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && document.getElementById('overlay')){
        openBtn.click();
      }
    });
  }

  // Audio toggle control (visible). If audio element not found, hide the toggle.
  (function initAudioToggle(){
    const audio = document.getElementById('bgAudio');
    const toggle = document.getElementById('audioToggle');
    if(!toggle) return;

    // Hide toggle if no audio source is present
    if(!audio || !audio.getAttribute('src')){
      toggle.style.display = 'none';
      return;
    }

    // Initially keep the toggle hidden until user opens the invitation (so it doesn't distract)
    try{ toggle.style.display = 'none'; }catch(e){ toggle.style.display = 'none'; }

    // Update toggle icon/state
    function updateState(){
      const playing = !audio.paused && !audio.ended;
      toggle.textContent = playing ? '🔈' : '🔊';
      toggle.setAttribute('aria-pressed', String(playing));
    }

    // Try to play when overlay is opened via user gesture; otherwise user can toggle
    toggle.addEventListener('click', async function(){
      try{
        if(audio.paused) await audio.play();
        else audio.pause();
      }catch(e){
        // Playback blocked or failed — show a minimal notification by toggling aria-pressed only
      }
      updateState();
    });

    // Keep button state in sync
    audio.addEventListener('play', updateState);
    audio.addEventListener('pause', updateState);
    updateState();
  })();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // Fade-in on scroll using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // animate once
      }
    });
  },{threshold:0.12});

  document.querySelectorAll('.fade-item').forEach(el=>observer.observe(el));

  // Adjust cover image focal point based on data-focus-y attribute (0..100)
  (function adjustCoverFocus(){
    const coverImg = document.querySelector('.cover-img');
    if(!coverImg) return;
    const focusY = coverImg.dataset.focusY;
    if(focusY !== undefined){
      const v = Number(focusY);
      if(!Number.isNaN(v)){
        // clamp 0..100
        const clamped = Math.max(0, Math.min(100, v));
        coverImg.style.objectPosition = `50% ${clamped}%`;
      }
    }
  })();

  // Add small stagger to fade-items for nicer entrance
  (function staggerFadeItems(){
    document.querySelectorAll('.fade-item').forEach((el, i)=>{
      el.style.transitionDelay = `${i * 120}ms`;
    });
  })();

  // Simple parallax for cover image using requestAnimationFrame (lightweight)
  (function coverParallax(){
    const coverImg = document.querySelector('.cover-img');
    if(!coverImg) return;
    let ticking = false;
    // We'll animate translateY (parallax) and a slow scale (Ken Burns) together
    function onTick(){
      const sc = window.scrollY || window.pageYOffset;
      const offset = Math.max(-40, Math.min(40, sc * 0.12));
      const t = performance.now();
      // slow oscillating scale between 1.00 and 1.06
      const scale = 1 + 0.035 * Math.sin(t * 0.00025);
      coverImg.style.transform = `translateY(${offset}px) scale(${scale})`;
      requestAnimationFrame(onTick);
    }
    requestAnimationFrame(onTick);
  })();

  // Back-to-top button
  (function backToTop(){
    const btn = document.getElementById('backToTop');
    if(!btn) return;
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    }, {passive:true});
    btn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
  })();

  // Countdown to 4 April 2026 09:00 (local time assumed)
  const endDate = new Date(2026, 3, 4, 9, 0, 0); // months are 0-indexed: 3 = April
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // declare interval variable first to avoid referencing it before initialization
  let countdownInterval = null;

  function updateCountdown(){
    const now = new Date();
    const diff = endDate - now;
    if(isNaN(diff)) return; // invalid date

    if(diff <= 0){
      // Event started or passed
      if(daysEl) daysEl.textContent = '0';
      if(hoursEl) hoursEl.textContent = '0';
      if(minutesEl) minutesEl.textContent = '0';
      if(secondsEl) secondsEl.textContent = '0';
      if(countdownInterval) clearInterval(countdownInterval);
      return;
    }

    const secs = Math.floor(diff / 1000);
    const days = Math.floor(secs / (3600*24));
    const hours = Math.floor((secs % (3600*24)) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    if(daysEl) daysEl.textContent = String(days);
    if(hoursEl) hoursEl.textContent = String(hours).padStart(2,'0');
    if(minutesEl) minutesEl.textContent = String(minutes).padStart(2,'0');
    if(secondsEl) secondsEl.textContent = String(seconds).padStart(2,'0');
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown,1000);

  // Map embed: if data-lat and data-lng attributes exist on #lokasi, use pinned map; otherwise use address
  (function initMap(){
    const lokasi = document.getElementById('lokasi');
    const mapFrame = document.getElementById('mapFrame');
    const mapsLink = document.getElementById('mapsLink');
    if(!lokasi || !mapFrame) return;

    // Prefer an explicit embed URL if provided
    const embed = lokasi.getAttribute('data-embed');
    const lat = lokasi.getAttribute('data-lat');
    const lng = lokasi.getAttribute('data-lng');
    const address = lokasi.getAttribute('data-address') || '';

    if(embed){
      // Use the provided embed HTML src (trusted from user input)
      mapFrame.src = embed;
      // mapsLink is already set in HTML to user's short link; do not override unless absent
      if(!mapsLink && address) {
        // fallback to address if mapsLink not present
        // eslint-disable-next-line no-unused-vars
        const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }
    } else if(lat && lng){
      // Use coordinates to pin the location
      const src = `https://www.google.com/maps?q=${encodeURIComponent(lat + ',' + lng)}&z=17&output=embed`;
      mapFrame.src = src;
      if(mapsLink) mapsLink.href = `https://www.google.com/maps?q=${encodeURIComponent(lat + ',' + lng)}`;
    } else if(address){
      const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
      mapFrame.src = src;
      if(mapsLink) mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    } else {
      // Fallback: hide frame when nothing to display
      mapFrame.style.display = 'none';
    }
  })();

});
