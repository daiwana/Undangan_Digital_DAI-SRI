// script.js
// Interactions: cover open, audio start, smooth scroll, countdown, scroll-triggered animations

document.addEventListener('DOMContentLoaded', function() {
	const cover = document.getElementById('cover');
	const openBtn = document.getElementById('openBtn');
	const main = document.getElementById('main');
		const countdownEl = document.getElementById('countdown');
		const audio = document.getElementById('bg-music');
		const audioToggle = document.getElementById('audioToggle');
			const coverBgEl = cover ? cover.querySelector('.cover-bg') : null;

		// Prevent background scroll while cover is visible
		document.body.classList.add('no-scroll');

			// If #cover has data-bg attribute, preload it then use as background image (prevents flash)
			if (cover && cover.dataset && cover.dataset.bg) {
				const url = cover.dataset.bg.trim();
				if (url && coverBgEl) {
					const img = new Image();
					img.onload = () => {
						coverBgEl.style.backgroundImage = `url('${url}')`;
						coverBgEl.style.backgroundSize = 'cover';
						coverBgEl.style.backgroundPosition = 'center';
					};
					img.onerror = () => {
						console.debug('Cover background failed to load:', url);
					};
					img.src = url;
				}
			}

				// If hero section has data-bg, preload then set background to avoid flicker
				const heroEl = document.getElementById('hero');
				if (heroEl && heroEl.dataset && heroEl.dataset.bg) {
					const hurl = heroEl.dataset.bg.trim();
					if (hurl) {
						const himg = new Image();
						himg.onload = () => {
							// set CSS variable used by pseudo-element and reveal with class for fade-in
							heroEl.style.setProperty('--hero-bg', `url('${hurl}')`);
							heroEl.classList.add('bg-loaded');
						};
						himg.onerror = () => {
							console.debug('Hero background failed to load:', hurl);
						};
						himg.src = hurl;
					}
				}

				// Preload mempelai images (use data-src on <img> to avoid flicker)
				const mempelaiSection = document.getElementById('mempelai');
				if (mempelaiSection) {
					const imgs = mempelaiSection.querySelectorAll('img[data-src]');
					imgs.forEach(i => {
						const url = i.dataset.src.trim();
						if (!url) return;
						const p = new Image();
						p.onload = () => {
							// set src after preload to prevent layout flicker
							i.src = url;
							// set object-position if data-offset provided (e.g. data-offset="62%")
							const offset = i.dataset.offset ? i.dataset.offset.trim() : null;
							if (offset) {

					// Preload shared cover photo for section backgrounds and then add class to body
					(function preloadSectionBG(){
						const url = 'assets/cover-photo.jpg';
						const img = new Image();
						img.onload = () => {
							document.body.classList.add('bg-sections-loaded');
						};
						img.onerror = () => {
							console.debug('Section background failed to load:', url);
						};
						img.src = url;
					})();
								i.style.objectPosition = `50% ${offset}`;
							} else {
								// default slightly lower focal point so head sits a bit below center
								i.style.objectPosition = '50% 58%';
							}
							// mark loaded for CSS fade-in
							i.closest('.photo')?.classList.add('loaded');
						};
						p.onerror = () => console.debug('Mempelai image failed to load:', url);
						p.src = url;
					});
				}

	// show cover content with fade-in
	requestAnimationFrame(() => cover.classList.add('visible'));

	// Optional: set audio.src here if you have a file in the project
	// Example: audio.src = 'assets/music.mp3';

	// Pulse animation on button
	openBtn.classList.add('pulse');

	// Open invitation: fade cover out, play audio (if set), focus content
	openBtn.addEventListener('click', async function() {
			// Play music if available (user gesture required by browsers)
				if (audio && audio.src) {
					try { await audio.play(); audioToggle.classList.add('active'); audioToggle.setAttribute('aria-pressed','true'); } catch (e) { console.debug('Autoplay blocked or audio missing', e); }
				}

		cover.classList.add('opened');
		// restore page scrolling once cover is closed
		document.body.classList.remove('no-scroll');
		// reveal main content for accessibility
		main.setAttribute('aria-hidden', 'false');

		// smooth scroll to top of main
		setTimeout(() => {
			document.getElementById('hero').scrollIntoView({behavior:'smooth'});
		}, 350);
	});

		// No topbar/scroll-down — removed per user request

	// Countdown to 4 April 2026 09:00 local
	function updateCountdown() {
		const target = new Date('2026-04-04T09:00:00');
		const now = new Date();
		const diff = target - now;
		if (diff <= 0) { countdownEl.textContent = 'Telah berlangsung'; return; }
		const days = Math.floor(diff / (1000*60*60*24));
		const hours = Math.floor((diff / (1000*60*60)) % 24);
		const mins = Math.floor((diff / (1000*60)) % 60);
		const secs = Math.floor((diff / 1000) % 60);
		countdownEl.textContent = `${days} hari • ${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
	}
	updateCountdown();
	setInterval(updateCountdown,1000);

	// IntersectionObserver for section reveal
	const sections = document.querySelectorAll('.section');
	const obs = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) entry.target.classList.add('in-view');
		});
	},{threshold:0.14});
	sections.forEach(s => obs.observe(s));

	// lightweight parallax for hero background
	const hero = document.querySelector('.hero');
	function onScroll() {
		const sc = window.scrollY || window.pageYOffset;
		if (hero) hero.style.backgroundPosition = `center ${Math.min(sc * 0.2, 120)}px`;
	}
	window.addEventListener('scroll', onScroll, {passive:true});

		// Audio toggle control (floating button)
		function setAudioActive(active){
			if (!audio) return;
			if (active){
				audio.play().then(()=>{
						audioToggle.classList.add('active');
						audioToggle.setAttribute('aria-pressed','true');
				}).catch(()=>{
					// user gesture or autoplay blocked
				});
			} else {
				audio.pause();
				audioToggle.classList.remove('active');
				audioToggle.setAttribute('aria-pressed','false');
			}
		}

		if (audioToggle){
			audioToggle.addEventListener('click', function(){
				// If no audio src, toggle visual only
				if (!audio || !audio.src) {
						audioToggle.classList.toggle('active');
						const pressed = audioToggle.classList.contains('active');
						audioToggle.setAttribute('aria-pressed', pressed ? 'true' : 'false');
					return;
				}
				if (audio.paused) setAudioActive(true); else setAudioActive(false);
			});
		}

			// Initialize audio toggle state based on audio element
			if (audioToggle) {
				if (audio && audio.src && !audio.paused) {
					audioToggle.classList.add('active');
					audioToggle.setAttribute('aria-pressed','true');
				} else {
					audioToggle.classList.remove('active');
					audioToggle.setAttribute('aria-pressed','false');
				}
			}

	// enhance map buttons: open in new tab already via target=_blank
	// Accessibility: allow Enter on open button
	openBtn.addEventListener('keyup', (e) => { if (e.key === 'Enter') openBtn.click(); });

	/* ----------------------------
	   Amplop Digital interactions
	   - copy rekening to clipboard with transient notification
	   - open/close QRIS modal (click image)
	   ---------------------------- */
	const copyBtn = document.getElementById('copyRek');
	const rekeningEl = document.getElementById('rekeningNumber');
	const copyNotif = document.getElementById('copyNotif');
	const qrisImg = document.getElementById('qrisImg');

	// show transient notification for 2 seconds
	function showCopyNotif(){
		if (!copyNotif) return;
		copyNotif.classList.add('show');
		setTimeout(()=> copyNotif.classList.remove('show'), 2000);
	}

	// copy account number to clipboard
	if (copyBtn && rekeningEl){
		copyBtn.addEventListener('click', async () => {
			const text = rekeningEl.textContent.trim();
			try {
				await navigator.clipboard.writeText(text);
				showCopyNotif();
			} catch (err) {
				// fallback: create temporary input
				const tmp = document.createElement('input');
				document.body.appendChild(tmp);
				tmp.value = text;
				tmp.select();
				try { document.execCommand('copy'); showCopyNotif(); } catch(e){ console.debug('copy fallback failed', e); }
				tmp.remove();
			}
		});
	}

	// QRIS modal logic
	let modal;
	function createModal(){
		modal = document.createElement('div');
		modal.className = 'qris-modal';
		modal.innerHTML = `
			<div class="modal-inner" role="dialog" aria-modal="true">
				<button class="modal-close" aria-label="Tutup">✕</button>
				<img src="assets/qris.png" alt="QRIS besar" />
			</div>`;
		document.body.appendChild(modal);

		// close button
		modal.querySelector('.modal-close').addEventListener('click', closeModal);
		// click outside to close
		modal.addEventListener('click', (ev)=>{ if (ev.target === modal) closeModal(); });
		// ESC to close
		window.addEventListener('keyup', (e)=>{ if (e.key === 'Escape') closeModal(); });
	}

	function openModal(){
		if (!modal) createModal();
		modal.classList.add('open');
	}

	function closeModal(){ if (modal) modal.classList.remove('open'); }

	if (qrisImg){ qrisImg.addEventListener('click', openModal); }
});

