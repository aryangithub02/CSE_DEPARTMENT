document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-overlay');
    const bootText = document.getElementById('boot-text');
    const scannerLine = document.getElementById('scanner-line');
    const scannerInfo = document.querySelector('.scanner-info');
    const currentSectionName = document.getElementById('current-section-name');
    const appContainer = document.getElementById('app-container');
    const dataStream = document.getElementById('data-stream');
    const skipBtn = document.getElementById('skip-btn');
    const sideNav = document.querySelector('.side-nav');
    const navItems = document.querySelectorAll('.nav-item');

    // Setup Nav interactions
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });

        item.addEventListener('mouseenter', () => {
            gsap.to(follower, { width: 60, height: 60, backgroundColor: 'rgba(0, 245, 255, 0.1)', duration: 0.3 });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(follower, { width: 40, height: 40, backgroundColor: 'transparent', duration: 0.3 });
        });
    });

    function updateActiveNav(id) {
        navItems.forEach(item => {
            if (item.dataset.target === id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // HORIZONTAL SCROLL PROGRESS BAR UPDATE
        const topProgressBar = document.getElementById('top-progress-bar');
        if (topProgressBar) {
            const docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            const windowHeight = window.innerHeight;
            const scrollPercent = (scrollY / (docHeight - windowHeight)) * 100;
            topProgressBar.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
        }

        if (document.body.style.overflow === 'hidden' || sectionData.length === 0) return;
        
        let currentId = '';
        
        sectionData.forEach(data => {
            const sectionTop = data.top - (window.innerHeight / 2);
            if (scrollY >= sectionTop) {
                currentId = data.id;
            }
        });
        
        if (currentId) updateActiveNav(currentId);
    });

    // 10X FEATURE: CUSTOM CURSOR
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: 'none' });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });

    // Cursor Hover States
    const interactiveElements = document.querySelectorAll('button, .glass-card, .tech-tags li');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, { width: 80, height: 80, backgroundColor: 'rgba(0, 245, 255, 0.1)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, { width: 40, height: 40, backgroundColor: 'transparent', duration: 0.3 });
        });
    });

    // SCRAMBLE TEXT EFFECT (DISABLED FOR ACADEMIC THEME)
    function scrambleText(element) {
        // Reduced to simple text assignment
        element.innerText = element.dataset.text || element.textContent;
    }

    // 10X FEATURE: MAGNETIC BUTTON
    const magneticBtn = document.getElementById('explore-btn');
    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(magneticBtn, {
                x: x * 0.3,
                y: y * 0.5,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        magneticBtn.addEventListener('mouseleave', () => {
            gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    }

    // UPDATE REVEAL LOGIC WITH SCRAMBLE
    function revealSection(section) {
        section.classList.add('scanned-active');
        currentSectionName.textContent = section.dataset.name;
        
        // Micro-reveal for internal elements
        gsap.fromTo(section.children, 
            { opacity: 0, y: 30, filter: 'blur(10px)' }, 
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power4.out' }
        );

        // Scramble headers in the section
        section.querySelectorAll('.scramble').forEach(header => {
            scrambleText(header);
        });
        
        if (section.id === 'section-stats') {
            setTimeout(animateStats, 500);
        }

        gsap.fromTo(scannerInfo, { scale: 1.15, borderColor: '#8A2BE2' }, { scale: 1, borderColor: '#00F5FF', duration: 0.4 });
    }

    // 1. DATA STREAM BACKGROUND
    const dataPhrases = [
        "LOG: CSE_DEPT_INITIALIZED",
        "FETCHING: FACULTY_REGISTRY",
        "ANALYZING: LAB_UTILIZATION",
        "SCANNING: STUDENT_ENROLLMENT",
        "VERIFYING: PLACEMENT_METRICS",
        "CONNECTING: TGPCET_CENTRAL_DB",
        "SYNCING: INNOVATION_LABS",
        "STATUS: OPTIMAL",
        "CRC_CHECK: SUCCESSFUL",
        "DECRYPTING: SYSTEM_VALUES",
        "UPDATING_NEURAL_LAYER",
        "BYPASSING: LEGACY_UI"
    ];

    function updateDataStream() {
        let lastUpdate = performance.now();
        function loop(timestamp) {
            if (timestamp - lastUpdate > 800 + Math.random() * 1500) {
                const p = document.createElement('p');
                p.textContent = dataPhrases[Math.floor(Math.random() * dataPhrases.length)];
                dataStream.appendChild(p);
                if (dataStream.children.length > 25) dataStream.removeChild(dataStream.firstChild);
                lastUpdate = timestamp;
            }
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }
    updateDataStream();

    // 2. BOOT SEQUENCE
    const bootAnimation = () => {
        gsap.to('.progress-fill', { width: '100%', duration: 3, ease: 'power4.inOut' });
        
        const texts = [
            "Initializing Department Scan...",
            "Loading Neural Core...",
            "Accessing TGPCET Database...",
            "Applying 10x UI Layer...",
            "System Ready. Decrypting data..."
        ];

        let textIdx = 0;
        const interval = setInterval(() => {
            textIdx++;
            if (textIdx < texts.length) {
                bootText.textContent = texts[textIdx];
            } else {
                clearInterval(interval);
            }
        }, 700);

        setTimeout(() => {
            gsap.to(bootScreen, { 
                opacity: 0, 
                duration: 1.2, 
                ease: 'power2.inOut',
                onComplete: () => {
                    bootScreen.style.display = 'none';
                    startScanning();
                } 
            });
        }, 3500);
    };

    // 4. SCANNING PHASE
    const sections = document.querySelectorAll('.scan-section');
    let sectionData = [];

    function prepareSections() {
        sectionData = Array.from(sections).map(section => ({
            element: section,
            id: section.id,
            top: section.offsetTop,
            revealed: false
        }));
    }

    const startScanning = () => {
        document.body.style.overflow = 'hidden';
        prepareSections();
        
        scannerLine.style.display = 'block';
        scannerInfo.style.display = 'block';
        appContainer.classList.remove('blurred');
        sideNav.classList.add('active');
        
        skipBtn.addEventListener('click', () => {
            tl.kill();
            sectionData.forEach(s => {
                if(!s.revealed) revealSection(s.element);
            });
            gsap.to(scannerLine, { opacity: 0, duration: 0.5 });
            gsap.to(scannerInfo, { opacity: 0, duration: 0.5 });
            showFinalReveal();
        });

        const tl = gsap.timeline();
        const containerHeight = appContainer.offsetHeight;
        
        tl.to(scannerLine, {
            top: containerHeight + 'px',
            duration: 10,
            ease: "none",
            onUpdate: function() {
                const currentY = parseFloat(gsap.getProperty(scannerLine, "top"));
                checkCollisions(currentY);
                const scrollTarget = (currentY + appContainer.offsetTop) - (window.innerHeight / 2);
                window.scrollTo({
                    top: Math.max(0, scrollTarget),
                    behavior: 'auto'
                });
            },
            onComplete: () => {
                gsap.to(scannerLine, { opacity: 0, duration: 0.8 });
                gsap.to(scannerInfo, { opacity: 0, duration: 0.8 });
                showFinalReveal();
            }
        });
    };

    function checkCollisions(currentY) {
        let activeId = '';
        sectionData.forEach(data => {
            if (!data.revealed && currentY >= data.top) {
                data.revealed = true;
                revealSection(data.element);
            }
            if (currentY >= data.top - 200 && currentY < data.top + data.element.offsetHeight) {
                activeId = data.id;
            }
        });
        if (activeId) updateActiveNav(activeId);
    }

    function animateStats() {
        const statNums = document.querySelectorAll('.stat-num');
        statNums.forEach(num => {
            const target = parseInt(num.dataset.target);
            gsap.to(num, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                ease: 'power3.out'
            });
        });
    }

    function showFinalReveal() {
        gsap.to('.final-reveal', {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'expo.out'
        });
        
        appContainer.style.filter = 'none';
        document.body.style.overflow = 'auto';
    }

    bootAnimation();

    // Matrix particles for boot screen
    const drawMatrix = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('matrix-canvas');
        if (!container) return;
        
        container.appendChild(canvas);
        
        let w = canvas.width = container.offsetWidth;
        let h = canvas.height = container.offsetHeight;
        
        const cols = Math.floor(w / 20) + 1;
        const ypos = Array(cols).fill(0);
        
        function matrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, w, h);
            
            ctx.fillStyle = '#00f2ff';
            ctx.font = '15pt monospace';
            
            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });
            requestAnimationFrame(matrix);
        }
        requestAnimationFrame(matrix);
        
        window.addEventListener('resize', () => {
            w = canvas.width = container.offsetWidth;
            h = canvas.height = container.offsetHeight;
        });
    };
    drawMatrix();
});
