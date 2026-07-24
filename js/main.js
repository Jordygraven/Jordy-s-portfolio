const pageType = document.body.dataset.page || 'index';
const contentRoot = document.getElementById('content');
let modalState = null;

function trackEvent(eventName, properties = {}) {
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, properties);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

function createModal(caseItem) {
  const details = caseItem.details || {};
  return `
    <div class="modal-backdrop" id="case-modal">
      <div class="modal-card">
        <button class="modal-close" type="button" aria-label="Close case study">×</button>
        <div class="modal-content">
          <p class="eyebrow">Case study</p>
          <h3>${escapeHtml(caseItem.title)}</h3>
          <p class="small">${escapeHtml(details.context || '')}</p>
          <div class="smart-grid">
            <div><h4>Challenge</h4><p>${escapeHtml(details.challenge || '')}</p></div>
            <div><h4>Approach</h4><p>${escapeHtml(details.approach || '')}</p></div>
            <div><h4>Result</h4><p>${escapeHtml(details.result || '')}</p></div>
          </div>
          <div class="metrics">
            ${(details.metrics || []).map(metric => `<span>${escapeHtml(metric)}</span>`).join('')}
          </div>
          <div class="ai-placeholder-row">
            ${(caseItem.aiApplications || []).map(app => `<div class="ai-placeholder">${escapeHtml(app)}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function showModal(caseItem) {
  modalState = caseItem;
  trackEvent('case_study_opened', {
    case_title: caseItem.title,
    page: pageType
  });
  document.body.classList.add('modal-open');
  const modalMarkup = createModal(caseItem);
  const existing = document.getElementById('case-modal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalMarkup);
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-backdrop')) closeModal();
  });
}

function closeModal() {
  document.body.classList.remove('modal-open');
  const existing = document.getElementById('case-modal');
  if (existing) existing.remove();
}

