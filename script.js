document.documentElement.classList.add('js');

const translations = {
  ko: {
    navAbout: '소개',
    navProjects: '프로젝트',
    navPublications: '출판',
    navAria: '주요 메뉴',
    languageAria: '언어 선택',
    homeAria: 'Jihun Shin 홈',
    roleSub: 'Bridge Digital Twin & Data-driven Maintenance',
    bioHello: '안녕하세요, 신지훈입니다.',
    cauName: '중앙대학교',
    bioStudy: '스마트시티학과 박사과정에 재학 중이며',
    labName: '스마트 프리팹 구조 연구실',
    bioLabAt: '에서',
    advisorName: '심창수 교수님',
    bioAdvisor: '의 지도를 받고 있습니다.',
    bioResearch: 'AI와 디지털 트윈을 활용해 오래된 교량의 손상을 정량화하고, 점검 기록을 유지관리 의사결정에 활용할 수 있는 데이터로 변환하는 연구를 수행합니다.',
    newsTitle: '최근 소식',
    news2026: '논문 “Mechanical degradation of naturally corroded rebars from a 45-year-old bridge slab: 3D quantification of section loss and a new corrosion damage indicator”이',
    newsEdge: '논문 “Edge-aware transformer-based damage segmentation framework for bridge inspection maps using synthetic data”가',
    newsTwin: '논문 “Digital Twin Framework for Bridge Slab Deterioration: From 2D Inspection Data to Predictive 3D Maintenance Modeling”이',
    publishedIn: '에 게재되었습니다.',
    projectsTitle: '프로젝트',
    viewProjects: '프로젝트 페이지',
    projectsComingTitle: '프로젝트 정보 준비 중',
    projectsComingText: '연구과제 · 수행 프로젝트',
    viewPublications: '전체 보기',
    projectsPageTitle: '프로젝트',
    projectsPageIntro: '연구과제 · 수행 프로젝트',
    projectsPageEmpty: '세부 정보 업데이트 예정',
    publicationsPageIntro: '논문 · 학술발표 · 최신순',
    firstAuthor: '제1저자',
    coAuthor: '공동저자',
    details: '정보',
    copy: '복사',
    copied: '복사됨',
    backToTop: '맨 위로'
  },
  en: {
    navAbout: 'About',
    navProjects: 'Projects',
    navPublications: 'Publication',
    navAria: 'Primary navigation',
    languageAria: 'Language selection',
    homeAria: 'Jihun Shin home',
    roleSub: 'Bridge Digital Twin & Data-driven Maintenance',
    bioHello: 'Hi, I’m Jihun Shin, a Ph.D. student at',
    cauName: 'Chung-Ang University',
    bioStudy: 'in the Department of Smart Cities and a member of the',
    labName: 'Smart Prefab Structures Laboratory',
    bioLabAt: ',',
    advisorName: 'advised by Prof. Chang-Su Shim',
    bioAdvisor: '.',
    bioResearch: 'My research uses AI and digital twins to quantify damage in aging bridges and transform inspection records into data that supports maintenance decisions.',
    newsTitle: 'News',
    news2026: '“Mechanical degradation of naturally corroded rebars from a 45-year-old bridge slab: 3D quantification of section loss and a new corrosion damage indicator” was published in',
    newsEdge: '“Edge-aware transformer-based damage segmentation framework for bridge inspection maps using synthetic data” was published in',
    newsTwin: '“Digital Twin Framework for Bridge Slab Deterioration: From 2D Inspection Data to Predictive 3D Maintenance Modeling” was published in',
    publishedIn: '.',
    projectsTitle: 'Projects',
    viewProjects: 'View projects',
    projectsComingTitle: 'Project information coming soon',
    projectsComingText: 'Research grants · Projects',
    viewPublications: 'View all',
    projectsPageTitle: 'Projects',
    projectsPageIntro: 'Research grants · Projects',
    projectsPageEmpty: 'Details coming soon',
    publicationsPageIntro: 'Journal articles · Conference papers · Newest first',
    firstAuthor: 'First author',
    coAuthor: 'Co-author',
    details: 'Details',
    copy: 'Copy',
    copied: 'Copied',
    backToTop: 'Back to top'
  }
};

