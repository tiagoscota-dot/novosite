/* ==========================================================================
   Speed Soluções em Comex - Rotinas Comex JS Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Navbar Background Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scrollspy: Highlight Active Nav Link ---
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for fixed navbar
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);

    // --- Timeline Slide-In Animation on Scroll ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            // Apply initial style state before animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            timelineObserver.observe(item);
        });
    }

    // --- Operational Flowchart Toggle ---
    const btnFlowImport = document.getElementById('btnFlowImport');
    const btnFlowExport = document.getElementById('btnFlowExport');
    const flowchartImport = document.getElementById('flowchartImport');
    const flowchartExport = document.getElementById('flowchartExport');

    if (btnFlowImport && btnFlowExport && flowchartImport && flowchartExport) {
        btnFlowImport.addEventListener('click', () => {
            btnFlowImport.classList.add('active');
            btnFlowExport.classList.remove('active');
            flowchartImport.classList.add('active');
            flowchartExport.classList.remove('active');
        });

        btnFlowExport.addEventListener('click', () => {
            btnFlowExport.classList.add('active');
            btnFlowImport.classList.remove('active');
            flowchartExport.classList.add('active');
            flowchartImport.classList.remove('active');
        });
    }

    // --- Document Tabs Switcher ---
    const docsGrid = document.getElementById('docsGrid');
    if (docsGrid) {
        docsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.doc-tab-btn');
            if (!btn) return;

            const docCard = btn.closest('.doc-card');
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate other buttons
            docCard.querySelectorAll('.doc-tab-btn').forEach(button => {
                button.classList.remove('active');
            });
            // Activate current button
            btn.classList.add('active');

            // Deactivate other tabs content
            docCard.querySelectorAll('.doc-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            // Activate target content
            docCard.querySelector(`.doc-tab-content[data-content="${targetTab}"]`).classList.add('active');
        });
    }

    // --- Glossary Live Search ---
    const glossarySearch = document.getElementById('glossarySearch');
    const glossaryGrid = document.getElementById('glossaryGrid');
    const glossaryCards = document.querySelectorAll('.glossary-card');
    const glossaryNoResults = document.getElementById('glossaryNoResults');

    if (glossarySearch && glossaryGrid) {
        glossarySearch.addEventListener('input', () => {
            const searchTerm = glossarySearch.value.trim().toLowerCase();
            let visibleCount = 0;

            glossaryCards.forEach(card => {
                const termSigla = card.getAttribute('data-term').toLowerCase();
                const termTitle = card.querySelector('h3').textContent.toLowerCase();
                const termText = card.querySelector('p').textContent.toLowerCase();

                const isMatch = termSigla.includes(searchTerm) || 
                                termTitle.includes(searchTerm) || 
                                termText.includes(searchTerm);

                if (isMatch) {
                    card.classList.remove('hidden');
                    visibleCount++;
                    
                    // Highlight matching text (premium refinement)
                    highlightMatch(card.querySelector('h3'), searchTerm);
                    highlightMatch(card.querySelector('p'), searchTerm);
                } else {
                    card.classList.add('hidden');
                }
            });

            if (visibleCount === 0) {
                glossaryNoResults.style.display = 'block';
            } else {
                glossaryNoResults.style.display = 'none';
            }
        });
    }

    // Helper function for text highlight
    function highlightMatch(element, query) {
        const text = element.textContent;
        if (!query) {
            element.innerHTML = text; // Reset highlight
            return;
        }

        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark style="background-color: #F2C300; color: #1E1E1E; padding: 0 2px; border-radius: 2px;">$1</mark>');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // --- FAQ Accordion Toggles ---
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;

            const currentItem = questionBtn.closest('.faq-item');
            const isActive = currentItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // If it wasn't active, open it
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    }

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('contactForm');
    const formSuccessToast = document.getElementById('formSuccessToast');

    if (contactForm && formSuccessToast) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values for a client-side mockup validation
            const nome = document.getElementById('frmNome').value;
            const empresa = document.getElementById('frmEmpresa').value;
            const email = document.getElementById('frmEmail').value;
            const telefone = document.getElementById('frmTelefone').value;
            const operacao = document.getElementById('frmOperacao').value;
            const mensagem = document.getElementById('frmMensagem').value;

            // Log information to represent background processing
            console.log('Sending Comex consulting demand to Speed Soluções:', {
                nome, empresa, email, telefone, operacao, mensagem
            });

            // Trigger visual button loading state
            const btnSubmit = document.getElementById('btnSubmit');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando...';

            setTimeout(() => {
                // Smooth hide form and show success toast
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccessToast.classList.add('active');
                }, 300);
            }, 1200);
        });
    }
});
