document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. Alternância de Tema (Dark/Light Mode)
    // =======================================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
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
    // 2. Menu de Navegação Mobile (Hambúrguer)
    // =======================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('#nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            // Alterna a classe que MOSTRA os atalhos no CSS
            navList.classList.toggle('is-open'); 

            // Altera o ícone (hambúrguer <-> X)
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('is-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); 
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); 
            }
        });

        // NOTA IMPORTANTE: O bloco de código que fechava o menu ao clicar em 'nav a'
        // foi REMOVIDO permanentemente daqui para garantir que o menu permaneça aberto.
    }

    // =======================================================
    // 3. OBSERVER PARA ANIMAÇÃO AO SCROLL (AOS)
    // =======================================================
    // Observa seções, títulos e itens da timeline/experiência
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
                
                // Desliga o observer para garantir que a animação seja única
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
    // 4. DESTAQUE DO LINK DE NAVEGAÇÃO AO SCROLL (Ativo)
    // =======================================================
    const navLinks = document.querySelectorAll('#nav a');

    const linkObserverOptions = {
        root: null,
        // Detecta a seção quando ela ocupa a maior parte da tela (ou está no centro)
        rootMargin: '-30% 0px -69% 0px', 
        threshold: 0 
    };

    const linkObserver = new IntersectionObserver((entries) => {
        // Remove 'active' de todos antes de adicionar ao novo
        navLinks.forEach(link => link.classList.remove('active'));

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                const activeLink = document.querySelector(`#nav a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, linkObserverOptions);

    // Observa todas as seções principais
    document.querySelectorAll('main > section').forEach(section => {
        linkObserver.observe(section);
    });
});
