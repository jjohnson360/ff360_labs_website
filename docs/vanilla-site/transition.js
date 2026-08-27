document.addEventListener('DOMContentLoaded', () => {
  
  // Custom Cursor
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  const cursorOutline = document.createElement('div');
  cursorOutline.classList.add('cursor-outline');
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateCursor() {
    let dx = mouseX - outlineX;
    let dy = mouseY - outlineY;
    outlineX += dx * 0.15;
    outlineY += dy * 0.15;
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function attachCursorHover() {
    const clickables = document.querySelectorAll('a, button, input, textarea, select');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
      });
    });
  }
  attachCursorHover();

  // Transition Engine
  const overlay = document.createElement('div');
  overlay.classList.add('transition-overlay');
  const grid = document.createElement('div');
  grid.classList.add('transition-grid');
  overlay.appendChild(grid);
  document.body.appendChild(overlay);

  async function loadPage(url) {
    overlay.classList.remove('slide-up');
    overlay.classList.add('active');
    
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const newMain = doc.querySelector('main');
      const currentMain = document.querySelector('main');
      
      if (newMain && currentMain) {
        setTimeout(() => {
          currentMain.innerHTML = newMain.innerHTML;
          currentMain.className = newMain.className; // Transfer any classes
          
          // Re-initialize specific scripts if needed
          initScripts();
          attachCursorHover();
          updateNav(url);
          window.scrollTo(0, 0);
          
          overlay.classList.remove('active');
          overlay.classList.add('slide-up');
        }, 600); // match transition duration
      } else {
          window.location.assign(url);
      }
    } catch (err) {
      console.error('Failed to load page:', err);
      window.location.assign(url); // fallback
    }
  }

  function updateNav(url) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      // Normalize URLs to just the path part
      const normalUrl = url.split('/').pop() || 'index.html';
      if (href === normalUrl || (normalUrl === 'index.html' && href === 'services.html')) {
        link.classList.add('active');
      }
    });
  }

  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.origin === window.location.origin) {
      // Don't intercept targets with blank or anchors
      if (link.target === '_blank' || link.getAttribute('href').startsWith('#')) return;
      
      e.preventDefault();
      const url = link.pathname;
      if (url === window.location.pathname) return;
      
      history.pushState(null, '', url);
      loadPage(url);
    }
  });

  window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
  });

  function initScripts() {
    // Metal shimmer
    const shimmerElements = document.querySelectorAll('.metal-gold, .metal-silver');
    if (shimmerElements.length > 0) {
      let t = 0;
      function shimmer(){
        t += 0.15;
        const pos = (Math.sin(t/40) * 50 + 50).toFixed(1);
        shimmerElements.forEach(el=>{
          el.style.backgroundPosition = pos + '% 50%';
        });
        requestAnimationFrame(shimmer);
      }
      shimmer();
    }
    
    // Waveform
    const wf = document.getElementById('waveform');
    if (wf && wf.children.length === 0) {
      const barCount = 32;
      for(let i=0;i<barCount;i++){
        const bar = document.createElement('span');
        const h = 8 + Math.random()*22;
        bar.style.height = h + 'px';
        bar.style.animationDelay = (Math.random()*1.8) + 's';
        bar.style.animationDuration = (1.3 + Math.random()*1.2) + 's';
        wf.appendChild(bar);
      }
    }

    // Contact Form
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault(); 
        const data = new FormData(form);
        const action = form.action;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        fetch(action, {
          method: 'POST',
          body: data,
          mode: 'no-cors'
        })
        .then(() => {
          form.style.display = "none";
          document.getElementById("success-message").style.display = "block";
        })
        .catch(error => {
          console.error('Error!', error.message);
          submitBtn.innerText = "Error. Try Again.";
          submitBtn.disabled = false;
        });
      });
    }
  }

  // Initial call
  initScripts();
  updateNav(window.location.pathname);
});
