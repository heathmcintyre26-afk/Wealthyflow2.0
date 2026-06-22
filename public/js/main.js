/* =========================================================
   WealthyFlow 2.0 — Main Site JS
   ========================================================= */

'use strict';

// ── Course Data ──────────────────────────────────────────────
const COURSES = {
  mindset: [
    {
      id: 'm1',
      title: 'Millionaire Mindset Blueprint',
      desc: 'Reprogram your subconscious beliefs, eliminate scarcity thinking, and install the exact thought patterns of the world\'s wealthiest individuals.',
      thumb: '🧠',
      type: 'mindset',
      level: 'beginner',
      duration: '6h 30m',
      lessons: 24,
      students: '4.2k',
      price: '$197',
      original: '$397',
      hot: true,
      curriculum: [
        'The psychology of wealth and abundance',
        'Identifying and destroying limiting beliefs',
        'Daily rituals of high-performers',
        'Visualization & manifestation techniques',
        'Building unshakeable confidence',
        'The compound effect of small habits',
        'Networking with the right people',
        'Creating your personal success roadmap',
      ]
    },
    {
      id: 'm2',
      title: 'Elite Morning Rituals',
      desc: 'The exact morning routines used by billionaires and top performers to prime their minds for peak productivity and unparalleled success.',
      thumb: '🌅',
      type: 'mindset',
      level: 'beginner',
      duration: '3h 45m',
      lessons: 16,
      students: '3.8k',
      price: '$97',
      original: '$197',
      hot: false,
      curriculum: [
        'Why mornings determine your entire day',
        'Designing your perfect morning sequence',
        'Cold exposure and mental toughness',
        'Journaling for clarity and focus',
        'Exercise protocols for peak performance',
        'Mindfulness and breathing techniques',
      ]
    },
    {
      id: 'm3',
      title: 'Abundance Frequency Mastery',
      desc: 'Tap into the vibration of wealth and attract opportunities, connections, and resources that align with your financial goals.',
      thumb: '✨',
      type: 'mindset',
      level: 'intermediate',
      duration: '5h 15m',
      lessons: 20,
      students: '2.9k',
      price: '$147',
      original: '$297',
      hot: false,
      curriculum: [
        'Understanding the Law of Attraction for wealth',
        'Frequency alignment techniques',
        'Emotional intelligence and wealth',
        'Gratitude as a manifestation tool',
        'Releasing resistance to money',
        'Advanced visualization methods',
      ]
    },
    {
      id: 'm4',
      title: 'Fearless Wealth Psychology',
      desc: 'Conquer the fear of failure, rejection, and risk that holds 99% of people back from creating extraordinary wealth.',
      thumb: '⚡',
      type: 'mindset',
      level: 'advanced',
      duration: '7h 00m',
      lessons: 28,
      students: '1.7k',
      price: '$297',
      original: '$597',
      hot: true,
      curriculum: [
        'The neuroscience of fear and courage',
        'Reframing failure as data',
        'Building resilience through adversity',
        'Decision-making under uncertainty',
        'Embracing calculated risk',
        'The identity shift: becoming wealthy',
        'Accountability systems that work',
        'Building high-performance teams',
      ]
    },
    {
      id: 'm5',
      title: 'Focus & Flow State Mastery',
      desc: 'Learn to enter deep work states on demand, eliminate distractions, and operate at a level of performance most people never experience.',
      thumb: '🎯',
      type: 'mindset',
      level: 'intermediate',
      duration: '4h 30m',
      lessons: 18,
      students: '3.1k',
      price: '$127',
      original: '$247',
      hot: false,
      curriculum: [
        'The science of flow states',
        'Environment design for deep work',
        'Digital minimalism for high achievers',
        'Time blocking strategies',
        'Energy management vs. time management',
        'Recovery and performance cycles',
      ]
    },
    {
      id: 'm6',
      title: 'The Wealth Identity Shift',
      desc: 'Transform your core identity from someone who earns money to someone who creates, multiplies, and preserves generational wealth.',
      thumb: '👑',
      type: 'mindset',
      level: 'advanced',
      duration: '8h 15m',
      lessons: 32,
      students: '2.2k',
      price: '$347',
      original: '$697',
      hot: true,
      curriculum: [
        'Identity vs. behavior: which comes first',
        'The wealthy person\'s worldview',
        'Social dynamics and upleveling your circle',
        'Negotiation and value extraction',
        'Building a legacy mindset',
        'Philanthropy and giving back',
        'Passing wealth values to next generation',
        'Living a life aligned with your true potential',
      ]
    },
  ],
  mastery: [
    {
      id: 'ms1',
      title: 'Real Estate Investment Mastery',
      desc: 'From zero to portfolio: learn how to identify, finance, acquire, and manage income-producing properties for passive cash flow.',
      thumb: '🏢',
      type: 'mastery',
      level: 'intermediate',
      duration: '12h 00m',
      lessons: 48,
      students: '5.6k',
      price: '$497',
      original: '$997',
      hot: true,
      curriculum: [
        'Real estate fundamentals and market cycles',
        'Deal analysis and due diligence',
        'Creative financing strategies',
        'Property management systems',
        'Flipping vs. buy-and-hold strategies',
        'Commercial real estate opportunities',
        'Tax strategies for real estate investors',
        'Scaling from 1 to 100 units',
      ]
    },
    {
      id: 'ms2',
      title: 'High-Ticket Sales Domination',
      desc: 'Master the art and science of selling premium offers at $5k–$100k+ with proven frameworks used by elite sales professionals.',
      thumb: '💼',
      type: 'mastery',
      level: 'advanced',
      duration: '9h 30m',
      lessons: 38,
      students: '4.1k',
      price: '$397',
      original: '$797',
      hot: true,
      curriculum: [
        'The psychology of high-ticket buyers',
        'Building an irresistible offer',
        'Discovery call mastery',
        'Objection handling frameworks',
        'Closing techniques for premium deals',
        'Follow-up systems that convert',
        'Building a referral machine',
        'Scaling with a sales team',
      ]
    },
    {
      id: 'ms3',
      title: 'Digital Business Empire',
      desc: 'Build a scalable online business that generates $10k–$100k+ per month through proven digital products and service models.',
      thumb: '💻',
      type: 'mastery',
      level: 'beginner',
      duration: '15h 00m',
      lessons: 60,
      students: '7.2k',
      price: '$297',
      original: '$597',
      hot: false,
      curriculum: [
        'Choosing the right business model',
        'Identifying your niche and avatar',
        'Building your brand authority',
        'Creating and launching digital products',
        'Traffic generation strategies',
        'Email marketing for revenue',
        'Automation and systemization',
        'Hiring and outsourcing for growth',
      ]
    },
    {
      id: 'ms4',
      title: 'Stock Market Mastery Pro',
      desc: 'Learn institutional-grade trading and investing strategies to build a six-figure portfolio in the stock market.',
      thumb: '📈',
      type: 'mastery',
      level: 'intermediate',
      duration: '10h 45m',
      lessons: 42,
      students: '6.3k',
      price: '$447',
      original: '$897',
      hot: false,
      curriculum: [
        'Fundamental vs. technical analysis',
        'Reading financial statements',
        'Options trading strategies',
        'Portfolio construction and risk management',
        'Sector rotation and market timing',
        'Dividend investing for passive income',
        'Tax-advantaged investment accounts',
        'Building a 7-figure investment portfolio',
      ]
    },
    {
      id: 'ms5',
      title: 'Agency Building Blueprint',
      desc: 'Launch and scale a highly profitable marketing, consulting, or service agency to $50k–$250k/month.',
      thumb: '🚀',
      type: 'mastery',
      level: 'advanced',
      duration: '11h 20m',
      lessons: 44,
      students: '3.4k',
      price: '$547',
      original: '$1,097',
      hot: true,
      curriculum: [
        'Agency model selection and positioning',
        'Client acquisition systems',
        'Pricing for maximum profit',
        'Team building and delegation',
        'Operations and project management',
        'Retention and upselling strategies',
        'Scaling past the owner bottleneck',
        'Exit strategies and acquisitions',
      ]
    },
    {
      id: 'ms6',
      title: 'Private Lending & Hard Money',
      desc: 'Become the bank: leverage private lending strategies to earn 10–15% returns secured by real estate assets.',
      thumb: '🏦',
      type: 'mastery',
      level: 'advanced',
      duration: '6h 45m',
      lessons: 26,
      students: '1.9k',
      price: '$397',
      original: '$797',
      hot: false,
      curriculum: [
        'Private lending fundamentals',
        'Underwriting deals and assessing risk',
        'Trust deeds and mortgage notes',
        'Legal documentation and protection',
        'Finding quality borrowers',
        'Building a private lending portfolio',
      ]
    },
  ],
  crypto: [
    {
      id: 'c1',
      title: 'WealthFlow Crypto Foundations',
      desc: 'The complete beginner\'s guide to cryptocurrency — from buying your first Bitcoin to understanding blockchain technology and DeFi.',
      thumb: '₿',
      type: 'crypto',
      level: 'beginner',
      duration: '8h 00m',
      lessons: 32,
      students: '9.8k',
      price: '$197',
      original: '$397',
      hot: true,
      curriculum: [
        'What is blockchain and why it matters',
        'Bitcoin: the digital gold standard',
        'Ethereum and smart contracts',
        'Setting up secure wallets',
        'Buying, selling, and storing crypto',
        'Understanding market cycles',
        'Avoiding common crypto scams',
        'Building your first crypto portfolio',
      ]
    },
    {
      id: 'c2',
      title: 'DeFi Yield Maximizer',
      desc: 'Generate passive income through decentralized finance — liquidity pools, yield farming, staking, and lending protocols.',
      thumb: '🔗',
      type: 'crypto',
      level: 'intermediate',
      duration: '9h 30m',
      lessons: 38,
      students: '5.4k',
      price: '$347',
      original: '$697',
      hot: true,
      curriculum: [
        'DeFi ecosystem overview',
        'DEXs and automated market makers',
        'Liquidity provision strategies',
        'Yield farming and APY optimization',
        'Staking protocols and rewards',
        'Risk management in DeFi',
        'Smart contract security audits',
        'Cross-chain opportunities',
      ]
    },
    {
      id: 'c3',
      title: 'Crypto Trading Mastery',
      desc: 'Professional-grade technical analysis, entry/exit strategies, and risk management for consistent crypto trading profits.',
      thumb: '📊',
      type: 'crypto',
      level: 'intermediate',
      duration: '11h 15m',
      lessons: 45,
      students: '6.7k',
      price: '$447',
      original: '$897',
      hot: true,
      curriculum: [
        'Crypto market structure and cycles',
        'Technical analysis for crypto',
        'On-chain analysis metrics',
        'Entry and exit strategies',
        'Position sizing and risk management',
        'Futures and perpetual contracts',
        'Sentiment and social media analysis',
        'Building consistent trading systems',
      ]
    },
    {
      id: 'c4',
      title: 'NFT & Digital Assets Pro',
      desc: 'Navigate the NFT market with confidence — from minting your own collections to identifying high-value investment opportunities.',
      thumb: '🎨',
      type: 'crypto',
      level: 'beginner',
      duration: '6h 30m',
      lessons: 26,
      students: '4.1k',
      price: '$247',
      original: '$497',
      hot: false,
      curriculum: [
        'NFT fundamentals and standards',
        'Evaluating NFT projects',
        'Minting and creating NFTs',
        'NFT marketplaces deep dive',
        'Community and holder value',
        'NFT utilities and real-world integration',
      ]
    },
    {
      id: 'c5',
      title: 'Altcoin Gems Research Framework',
      desc: 'Discover the exact research process used to identify 10x–100x altcoin opportunities before they go mainstream.',
      thumb: '💎',
      type: 'crypto',
      level: 'advanced',
      duration: '7h 45m',
      lessons: 30,
      students: '3.3k',
      price: '$397',
      original: '$797',
      hot: false,
      curriculum: [
        'What makes an altcoin a gem',
        'Tokenomics analysis deep dive',
        'Team and developer activity analysis',
        'On-chain metrics for early signals',
        'Narrative and sector rotation',
        'Portfolio allocation strategies',
        'Exit strategies and profit taking',
      ]
    },
    {
      id: 'c6',
      title: 'Crypto Tax & Legal Mastery',
      desc: 'Legally minimize your crypto tax burden, stay compliant with evolving regulations, and structure your crypto wealth like a pro.',
      thumb: '⚖️',
      type: 'crypto',
      level: 'advanced',
      duration: '5h 00m',
      lessons: 20,
      students: '2.8k',
      price: '$297',
      original: '$597',
      hot: false,
      curriculum: [
        'Crypto tax fundamentals by country',
        'Tax-loss harvesting strategies',
        'Business structures for crypto',
        'International crypto tax planning',
        'Reporting requirements and tools',
        'Working with crypto-savvy accountants',
      ]
    },
  ]
};