function removeLightbox() {
  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobile-nav-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

setupNavToggle();

function getContactIcon(type) {
  switch (type) {
    case 'WhatsApp':
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    case 'Email':
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 2v.2l8 5.4 8-5.4V7H4Zm16 10V9.8l-7.2 4.8a1 1 0 0 1-1.1 0L4 9.8V17h16Z"/></svg>';
    case 'LinkedIn':
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
    default:
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.7 9.75h2.76v1.12h.04c.38-.72 1.31-1.48 2.7-1.48 2.89 0 3.42 1.9 3.42 4.37V18H16.2v-7.59c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.91 1.97-2.91 4V18H10.7z"/></svg>';
  }
}

function getContactClass(type) {
  switch (type) {
    case 'WhatsApp':
      return 'whatsapp';
    case 'Email':
      return 'email';
    case 'LinkedIn':
      return 'linkedin';
    default:
      return '';
  }
}

function getToolIconUrl(icon) {
  if (!icon) return '';

  const supportedIcons = new Set([
    'jira',
    'figma',
    'lucid',
    'miro',
    'googleanalytics',
    'mysql',
    'looker',
    'claude',
    'n8n',
    'replit',
    'docker',
    'github',
    'vercel',
    'ngrok',
    'posthog',
    'v0'
  ]);

  const normalized = String(icon).toLowerCase();
  if (!supportedIcons.has(normalized)) return '';

  return `https://cdn.simpleicons.org/${encodeURIComponent(icon)}`;
}

function renderLightbox(items, index) {
  const item = items[index];
  if (!item) return;

  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', `
    <div class="lightbox" id="lightbox" tabindex="-1" role="dialog" aria-label="Expanded photo">
      <div class="lightbox-shell">
        <button class="lightbox-close" type="button" aria-label="Close image">×</button>
        <img class="lightbox-image" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}">
        <div class="lightbox-nav">
          <button class="lightbox-button" type="button" data-direction="-1" aria-label="Previous image">← Previous</button>
          <button class="lightbox-button" type="button" data-direction="1" aria-label="Next image">Next →</button>
        </div>
      </div>
    </div>
  `);

  const lightbox = document.getElementById('lightbox');
  lightbox.focus();
  lightbox.querySelector('.lightbox-close').addEventListener('click', removeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target.id === 'lightbox') removeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') removeLightbox();
    if (event.key === 'ArrowLeft') renderLightbox(items, (index - 1 + items.length) % items.length);
    if (event.key === 'ArrowRight') renderLightbox(items, (index + 1) % items.length);
  });
  lightbox.querySelectorAll('.lightbox-button').forEach(button => {
    button.addEventListener('click', () => {
      const direction = Number(button.dataset.direction || 0);
      renderLightbox(items, (index + direction + items.length) % items.length);
    });
  });
}

function renderIndex(data) {
  const hero = data.hero;
  const valueCards = data.valueCards.map(card => `
    <article class="card">
      <div class="card-icon">✦</div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.description)}</p>
      <div class="tags">
        ${card.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </article>
  `).join('');

  const experience = data.experience.map(item => `
    <article class="timeline-item ${escapeHtml(item.type || '')}">
      <div class="meta">
        <strong>${escapeHtml(item.role)}</strong>
        <span>${escapeHtml(item.period)}</span>
      </div>
      <p><strong>${escapeHtml(item.company)}</strong></p>
      <p>${escapeHtml(item.summary)}</p>
    </article>
  `).join('');

  const toolkitMarkup = (data.toolkit && data.toolkit.groups || []).map(group => `
    <div class="toolkit-card">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="toolkit-list">
        ${(group.items || []).map(item => {
          const iconUrl = getToolIconUrl(item.icon);
          return `
          <span class="toolkit-item">
            ${iconUrl ? `<img src="${escapeHtml(iconUrl)}" alt="" />` : ''}
            ${escapeHtml(item.name)}
          </span>
        `;
        }).join('')}
      </div>
    </div>
  `).join('');

  const cases = (data.caseStudies || []).map(item => {
    if (item.comingSoon) {
      return `
        <article class="case-item case-placeholder" data-clickable="false">
          <span class="case-badge">Coming soon</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
        </article>
      `;
    }

    return `
      <article class="case-item" data-clickable="true" data-case="${escapeHtml(item.title)}" tabindex="0" role="button" aria-label="Open case study: ${escapeHtml(item.title)}">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
      </article>
    `;
  }).join('');

  const galleryItems = data.gallery || [];
  const gallery = galleryItems.map((item, index) => `<button class="gallery-thumb" type="button" data-index="${index}" data-image="${escapeHtml(item.src)}" data-alt="${escapeHtml(item.alt)}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}"></button>`).join('');

  const contactChannels = data.contact.channels.map(item => `
    <a class="contact-card-item ${getContactClass(item.type || item.label)}" href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer" data-contact="${escapeHtml(item.type || item.label)}">
      <span class="contact-icon">${getContactIcon(item.type || item.label)}</span>
      <span class="contact-label">${escapeHtml(item.type === 'LinkedIn' ? 'Jordy Graven' : item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </a>
  `).join('');

  contentRoot.innerHTML = `
    <section class="hero" id="work">
      <div class="hero-copy">
        <span class="eyebrow">${escapeHtml(hero.eyebrow)}</span>
        <h1>${escapeHtml(hero.headline)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
        <p class="hero-subline">${escapeHtml(hero.subline)}</p>
        <div class="hero-actions">
          <a class="button" href="${escapeHtml(hero.ctaPrimary.href)}" ${hero.ctaPrimary.download ? 'download' : ''}>${escapeHtml(hero.ctaPrimary.label)}</a>
          <a class="button secondary" href="${escapeHtml(hero.ctaSecondary.href)}" target="_blank" rel="noreferrer">
            ${hero.ctaSecondary.icon ? `<img src="${escapeHtml(hero.ctaSecondary.icon)}" alt="" />` : ''}
            ${escapeHtml(hero.ctaSecondary.label)}
          </a>
          <a class="button secondary" href="${escapeHtml(hero.ctaTertiary.href)}" target="_blank" rel="noreferrer">${escapeHtml(hero.ctaTertiary.label)}</a>
        </div>
      </div>
      <div class="hero-panel">
        <img src="Photos/Profile photo/B3192E5B-B271-49F2-8239-9DFBD9219757.PNG" alt="Portrait of Jordy Graven">
        <div class="hero-meta">
          ${hero.highlights.map(stat => `<div><strong>${escapeHtml(stat.title)}</strong><span>${escapeHtml(stat.detail)}</span></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="value">
      <div class="section-header">
        <h2>What I do</h2>
      </div>
      <div class="grid-3">${valueCards}</div>
    </section>

    <section class="section" id="experience">
      <div class="section-header">
        <h2>Experience</h2>
      </div>
      <div class="timeline">${experience}</div>
    </section>

    <section class="section" id="toolkit">
      <div class="section-header">
        <h2>${escapeHtml(data.toolkit.title)}</h2>
      </div>
      <div class="toolkit-grid">${toolkitMarkup}</div>
    </section>

    <section class="section" id="case-studies">
      <div class="section-header">
        <h2>Case studies</h2>
      </div>
      <div class="case-list">${cases}</div>
    </section>

    <section class="section" id="about">
      <div class="about-layout">
        <div>
          <div class="section-header">
            <h2>${escapeHtml(data.about.title)}</h2>
          </div>
          <p>${escapeHtml(data.about.intro)}</p>
          <ul class="trait-list">
            ${data.about.traits.map(trait => `<li>${escapeHtml(trait)}</li>`).join('')}
          </ul>
        </div>
        <div class="gallery">${gallery}</div>
      </div>
    </section>

    <section class="section" id="contact">
      <div class="contact-card">
        <div class="section-header">
          <h2>Contact</h2>
        </div>
        <p>${escapeHtml(data.contact.intro)}</p>
        <div class="contact-list">${contactChannels}</div>
      </div>
    </section>
  `;

  document.querySelectorAll('.case-item[data-clickable="true"]').forEach(card => {
    card.addEventListener('click', () => {
      const caseItem = (data.caseStudies || []).find(item => item.title === card.dataset.case);
      if (caseItem) showModal(caseItem);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const caseItem = (data.caseStudies || []).find(item => item.title === card.dataset.case);
        if (caseItem) showModal(caseItem);
      }
    });
  });

  document.querySelectorAll('[data-contact]').forEach(link => {
    link.addEventListener('click', () => {
      const contactType = link.dataset.contact;
      trackEvent('contact_channel_clicked', {
        channel: contactType,
        page: pageType
      });
    });
  });

  document.querySelectorAll('.gallery-thumb').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index || 0);
      const image = button.dataset.image;
      const alt = button.dataset.alt;
      trackEvent('gallery_image_expanded', {
        image_src: image,
        image_alt: alt,
        image_index: index,
        page: pageType
      });
      renderLightbox(galleryItems, index);
    });
  });
}

