/**
 * Portfolio JavaScript Engine
 * Author: Vinayak Varshney (AI/ML Engineer)
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. THEME TOGGLER (Dark / Light Frosted Glass Luxe Mode)
  // -------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
  } else if (!prefersDarkScheme.matches) {
    // If system prefers light and user has no preference
    document.body.classList.add('light-mode');
  }

  updateThemeToggleIcon();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      updateThemeToggleIcon();
      showToast(currentTheme === 'light' ? 'Light Frosted Glass Mode enabled' : 'Dark Obsidian Mode enabled');
    });
  }

  function updateThemeToggleIcon() {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    if (document.body.classList.contains('light-mode')) {
      icon.className = 'fas fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      icon.className = 'fas fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  // -------------------------------------------------------------
  // 2. ACTIVE NAVIGATION HIGHLIGHTER & MOBILE MENU
  // -------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // -------------------------------------------------------------
  // 3. TYPEWRITER / ROLE ROTATOR (Hero Section)
  // -------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      "AI/ML Engineer",
      "Specializing in Autonomous Agents",
      "Architecting Production RAG Pipelines",
      "B.Tech AI & ML @ SIT Pune"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at end of sentence
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next sentence
      }

      setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 800);
  }

  // -------------------------------------------------------------
  // 4. COPY TO CLIPBOARD UTILITY WITH TOAST
  // -------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-trigger');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy') || 'vinayak.varshney.dev@gmail.com';
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${textToCopy}`);
      });
    });
  });

  // -------------------------------------------------------------
  // 5. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3400);
  }

  window.showToast = showToast;

  // -------------------------------------------------------------
  // 6. PROJECTS SEARCH & CATEGORY FILTERING (proj.html)
  // -------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn:not(.repo-filter-btn)');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');

  function applyProjectFilter() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.filter-btn.active:not(.repo-filter-btn)');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.project-name')?.innerText || '').toLowerCase();
      const desc = (card.querySelector('.project-desc')?.innerText || '').toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.toLowerCase()).join(' ');

      const matchesFilter = (activeFilter === 'all') || (category === activeFilter);
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Also filter dynamic GitHub repos if present
    filterGitHubRepos(searchTerm);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyProjectFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyProjectFilter);
  }

  // -------------------------------------------------------------
  // 7. GITHUB REPOSITORIES DYNAMIC FETCHER (proj.html)
  // -------------------------------------------------------------
  const githubContainer = document.getElementById('github-repos-container');
  let loadedRepositories = [];
  let currentRepoLangFilter = 'all';

  const LANGUAGE_COLORS = {
    'Python': '#3572A5',
    'Java': '#b07219',
    'C': '#555555',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Jupyter Notebook': '#DA5B0B'
  };

  // Pre-compiled offline fallback data ensuring 100% resilience against GitHub API rate limits
  const FALLBACK_REPOS = [
    { name: "CodeSentinel", language: "Python", stargazers_count: 2, forks_count: 0, description: "AI code review and semantic analysis agent using AST parsing and ChromaDB hybrid retrieval.", html_url: "https://github.com/VinayakFTW/CodeSentinel", updated_at: "2026-09-10T12:00:00Z" },
    { name: "pulse_cli", language: "Python", stargazers_count: 1, forks_count: 0, description: "Natural language shell command execution CLI powered by autonomous Think-Act-Observe loops.", html_url: "https://github.com/VinayakFTW/pulse_cli", updated_at: "2026-09-08T10:30:00Z" },
    { name: "SBISaarthi", language: "Python", stargazers_count: 0, forks_count: 0, description: "Multi-agent WhatsApp banking assistant with event bus orchestration and KYC state machines.", html_url: "https://github.com/VinayakFTW/SBISaarthi", updated_at: "2026-09-05T09:00:00Z" },
    { name: "pulseai", language: "Python", stargazers_count: 0, forks_count: 0, description: "Multimodal terminal assistant with voice interaction and open-source model fallback chains.", html_url: "https://github.com/VinayakFTW/pulseai", updated_at: "2026-08-30T14:15:00Z" },
    { name: "CO2_Emission_Prediction", language: "Python", stargazers_count: 0, forks_count: 0, description: "Predicting CO2 emissions of vehicles using machine learning regression and feature engineering.", html_url: "https://github.com/VinayakFTW/CO2_Emission_Prediction", updated_at: "2026-08-20T11:00:00Z" },
    { name: "Traffic_Analysis_and_Optimization", language: "Java", stargazers_count: 0, forks_count: 0, description: "Intelligent urban traffic flow simulation, bottleneck detection, and route optimization.", html_url: "https://github.com/VinayakFTW/Traffic_Analysis_and_Optimization", updated_at: "2026-08-10T16:00:00Z" },
    { name: "TensorTonic-Solutions", language: "Python", stargazers_count: 0, forks_count: 0, description: "My solutions to complex deep learning and tensor manipulation challenges.", html_url: "https://github.com/VinayakFTW/TensorTonic-Solutions", updated_at: "2026-08-01T12:00:00Z" },
    { name: "Git-relay", language: "C", stargazers_count: 0, forks_count: 0, description: "Git-relay repository for CodeX Community collaborative development experiments.", html_url: "https://github.com/VinayakFTW/Git-relay", updated_at: "2026-07-25T15:00:00Z" },
    { name: "Basic_Image_Proccessing-numpy_and_matplotlib", language: "Python", stargazers_count: 0, forks_count: 0, description: "Fundamental computer vision transformations, kernels, and filters with NumPy & Matplotlib.", html_url: "https://github.com/VinayakFTW/Basic_Image_Proccessing-numpy_and_matplotlib", updated_at: "2026-07-15T09:30:00Z" },
    { name: "telco_customer_churn_prediction", language: "Jupyter Notebook", stargazers_count: 0, forks_count: 0, description: "Predictive customer retention modeling with classification algorithms and churn analysis.", html_url: "https://github.com/VinayakFTW/telco_customer_churn_prediction", updated_at: "2026-06-30T10:00:00Z" },
    { name: "Billing_System", language: "C", stargazers_count: 0, forks_count: 0, description: "Structured inventory management and receipt generator implemented in C.", html_url: "https://github.com/VinayakFTW/Billing_System", updated_at: "2026-06-15T14:00:00Z" },
    { name: "Portfolio-Rep", language: "HTML", stargazers_count: 0, forks_count: 0, description: "Personal modern portfolio website built with high-tech minimalist design and glassmorphism.", html_url: "https://github.com/VinayakFTW/Portfolio-Rep", updated_at: "2026-09-13T18:00:00Z" }
  ];

  if (githubContainer) {
    fetchGitHubRepositories();
  }

  async function fetchGitHubRepositories() {
    const cachedData = sessionStorage.getItem('vinayak_gh_repos');
    const cacheTimestamp = sessionStorage.getItem('vinayak_gh_repos_time');
    const now = Date.now();

    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < 1000 * 60 * 30)) {
      try {
        loadedRepositories = JSON.parse(cachedData);
        renderGitHubRepos(loadedRepositories);
        updateRepoStats(loadedRepositories);
        return;
      } catch (e) {
        // Fallback to fetch
      }
    }

    try {
      const response = await fetch('https://api.github.com/users/VinayakFTW/repos?sort=updated&per_page=100');
      if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Filter out any unwanted repos or self-mirrors if needed
        loadedRepositories = data.filter(r => !r.fork && r.name !== 'vinayakftw' && r.name !== 'Prerak-Varshney');
        sessionStorage.setItem('vinayak_gh_repos', JSON.stringify(loadedRepositories));
        sessionStorage.setItem('vinayak_gh_repos_time', now.toString());
        renderGitHubRepos(loadedRepositories);
        updateRepoStats(loadedRepositories);
      } else {
        throw new Error("Empty repositories list");
      }
    } catch (err) {
      console.warn("GitHub API rate limit or network fallback active:", err.message);
      loadedRepositories = FALLBACK_REPOS;
      renderGitHubRepos(loadedRepositories);
      updateRepoStats(loadedRepositories);
    }
  }

  function updateRepoStats(repos) {
    const countElem = document.getElementById('github-repo-count');
    const starsElem = document.getElementById('github-stars-count');

    if (countElem) countElem.innerText = repos.length;
    if (starsElem) {
      const totalStars = repos.reduce((acc, curr) => acc + (curr.stargazers_count || 0), 0);
      starsElem.innerText = totalStars;
    }
  }

  function renderGitHubRepos(repos) {
    if (!githubContainer) return;
    githubContainer.innerHTML = '';

    if (repos.length === 0) {
      githubContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 0.75rem; display: block;"></i>
          <p>No repositories match the current search or language filter.</p>
        </div>
      `;
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-card';
      card.setAttribute('data-lang', (repo.language || 'Other').toLowerCase());

      const lang = repo.language || 'Code';
      const langColor = LANGUAGE_COLORS[lang] || '#6366f1';
      const desc = repo.description || 'Public repository focused on algorithmic implementations and AI/ML experiments.';
      const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      card.innerHTML = `
        <div class="repo-header">
          <i class="fas fa-code-branch repo-folder-icon"></i>
          <div class="repo-stats">
            <span class="repo-stat-item" title="Stars"><i class="fas fa-star"></i> ${repo.stargazers_count || 0}</span>
            <span class="repo-stat-item" title="Forks"><i class="fas fa-code-fork"></i> ${repo.forks_count || 0}</span>
          </div>
        </div>

        <div>
          <a href="${repo.html_url}" target="_blank" class="repo-name-link">${repo.name}</a>
          <p class="repo-desc">${desc}</p>
        </div>

        <div class="repo-footer">
          <span class="repo-lang">
            <span class="repo-lang-dot" style="background-color: ${langColor};"></span>
            <span>${lang}</span>
          </span>
          <span>${updatedDate}</span>
        </div>
      `;

      githubContainer.appendChild(card);
    });
  }

  function filterGitHubRepos(searchTerm) {
    if (!githubContainer || loadedRepositories.length === 0) return;

    const filtered = loadedRepositories.filter(repo => {
      const name = (repo.name || '').toLowerCase();
      const desc = (repo.description || '').toLowerCase();
      const lang = (repo.language || 'other').toLowerCase();

      const matchesLang = (currentRepoLangFilter === 'all') || (lang === currentRepoLangFilter);
      const matchesSearch = !searchTerm || name.includes(searchTerm) || desc.includes(searchTerm) || lang.includes(searchTerm);

      return matchesLang && matchesSearch;
    });

    renderGitHubRepos(filtered);
  }

  // Repository Language Filter Buttons
  const repoFilterBtns = document.querySelectorAll('.repo-filter-btn');
  repoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      repoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRepoLangFilter = (btn.getAttribute('data-lang') || 'all').toLowerCase();
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterGitHubRepos(searchTerm);
    });
  });

  // -------------------------------------------------------------
  // 8. DIRECT EMAIL DISPATCH ENGINE (contact.html via FormSubmit API)
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const statusBanner = document.getElementById('form-status-banner');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !message) {
        showStatusBanner(false, 'Please fill out your name, email, and message.');
        return;
      }

      // Check anti-spam honeypot
      const honeyField = document.getElementById('form-honey');
      if (honeyField && honeyField.value) {
        return; // Bot detected
      }

      // Enter loading state
      setSubmittingState(true);
      hideStatusBanner();

      try {
        const response = await fetch('https://formsubmit.co/ajax/vinayak.varshney.dev@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `New Portfolio Message: ${subject} from ${name}`,
            subject: subject,
            message: message,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
          showStatusBanner(true, 'Message sent successfully! Your inquiry has been delivered directly to Vinayak\'s inbox.');
          showToast('Message sent directly to Vinayak!');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Transmission failed');
        }
      } catch (err) {
        console.error("Email submission error:", err);
        showStatusBanner(false, `Could not deliver automatically (${err.message}). Click below to email directly: <a href="mailto:vinayak.varshney.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}" style="text-decoration: underline; font-weight: 700;">Open Email Client</a>`);
        showToast('Submission error. Mailto fallback ready.');
      } finally {
        setSubmittingState(false);
      }
    });
  }

  function setSubmittingState(isSubmitting) {
    if (!submitBtn) return;
    const btnText = submitBtn.querySelector('.btn-text-content');
    const spinner = submitBtn.querySelector('.btn-spinner');

    if (isSubmitting) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending Message...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (spinner) spinner.style.display = 'none';
    }
  }

  function showStatusBanner(isSuccess, htmlContent) {
    if (!statusBanner) return;
    statusBanner.className = `form-status-banner show ${isSuccess ? 'form-status-success' : 'form-status-error'}`;
    statusBanner.innerHTML = `
      <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-triangle-exclamation'}"></i>
      <div>${htmlContent}</div>
    `;
    statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideStatusBanner() {
    if (!statusBanner) return;
    statusBanner.className = 'form-status-banner';
    statusBanner.innerHTML = '';
  }

  // -------------------------------------------------------------
  // 9. BACK TO TOP BUTTON
  // -------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