// ── DOM Helpers ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Navbar Scroll ────────────────────────────────────────────
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile Nav ───────────────────────────────────────────────
function initMobileNav() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ── Active Nav Link ──────────────────────────────────────────
function initNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a, #mobile-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

// ── Smooth scroll for anchor links ──────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── Scroll Reveal ────────────────────────────────────────────
function initScrollReveal() {
  const items = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => observer.observe(i));
}

// ── Course Tabs ──────────────────────────────────────────────
function initCourseTabs() {
  const tabs = $$('.tab-btn');
  const panels = $$('.course-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active', 'active-purple'));
      panels.forEach(p => p.classList.remove('active'));

      if (target === 'mastery') {
        tab.classList.add('active-purple');
      } else {
        tab.classList.add('active');
      }

      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

// ── Render Course Cards ──────────────────────────────────────
function renderCourseCards() {
  Object.entries(COURSES).forEach(([type, courses]) => {
    const grid = document.getElementById(`grid-${type}`);
    if (!grid) return;

    grid.innerHTML = courses.map(c => `
      <div class="course-card reveal" data-course="${c.id}" tabindex="0" role="button" aria-label="View ${c.title}">
        <div class="course-card-thumb">
          <div class="thumb-bg thumb-${type}">
            <div class="thumb-glow"></div>
          </div>
          <span class="thumb-icon">${c.thumb}</span>
          <span class="badge-level badge-${c.level}">${c.level}</span>
          ${c.hot ? '<span class="badge-hot">🔥 Hot</span>' : ''}
        </div>
        <div class="course-card-body">
          <div class="course-card-category cat-${type}">${type.toUpperCase()}</div>
          <h3 class="course-card-title">${c.title}</h3>
          <p class="course-card-desc">${c.desc}</p>
          <div class="course-card-meta">
            <span>⏱ ${c.duration}</span>
            <span>📚 ${c.lessons} lessons</span>
            <span>👥 ${c.students}</span>
          </div>
          <div class="course-card-footer">
            <div class="course-price">
              <span class="price-main">${c.price}</span>
              <span class="price-original">${c.original}</span>
            </div>
            <button class="btn btn-gold btn-sm enroll-btn" data-course="${c.id}">Enroll Now</button>
          </div>
        </div>
      </div>
    `).join('');
  });

  // Re-run scroll reveal after rendering
  initScrollReveal();

  // Card click → modal
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('enroll-btn')) {
        openCourseModal(card.dataset.course);
      }
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCourseModal(card.dataset.course);
      }
    });
  });

  // Enroll button
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const courseId = btn.dataset.course;
      handleEnroll(courseId, btn);
    });
  });
}

