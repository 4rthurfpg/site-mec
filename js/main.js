document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        if (window.scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Fade-in Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Animated Numbers (genérico — qualquer elemento com data-target,
    // dispara ao entrar na viewport para dar a sensação de "carregar na hora")
    const fmt = (n) => n.toLocaleString('pt-BR');
    const animateStat = (stat) => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const prefix = stat.getAttribute('data-prefix') || '';
        const suffixAttr = stat.getAttribute('data-suffix');
        const suffix = suffixAttr === null ? '+' : suffixAttr;
        const duration = 1700;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            stat.innerText = prefix + fmt(Math.floor(eased * target)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else stat.innerText = prefix + fmt(target) + suffix;
        };
        requestAnimationFrame(tick);
    };

    const numObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateStat(e.target);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-target]').forEach(el => numObserver.observe(el));
});
