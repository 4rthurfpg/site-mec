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

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formContent = document.getElementById('form-content');
        const formSuccess = document.getElementById('form-success');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Send via FormSubmit AJAX
            fetch('https://formsubmit.co/ajax/organizacao@ufmghub.com.br', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(resData => {
                // Success: Hide form and show success message
                formContent.style.display = 'none';
                formSuccess.style.display = 'block';
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou envie um e-mail direto para organizacao@ufmghub.com.br.');
            })
            .finally(() => {
                // Reset loading state
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            });
        });
    }
});

window.resetContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    const formContent = document.getElementById('form-content');
    const formSuccess = document.getElementById('form-success');
    if (contactForm && formContent && formSuccess) {
        contactForm.reset();
        formSuccess.style.display = 'none';
        formContent.style.display = 'block';
    }
};