// ── Course Modal ─────────────────────────────────────────────
function openCourseModal(courseId) {
  const allCourses = [...COURSES.mindset, ...COURSES.mastery, ...COURSES.crypto];
  const course = allCourses.find(c => c.id === courseId);
  if (!course) return;

  const modal = $('#course-modal');
  const overlay = $('#modal-overlay');
  if (!modal || !overlay) return;

  modal.querySelector('.modal-thumb').className = `modal-thumb thumb-bg thumb-${course.type}`;
  modal.querySelector('.modal-thumb').innerHTML = `<div class="thumb-glow"></div><span style="font-size:4rem;position:relative;z-index:1">${course.thumb}</span>`;
  modal.querySelector('.modal-category').textContent = course.type.toUpperCase();
  modal.querySelector('.modal-category').className = `course-card-category cat-${course.type} modal-category`;
  modal.querySelector('.modal-title-text').textContent = course.title;
  modal.querySelector('.modal-desc').textContent = course.desc;
  modal.querySelector('.modal-price-main').textContent = course.price;
  modal.querySelector('.modal-meta').innerHTML = `
    <span>⏱ ${course.duration}</span>
    <span>📚 ${course.lessons} lessons</span>
    <span>👥 ${course.students} students</span>
    <span class="badge-level badge-${course.level}">${course.level}</span>
  `;
  modal.querySelector('.curriculum-list').innerHTML = course.curriculum
    .map(item => `<li>${item}</li>`).join('');

  modal.querySelector('.modal-enroll-btn').dataset.course = courseId;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
  const overlay = $('#modal-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function initModal() {
  const overlay = $('#modal-overlay');
  const closeBtn = $('#modal-close');

  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCourseModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCourseModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCourseModal();
  });

  // Enroll from modal
  const enrollBtn = document.querySelector('.modal-enroll-btn');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      handleEnroll(enrollBtn.dataset.course, enrollBtn);
      closeCourseModal();
    });
  }
}

