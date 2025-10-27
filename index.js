document.addEventListener('DOMContentLoaded', () => {
            
    // =======================================================
    // 1. LÓGICA DE DARK MODE PERSISTENTE
    // =======================================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Inicializa o tema: verifica localStorage ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark));

    // Alterna e salva o tema
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        
        if (isDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        applyTheme(isDark);
    });


    // =======================================================
    // 2. OBSERVER PARA ANIMAÇÃO AO SCROLL (AOS) - AGORA FIXO
    // =======================================================
    // Seleciona todas as seções, títulos e itens da timeline
    const sectionsToAnimate = document.querySelectorAll('.section, .section-title, .timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Aciona quando 20% do elemento está visível
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Lógica especial para barras de progresso (Skills)
                if (entry.target.id === 'skills') {
                    animateSkills();
                }
                
                // Desliga o observer para TODOS os elementos que forem visíveis,
                // garantindo que a animação não seja revertida e permaneça fixa.
                if (entry.target.classList.contains('is-visible')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });


    // =======================================================
    // 3. ANIMAÇÃO DAS BARRAS DE PROGRESSO
    // =======================================================
    function animateSkills() {
        document.querySelectorAll('.skill-item').forEach(item => {
            const level = item.getAttribute('data-level');
            const fill = item.querySelector('.progress-bar-fill');
            
            // Define o width (aciona a transição CSS)
            fill.style.width = level + '%';
        });
    }

    // =======================================================
    // 4. DESTAQUE DO LINK DE NAVEGAÇÃO AO SCROLL
    // =======================================================
    const navLinks = document.querySelectorAll('#nav a');

    const linkObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Aciona quando a seção está no centro da viewport
        threshold: 0 
    };

    const linkObserver = new IntersectionObserver((entries) => {
        // Remove a classe 'active' de todos os links
        navLinks.forEach(link => link.classList.remove('active'));

        entries.forEach(entry => {
            // Adiciona a classe 'active' ao link da seção centralizada
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                const activeLink = document.querySelector(`#nav a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, linkObserverOptions);

    // Observa apenas as grandes seções (que têm IDs de navegação)
    document.querySelectorAll('main > section').forEach(section => {
        linkObserver.observe(section);
    });
});