const pageMetadata = {
  home: {
    ko: {
      title: '신지훈 · Jihun Shin',
      description: '신지훈 — 중앙대학교 스마트 프리팹 구조 연구실 박사과정. 교량 디지털 트윈, 구조물 유지관리, AI 기반 손상 분석 연구.'
    },
    en: {
      title: 'Jihun Shin · Research Portfolio',
      description: 'Jihun Shin — Ph.D. student at Chung-Ang University researching bridge digital twins, structural maintenance, and AI-based damage analysis.'
    }
  },
  projects: {
    ko: {
      title: '프로젝트 · 신지훈',
      description: '신지훈의 연구과제 및 수행 프로젝트.'
    },
    en: {
      title: 'Projects · Jihun Shin',
      description: 'Funded research and completed projects by Jihun Shin.'
    }
  },
  publications: {
    ko: {
      title: 'Publication · Jihun Shin',
      description: '신지훈의 논문 및 학술발표 목록.'
    },
    en: {
      title: 'Publication · Jihun Shin',
      description: 'Journal articles and conference papers by Jihun Shin.'
    }
  }
};

let currentLanguage = 'ko';

function storageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (_) {
    // Language still works when storage is unavailable.
  }
}

function setLanguage(language) {
  const lang = translations[language] ? language : 'ko';
  const dictionary = translations[lang];
  const page = document.body.dataset.page || 'home';
  const metadata = pageMetadata[page][lang];
  currentLanguage = lang;

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = dictionary[node.dataset.i18n];
    if (value !== undefined) node.textContent = value;
  });

  document.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  document.querySelectorAll('[data-copy-button]').forEach((button) => {
    button.textContent = dictionary.copy;
  });

  document.title = metadata.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = metadata.description;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.content = metadata.title;
  if (ogDescription) ogDescription.content = metadata.description;

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) backToTop.setAttribute('aria-label', dictionary.backToTop);

  const navigation = document.querySelector('.nav-links');
  const languageToggle = document.querySelector('.lang-toggle');
  const homeLink = document.querySelector('.site-name');
  if (navigation) navigation.setAttribute('aria-label', dictionary.navAria);
  if (languageToggle) languageToggle.setAttribute('aria-label', dictionary.languageAria);
  if (homeLink) homeLink.setAttribute('aria-label', dictionary.homeAria);

  const profilePhoto = document.querySelector('.profile-photo');
  if (profilePhoto) profilePhoto.alt = lang === 'ko' ? '신지훈 프로필 사진' : 'Portrait of Jihun Shin';

  storageSet('jihun-language', lang);
}

document.querySelectorAll('[data-lang]').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

window.toggleBib = function toggleBib(id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.hidden = !box.hidden;
  const button = document.querySelector(`[aria-controls="${id}"]`);
  if (button) button.setAttribute('aria-expanded', String(!box.hidden));
};

window.copyBib = function copyBib(id) {
  const box = document.getElementById(id);
  if (!box) return;
  const pre = box.querySelector('pre');
  const button = box.querySelector('[data-copy-button]');
  if (!pre || !button) return;

  const text = pre.textContent;
  const done = () => {
    button.textContent = translations[currentLanguage].copied;
    window.setTimeout(() => {
      button.textContent = translations[currentLanguage].copy;
    }, 1400);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => {});
  }
};

(function setupProgressBar() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;

  let ticking = false;
  const update = () => {
    const top = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min(1, Math.max(0, top / height)) : 0;
    fill.style.transform = `scaleX(${progress})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}());

(function setupBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 480);
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());

(function setupReveal() {
  const elements = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  elements.forEach((element) => observer.observe(element));
}());

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

setLanguage(storageGet('jihun-language') || 'ko');