// ── Enroll Handler ────────────────────────────────────────────
function handleEnroll(courseId, btn) {
  const allCourses = [...COURSES.mindset, ...COURSES.mastery, ...COURSES.crypto];
  const course = allCourses.find(c => c.id === courseId);
  if (!course) return;

  const key = `enrolled_${courseId}`;
  if (localStorage.getItem(key)) {
    showToast(`You're already enrolled in "${course.title}"! 🎓`, 'info');
    return;
  }

  if (btn) {
    btn.textContent = '✓ Enrolled!';
    btn.disabled = true;
    btn.style.background = 'rgba(100,200,100,0.15)';
    btn.style.color = '#64c864';
    btn.style.border = '1px solid rgba(100,200,100,0.3)';
  }

  localStorage.setItem(key, '1');
  showToast(`🎉 Enrolled in "${course.title}"! Welcome aboard!`, 'success');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Animated counters ─────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = $$('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Tab navigation from hero CTA ─────────────────────────────
function initCTAButtons() {
  document.querySelectorAll('[data-goto-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.gotoTab;
      const tab = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
      if (tab) {
        tab.click();
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // "Start Learning" hero button → courses section
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── Restore enrolled state ────────────────────────────────────
function restoreEnrolledState() {
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    const key = `enrolled_${btn.dataset.course}`;
    if (localStorage.getItem(key)) {
      btn.textContent = '✓ Enrolled';
      btn.disabled = true;
      btn.style.background = 'rgba(100,200,100,0.15)';
      btn.style.color = '#64c864';
      btn.style.border = '1px solid rgba(100,200,100,0.3)';
    }
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initNavHighlight();
  initSmoothScroll();
  initCourseTabs();
  renderCourseCards();
  initModal();
  initCounters();
  initCTAButtons();

  // Restore enrolled buttons after a tick
  setTimeout(restoreEnrolledState, 100);

  // Activate first tab
  const firstTab = document.querySelector('.tab-btn[data-tab="mindset"]');
  if (firstTab) firstTab.click();

  // Scroll reveal initial pass
  setTimeout(initScrollReveal, 100);
});
