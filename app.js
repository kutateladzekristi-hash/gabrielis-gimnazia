/* ==========================================================================
   Tskaltubo St. Gabriel Bishop Orthodox School - Gymnasium
   Interactive JavaScript Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initDocumentSearch();
  initModals();
  initContactForm();
  initNewsFilters();
  initScrollHeader();
  initInnerTabs();
});

/* --------------------------------------------------------------------------
   Inner Tabs (clubs / projects sub-section tabs)
   -------------------------------------------------------------------------- */
function initInnerTabs() {
  // Use event delegation on the entire document
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.inner-tab-btn');
    if (!btn) return;

    const wrapper = btn.closest('.inner-tabs-wrapper');
    if (!wrapper) return;

    const targetTabId = btn.getAttribute('data-inner-tab');
    if (!targetTabId) return;

    // Deactivate all buttons in this wrapper
    wrapper.querySelectorAll('.inner-tab-btn').forEach(b => b.classList.remove('active'));
    // Deactivate all content panels in this wrapper
    wrapper.querySelectorAll('.inner-tab-content').forEach(p => p.classList.remove('active'));

    // Activate clicked button
    btn.classList.add('active');
    // Activate target panel
    const panel = wrapper.querySelector('#' + targetTabId);
    if (panel) panel.classList.add('active');
  });
}


/* --------------------------------------------------------------------------
   Navigation & Section Switcher
   -------------------------------------------------------------------------- */
function initNavigation() {
  const sections = document.querySelectorAll('div.page-section-tab');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Route switching
  function navigateTo(targetId) {
    if (!targetId || targetId === '#') return;
    
    // Normalize targetId
    const cleanId = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    let parentTabId = cleanId;

    // Check if target is inside a specific tab like #doc-charter inside #documents or #philosophy inside #about
    if (cleanId.startsWith('doc-')) {
      parentTabId = 'documents';
    } else if (['philosophy', 'structure', 'student-services', 'leadership', 'departments', 'strategic-group', 'quality-service'].includes(cleanId)) {
      parentTabId = 'about';
    } else if (['kapiko-details'].includes(cleanId)) {
      parentTabId = 'clubs';
    }

    const parentTab = document.getElementById(parentTabId);
    const targetElement = document.getElementById(cleanId);

    if (parentTab) {
      // Hide all page sections
      sections.forEach(sec => {
        sec.style.display = 'none';
      });

      // Show parent tab
      parentTab.style.display = 'block';

      // Scroll to specific element or top
      if (cleanId !== parentTabId && targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update Active link states
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${parentTabId}` || (parentTabId === 'documents' && href === '#documents')) {
          link.classList.add('active');
        }
      });
    }

    // Close mobile menu if open
    if (navMenu) navMenu.classList.remove('mobile-open');
  }

  // Click handler for links
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        navigateTo(href);
      }
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Mobile Sub-menu Toggle
  const dropdownParents = document.querySelectorAll('.nav-item.dropdown');
  dropdownParents.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('mobile-expanded');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   Sticky Header Animation
   -------------------------------------------------------------------------- */
function initScrollHeader() {
  const mainNav = document.querySelector('.main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      mainNav.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    } else {
      mainNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    }
  });
}

/* --------------------------------------------------------------------------
   Document Filter & Live Search
   -------------------------------------------------------------------------- */
function initDocumentSearch() {
  const searchInput = document.getElementById('docSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const docItems = document.querySelectorAll('.doc-item');
    const docCategories = document.querySelectorAll('.doc-category-block');

    docItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Hide empty categories
    docCategories.forEach(cat => {
      const visibleItems = cat.querySelectorAll('.doc-item[style*="display: flex"], .doc-item:not([style*="display: none"])');
      if (visibleItems.length === 0) {
        cat.style.display = 'none';
      } else {
        cat.style.display = 'block';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   News Category Filter
   -------------------------------------------------------------------------- */
function initNewsFilters() {
  const filterBtns = document.querySelectorAll('.news-filter .filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Modals Management (Leadership Bios & Document Previews)
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('appModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  if (!modalOverlay) return;

  window.openBioModal = function(name, role, text, imgPath) {
    modalTitle.textContent = name;
    modalBody.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-start;">
        ${imgPath ? `<img src="${imgPath}" style="max-width: 220px; border-radius: 12px; border: 2px solid #D4AF37; box-shadow: 0 4px 15px rgba(0,0,0,0.15);" alt="${name}">` : ''}
        <div style="flex: 1; min-width: 250px;">
          <h4 style="color: #D4AF37; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${role}</h4>
          <div style="font-size: 0.98rem; line-height: 1.7; color: #1E293B;">
            ${text}
          </div>
        </div>
      </div>
    `;
    modalOverlay.classList.add('active');
  };

  window.openDocModal = function(title, fileUrl) {
    modalTitle.textContent = title;
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 1rem;">
        <i class="fas fa-file-pdf" style="font-size: 4rem; color: #E24A4A; margin-bottom: 1rem;"></i>
        <h4 style="font-size: 1.2rem; font-weight: 700; color: #0B192C; margin-bottom: 1rem;">${title}</h4>
        <p style="color: #64748B; margin-bottom: 1.5rem;">დოკუმენტის სანახავად ან ჩამოსატვირთად დააჭირეთ ქვემოთ მოცემულ ღილაკს:</p>
        <a href="${fileUrl}" target="_blank" download class="btn-primary" style="display: inline-flex; text-decoration: none;">
          <i class="fas fa-download"></i> ფაილის ჩამოტვირთვა / გახსნა
        </a>
      </div>
    `;
    modalOverlay.classList.add('active');
  };

  window.openPendingModal = function(title) {
    modalTitle.textContent = title;
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 1.5rem;">
        <i class="fas fa-clock" style="font-size: 3.5rem; color: #D4AF37; margin-bottom: 1rem;"></i>
        <h4 style="font-size: 1.2rem; font-weight: 700; color: #0B192C; margin-bottom: 0.75rem;">${title}</h4>
        <p style="color: #64748B; line-height: 1.6; margin-bottom: 1.5rem;">აღნიშნული დოკუმენტის დასახელება უკვე სისტემაშია. ფაილი მალე ჩაიტვირთება სკოლის ადმინისტრაციის მიერ.</p>
        <button onclick="document.getElementById('appModal').classList.remove('active')" class="btn-primary" style="display: inline-flex;">
          <i class="fas fa-check"></i> გასაგებია
        </button>
      </div>
    `;
    modalOverlay.classList.add('active');
  };

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('schoolContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    
    alert(`გმადლობთ ${name}! თქვენი შეტყობინება წარმატებით გაიგზავნა. სკოლის ადმინისტრაცია მალე დაგიკავშირდებათ.`);
    contactForm.reset();
  });
}
