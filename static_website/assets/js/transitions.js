(function(){
  // Page fade-in
  const onReady = () => {
    requestAnimationFrame(() => document.body.classList.remove('opacity-0'))
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // Link fade-out for internal navigation
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const isSameOrigin = href.startsWith('/') || href.startsWith(location.origin);
    const isHash = href.startsWith('#');
    const isNewTab = a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    if (isSameOrigin && !isHash && !isNewTab) {
      e.preventDefault();
      document.body.classList.add('opacity-0');
      setTimeout(() => { window.location.href = href; }, 180);
    }
  });

  // Scroll reveal
  const elements = document.querySelectorAll('[data-reveal]');
  if (elements.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.getAttribute('data-reveal-delay')||'0');
          el.style.transition = 'opacity 600ms cubic-bezier(.2,.7,.2,1), transform 600ms cubic-bezier(.2,.7,.2,1)';
          el.style.transitionDelay = `${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }
      }
    }, { threshold: 0.12 });

    elements.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      const stagger = parseInt(el.getAttribute('data-reveal-stagger')||'0', 10);
      if (stagger && el.children) {
        Array.from(el.children).forEach((child, i) => {
          child.setAttribute('data-reveal', '');
          child.setAttribute('data-reveal-delay', String(i * stagger));
          io.observe(child);
        });
      } else {
        io.observe(el);
      }
    });
  }
})();