// State management
  const TOCManager = {
    isInitialized: false,
    tocContentCache: null,
    
    init() {
      if (this.isInitialized) return;
      
      this.setupEventListeners();
      this.initializeScrollHandler();
      this.cacheTOCContent();
      this.isInitialized = true;
    },
    
    cacheTOCContent() {
      const mainTOCContent = document.querySelector('#mainTOC .toc-content');
      if (mainTOCContent) {
        this.tocContentCache = mainTOCContent.cloneNode(true);
        this.tocContentCache.removeAttribute('id');
      }
    },
    
    setupEventListeners() {
      // Sidebar event listeners
      document.addEventListener('keydown', this.handleKeydown.bind(this));
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // TOC link listeners untuk mobile
      if (window.innerWidth <= 768) {
        this.setupMobileLinkListeners();
      }
    },
    
    setupMobileLinkListeners() {
      const links = document.querySelectorAll('#mainTOC .table-of-contents a[href^="#"]');
      links.forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(() => {
            this.collapseTOC();
          }, 300);
        });
      });
    },
    
    initializeScrollHandler() {
      let ticking = false;
      
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', throttledScroll, { passive: true });
    },
    
    handleScroll() {
      const mainTOC = document.getElementById('mainTOC');
      const floatingBtn = document.getElementById('floatingTocBtn');
      
      if (!mainTOC || !floatingBtn) return;
      
      const tocRect = mainTOC.getBoundingClientRect();
      const isVisible = tocRect.bottom > 0 && tocRect.top < window.innerHeight;
      
      floatingBtn.classList.toggle('show', !isVisible);
    },
    
    handleKeydown(e) {
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('tocSidebar');
        if (sidebar?.classList.contains('show')) {
          this.closeSidebar();
        }
      }
    },
    
    handleResize() {
      const sidebar = document.getElementById('tocSidebar');
      if (sidebar?.classList.contains('show') && window.innerWidth > 768) {
        this.closeSidebar();
      }
    },
    
    collapseTOC() {
      const content = document.getElementById('tocContent');
      const icon = document.getElementById('toggleIcon');
      
      if (content && icon) {
        content.classList.add('hidden');
        icon.classList.add('collapsed');
      }
    },
    
    closeSidebar() {
      const overlay = document.getElementById('sidebarOverlay');
      const sidebar = document.getElementById('tocSidebar');
      
      if (overlay && sidebar) {
        overlay.classList.remove('show');
        sidebar.classList.remove('show');
        document.body.style.overflow = '';
      }
    }
  };

  // Main functions
  function toggleTOC() {
    const content = document.getElementById('tocContent');
    const icon = document.getElementById('toggleIcon');
    
    if (!content || !icon) return;
    
    const isHidden = content.classList.contains('hidden');
    
    if (isHidden) {
      content.classList.remove('hidden');
      icon.classList.remove('collapsed');
    } else {
      content.classList.add('hidden');
      icon.classList.add('collapsed');
    }
  }

  function openSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('tocSidebar');
    const sidebarContent = document.getElementById('sidebarTocContent');
    
    if (!overlay || !sidebar || !sidebarContent) return;
    
    // Gunakan cache atau ambil konten fresh
    let contentToClone = TOCManager.tocContentCache;
    if (!contentToClone) {
      const mainTOCContent = document.querySelector('#mainTOC .toc-content');
      if (mainTOCContent) {
        contentToClone = mainTOCContent.cloneNode(true);
        contentToClone.removeAttribute('id');
        TOCManager.tocContentCache = contentToClone.cloneNode(true);
      } else {
        console.warn('Main TOC content not found');
        return;
      }
    }
    
    // Clone fresh untuk sidebar
    const freshClone = contentToClone.cloneNode(true);
    freshClone.classList.remove('hidden'); // Pastikan konten tidak tersembunyi
    
    // Setup event listeners untuk links di sidebar
    const links = freshClone.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Tutup sidebar setelah klik link
        setTimeout(() => {
          closeSidebar();
        }, 100);
      });
    });
    
    // Update sidebar content
    sidebarContent.innerHTML = '';
    sidebarContent.appendChild(freshClone);
    
    // Show sidebar
    overlay.classList.add('show');
    sidebar.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    TOCManager.closeSidebar();
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Delay initialization sedikit untuk memastikan semua elemen ready
    setTimeout(() => {
      TOCManager.init();
    }, 100);
  });

  // Fallback jika DOMContentLoaded sudah lewat
  if (document.readyState === 'loading') {
    // DOMContentLoaded sudah diset di atas
  } else {
    // DOM sudah ready
    setTimeout(() => {
      TOCManager.init();
    }, 100);
  }