function renderResume(data) {
  const experienceMarkup = data.experience.map(item => `
    <article class="timeline-item ${escapeHtml(item.type || '')}">
      <div class="meta">
        <strong>${escapeHtml(item.role)}</strong>
        <span>${escapeHtml(item.period)}</span>
      </div>
      <p><strong>${escapeHtml(item.company)}</strong></p>
      <ul>${item.highlights.map(highlight => `<li>${escapeHtml(highlight)}</li>`).join('')}</ul>
    </article>
  `).join('');

  contentRoot.innerHTML = `
    <section class="section">
      <div class="resume-grid">
        <div class="resume-panel">
          <span class="eyebrow">Resume</span>
          <h1>${escapeHtml(data.profile.name)}</h1>
          <p><strong>${escapeHtml(data.profile.title)}</strong></p>
          <p>${escapeHtml(data.profile.summary)}</p>
        </div>
        <div class="resume-panel">
          <h2>Skills</h2>
          <div class="tags">
            ${data.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join('')}
          </div>
          <h2 style="margin-top: 16px;">Certifications</h2>
          <ul>
            ${data.certifications.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Experience</h2>
        <p>Career progression across growth, operations, and product ownership.</p>
      </div>
      <div class="timeline">${experienceMarkup}</div>
    </section>
  `;
}

(async function init() {
  try {
    const data = await loadJson(pageType === 'resume' ? 'data/resume.json' : 'data/site.json');
    if (pageType === 'resume') {
      renderResume(data);
    } else {
      renderIndex(data);
    }
    trackEvent('portfolio_page_view', { page: pageType });

    document.querySelectorAll('a[href*="Jordy_Graven_CV.pdf"]').forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('cv_opened', { page: pageType });
      });
    });

    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('whatsapp_clicked', { page: pageType });
      });
    });

    document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('linkedin_clicked', { page: pageType });
      });
    });
  } catch (error) {
    contentRoot.innerHTML = `<section class="section"><p>${escapeHtml(error.message)}</p></section>`;
  }
})();
