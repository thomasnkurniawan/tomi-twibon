import './style.css'
import { createTwibbonEditor } from './twibbon-editor.js'
import { dataService, localDataMeta, toSlug } from './services/local-data.js'
import {
  getLocale,
  languageSwitcher,
  localizePage,
  setLocale,
  translateText,
} from './i18n.js'

const app = document.querySelector('#app')
const toastRegion = document.querySelector('#toast-region')
let destroyCurrentView = null

const backgroundLabels = {
  mist: 'Soft mist',
  paper: 'Warm paper',
  midnight: 'Midnight',
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function showToast(message, tone = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-${tone}`
  toast.textContent = translateText(message)
  toastRegion.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('is-visible'))
  setTimeout(() => {
    toast.classList.remove('is-visible')
    setTimeout(() => toast.remove(), 220)
  }, 3200)
}

function setTitle(title) {
  document.title = title
    ? `${translateText(title)} — Twibbonizer`
    : `Twibbonizer — ${translateText('Campaign frames made simple.')}`
}

function navigate(path, { replace = false } = {}) {
  if (replace) history.replaceState({}, '', path)
  else history.pushState({}, '', path)
  renderRoute()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function brand() {
  return `
    <a href="/" class="brand" data-link aria-label="Twibbonizer home">
      <span class="brand-mark" aria-hidden="true"><span></span></span>
      <span>Twibbonizer</span>
    </a>
  `
}

function publicHeader({ transparent = false } = {}) {
  const user = dataService.getCurrentUser()
  return `
    <header class="site-header ${transparent ? 'site-header-transparent' : ''}">
      <div class="header-inner">
        ${brand()}
        <nav class="header-actions" aria-label="Main navigation">
          ${languageSwitcher()}
          ${
            user
              ? `<a class="button button-quiet" href="/dashboard" data-link>Dashboard</a>`
              : `<a class="nav-link" href="/login" data-link>Log in</a>
                 <a class="button button-dark" href="/register" data-link>Start free</a>`
          }
        </nav>
      </div>
    </header>
  `
}

function appHeader(user) {
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return `
    <header class="app-header">
      <div class="app-header-inner">
        ${brand()}
        <div class="account-menu">
          ${languageSwitcher()}
          <span class="token-badge" title="Campaign tokens">
            <span aria-hidden="true">◆</span>
            ${user.tokenBalance} token${user.tokenBalance === 1 ? '' : 's'}
          </span>
          <span class="avatar" aria-hidden="true">${escapeHtml(initials)}</span>
          <span class="account-name">${escapeHtml(user.name)}</span>
          <button class="button button-quiet button-small" id="logout-button" type="button">Log out</button>
        </div>
      </div>
    </header>
  `
}

function appShell(user, content) {
  return `
    <div class="app-shell">
      ${appHeader(user)}
      <main class="app-main">${content}</main>
    </div>
  `
}

function bindLogout() {
  document.querySelector('#logout-button')?.addEventListener('click', () => {
    dataService.logout()
    showToast('You are logged out.')
    navigate('/')
  })
}

function landingPage() {
  setTitle('')
  app.innerHTML = `
    <div class="landing-page">
      ${publicHeader({ transparent: true })}
      <main>
        <section class="hero section-shell">
          <div class="hero-copy">
            <span class="eyebrow"><span class="eyebrow-dot"></span> Campaign pages, ready in minutes</span>
            <h1>Turn every supporter into your campaign’s <em>loudest voice.</em></h1>
            <p class="hero-lead">
              Create a branded photo-frame campaign, share one link, and let your community
              make polished campaign photos from any device.
            </p>
            <div class="hero-actions">
              <a class="button button-primary button-large" href="/register" data-link>
                Create your first campaign
                <span aria-hidden="true">→</span>
              </a>
              <a class="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
            </div>
            <div class="trust-line">
              <span class="trust-faces" aria-hidden="true">
                <span>AK</span><span>JM</span><span>RL</span>
              </span>
              <span><strong>2 free campaign tokens</strong><br>No card required</span>
            </div>
          </div>

          <div class="hero-product" aria-label="Campaign page product preview">
            <div class="browser-card">
              <div class="browser-bar">
                <span class="browser-dots"><i></i><i></i><i></i></span>
                <span class="browser-address">twibbonizer.app/c/green-week</span>
              </div>
              <div class="browser-content">
                <div class="preview-kicker">GREEN WEEK 2026</div>
                <h2>I’m taking a stand for a greener tomorrow.</h2>
                <p>Join thousands of neighbors building cleaner, kinder cities.</p>
                <div class="preview-editor">
                  <div class="preview-photo">
                    <div class="preview-person">
                      <span class="preview-head"></span>
                      <span class="preview-body"></span>
                    </div>
                    <div class="preview-frame">
                      <b>GREEN</b>
                      <span>WEEK 2026</span>
                    </div>
                  </div>
                  <div class="preview-action">Upload your photo</div>
                </div>
              </div>
            </div>
            <div class="floating-stat">
              <span class="stat-icon" aria-hidden="true">↗</span>
              <span><strong>1,284</strong><small>supporter downloads</small></span>
            </div>
          </div>
        </section>

        <section class="proof-strip">
          <p>Made for campaigns that move people</p>
          <div class="proof-list" aria-label="Campaign types">
            <span>COMMUNITIES</span><span>EVENTS</span><span>NONPROFITS</span><span>CREATORS</span><span>CAUSES</span>
          </div>
        </section>

        <section id="how-it-works" class="steps-section section-shell">
          <div class="section-heading">
            <span class="eyebrow">Simple by design</span>
            <h2>From idea to shareable<br>in three small steps.</h2>
            <p>No design team, code, or complicated setup needed.</p>
          </div>
          <div class="steps-grid">
            <article class="step-card">
              <span class="step-number">01</span>
              <div class="step-art step-art-frame"><span></span></div>
              <h3>Build your campaign</h3>
              <p>Add a title, message, frame, and colors that feel like your brand.</p>
            </article>
            <article class="step-card step-card-featured">
              <span class="step-number">02</span>
              <div class="step-art step-art-link"><span>twbn.to/your-campaign</span></div>
              <h3>Publish one link</h3>
              <p>Share your campaign page anywhere your community already gathers.</p>
            </article>
            <article class="step-card">
              <span class="step-number">03</span>
              <div class="step-art step-art-download"><span>↓</span></div>
              <h3>Watch it spread</h3>
              <p>Supporters create and download their own campaign-ready photos.</p>
            </article>
          </div>
        </section>

        <section class="feature-section section-shell">
          <div class="feature-panel">
            <div class="feature-copy">
              <span class="eyebrow eyebrow-light">Built for momentum</span>
              <h2>Your campaign. Their photo. One unmistakable movement.</h2>
              <p>
                Every supporter gets a polished result without uploading their photo to a server.
                Their image stays on their device from start to finish.
              </p>
              <ul class="feature-list">
                <li><span>✓</span> Private, browser-based image processing</li>
                <li><span>✓</span> Mobile-friendly crop and positioning</li>
                <li><span>✓</span> Downloads optimized for sharing</li>
              </ul>
            </div>
            <div class="feature-visual">
              <div class="phone-card phone-back">
                <div class="mini-photo mini-photo-two"></div>
                <p>OUR CITY<br><strong>OUR FUTURE</strong></p>
              </div>
              <div class="phone-card phone-front">
                <div class="mini-photo"></div>
                <p>I’M WITH<br><strong>THE MOVEMENT</strong></p>
                <span class="phone-download">Downloaded ✓</span>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-section section-shell">
          <span class="eyebrow">Your first two are on us</span>
          <h2>A stronger campaign can start today.</h2>
          <p>Register free, create two campaigns, and see what your community makes.</p>
          <a class="button button-primary button-large" href="/register" data-link>Get 2 free tokens <span>→</span></a>
        </section>
      </main>
      <footer class="site-footer section-shell">
        ${brand()}
        <p>Campaign frames made simple.</p>
        <span>© ${new Date().getFullYear()} Twibbonizer</span>
      </footer>
    </div>
  `
}

function authPage(mode) {
  const isRegister = mode === 'register'
  const currentUser = dataService.getCurrentUser()
  if (currentUser) {
    navigate('/dashboard', { replace: true })
    return
  }

  setTitle(isRegister ? 'Create your account' : 'Welcome back')
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-brand">${brand()}${languageSwitcher()}</div>
      <main class="auth-layout">
        <section class="auth-card">
          <a class="back-link" href="/" data-link>← Back to home</a>
          <div class="auth-heading">
            <span class="eyebrow">${isRegister ? 'Start for free' : 'Welcome back'}</span>
            <h1>${isRegister ? 'Create your campaign studio.' : 'Continue building momentum.'}</h1>
            <p>${isRegister ? `Your account includes ${localDataMeta.freeCampaignTokens} free campaign tokens.` : 'Log in to manage your campaigns and tokens.'}</p>
          </div>
          <form id="auth-form" class="form-stack" novalidate>
            ${
              isRegister
                ? `<label class="field">
                    <span>Full name</span>
                    <input name="name" type="text" autocomplete="name" placeholder="Your name" required>
                  </label>`
                : ''
            }
            <label class="field">
              <span>Email address</span>
              <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
            </label>
            <label class="field">
              <span>Password</span>
              <input name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" placeholder="${isRegister ? 'At least 8 characters' : 'Your password'}" required minlength="8">
            </label>
            <p id="form-error" class="form-message form-message-error hidden" role="alert"></p>
            <button class="button button-primary button-full" type="submit">
              ${isRegister ? 'Create free account' : 'Log in'}
            </button>
          </form>
          <p class="auth-switch">
            ${isRegister ? 'Already have an account?' : 'New to Twibbonizer?'}
            <a href="/${isRegister ? 'login' : 'register'}" data-link>${isRegister ? 'Log in' : 'Create an account'}</a>
          </p>
          <p class="local-auth-note">MVP note: this account is stored only in this browser.</p>
        </section>
        <aside class="auth-aside">
          <div class="auth-quote-mark">“</div>
          <blockquote>It should take minutes to give a movement a face.</blockquote>
          <p>Twibbonizer keeps setup simple so you can focus on the message that matters.</p>
          <div class="auth-token-card">
            <span class="token-gem">◆</span>
            <span><strong>2 campaign tokens</strong><small>included with every new account</small></span>
          </div>
        </aside>
      </main>
    </div>
  `

  document.querySelector('#auth-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const button = form.querySelector('button[type="submit"]')
    const errorElement = form.querySelector('#form-error')
    const formData = new FormData(form)
    errorElement.classList.add('hidden')
    button.disabled = true
    button.textContent = translateText(isRegister ? 'Creating account…' : 'Logging in…')

    try {
      if (isRegister) {
        await dataService.register({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
        })
        showToast('Welcome! Your 2 free campaign tokens are ready.')
      } else {
        await dataService.login({
          email: formData.get('email'),
          password: formData.get('password'),
        })
        showToast('Welcome back.')
      }
      navigate('/dashboard')
    } catch (error) {
      errorElement.textContent = translateText(error.message)
      errorElement.classList.remove('hidden')
      button.disabled = false
      button.textContent = translateText(isRegister ? 'Create free account' : 'Log in')
    }
  })
}

function requireUser() {
  const user = dataService.getCurrentUser()
  if (!user) {
    showToast('Log in to continue.', 'info')
    navigate('/login', { replace: true })
    return null
  }
  return user
}

function campaignStatus(campaign) {
  return campaign.published
    ? '<span class="status-pill status-live"><i></i> Live</span>'
    : '<span class="status-pill status-draft"><i></i> Draft</span>'
}

function dashboardPage() {
  const user = requireUser()
  if (!user) return
  const campaigns = dataService.listCampaigns(user.id)
  const liveCampaigns = campaigns.filter((campaign) => campaign.published).length
  setTitle('Dashboard')

  app.innerHTML = appShell(
    user,
    `
      <div class="dashboard-heading">
        <div>
          <span class="eyebrow">Campaign studio</span>
          <h1>Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${escapeHtml(user.name.split(' ')[0])}.</h1>
          <p>Make something your community will be proud to share.</p>
        </div>
        <a class="button button-primary ${user.tokenBalance < 1 ? 'is-disabled' : ''}" href="/campaigns/new" data-link ${user.tokenBalance < 1 ? 'aria-disabled="true"' : ''}>
          <span aria-hidden="true">＋</span> New campaign
        </a>
      </div>

      <section class="dashboard-stats" aria-label="Account overview">
        <article class="stat-card stat-card-tokens">
          <span class="stat-card-icon">◆</span>
          <div><strong>${user.tokenBalance}</strong><span>Campaign token${user.tokenBalance === 1 ? '' : 's'} available</span></div>
          <small>1 token creates 1 campaign</small>
        </article>
        <article class="stat-card">
          <span class="stat-card-icon stat-card-icon-blue">▦</span>
          <div><strong>${campaigns.length}</strong><span>Total campaign${campaigns.length === 1 ? '' : 's'}</span></div>
          <small>Drafts and published</small>
        </article>
        <article class="stat-card">
          <span class="stat-card-icon stat-card-icon-green">●</span>
          <div><strong>${liveCampaigns}</strong><span>Published campaign${liveCampaigns === 1 ? '' : 's'}</span></div>
          <small>Currently public</small>
        </article>
      </section>

      <section class="campaign-section">
        <div class="section-row">
          <div><h2>Your campaigns</h2><p>Manage, publish, and share your campaign pages.</p></div>
        </div>
        ${
          campaigns.length
            ? `<div class="campaign-grid">
                ${campaigns
                  .map(
                    (campaign) => `
                      <article class="campaign-card">
                        <div class="campaign-card-preview theme-${campaign.theme.background}" style="--campaign-accent:${escapeHtml(campaign.theme.accent)}">
                          <img src="${escapeHtml(campaign.frameAsset)}" alt="" />
                          ${campaignStatus(campaign)}
                        </div>
                        <div class="campaign-card-body">
                          <h3>${escapeHtml(campaign.title)}</h3>
                          <p>/c/${escapeHtml(campaign.slug)}</p>
                          <div class="campaign-card-meta">
                            <span>Updated ${formatDate(campaign.updatedAt)}</span>
                            <a href="/campaigns/${encodeURIComponent(campaign.id)}/edit" data-link>Edit <span>→</span></a>
                          </div>
                        </div>
                      </article>
                    `,
                  )
                  .join('')}
               </div>`
            : `<div class="empty-state">
                <div class="empty-visual"><span>＋</span></div>
                <h3>Your next movement starts here.</h3>
                <p>Create a branded campaign page and share it with your community.</p>
                <a class="button button-primary" href="/campaigns/new" data-link>Create your first campaign</a>
               </div>`
        }
      </section>
    `,
  )
  bindLogout()
}

function formatDate(value) {
  return new Intl.DateTimeFormat(getLocale() === 'id' ? 'id-ID' : 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(
    new Date(value),
  )
}

function newCampaignPage() {
  const user = requireUser()
  if (!user) return
  setTitle('New campaign')

  if (user.tokenBalance < 1) {
    app.innerHTML = appShell(
      user,
      `
        <div class="narrow-page">
          <a class="back-link" href="/dashboard" data-link>← Back to dashboard</a>
          <div class="limit-card">
            <span class="limit-icon">◆</span>
            <h1>You’re out of campaign tokens.</h1>
            <p>Your existing campaigns are still fully editable. Token purchases are the next billing feature planned for this MVP.</p>
            <a class="button button-dark" href="/dashboard" data-link>Manage existing campaigns</a>
          </div>
        </div>
      `,
    )
    bindLogout()
    return
  }

  app.innerHTML = appShell(
    user,
    `
      <div class="narrow-page">
        <a class="back-link" href="/dashboard" data-link>← Back to dashboard</a>
        <div class="page-heading">
          <span class="eyebrow">New campaign</span>
          <h1>Give your campaign a name.</h1>
          <p>We’ll create a private draft. You can add your frame, message, and colors next.</p>
        </div>
        <div class="creation-layout">
          <form id="create-campaign-form" class="panel-card form-stack" novalidate>
            <label class="field">
              <span>Campaign title</span>
              <input id="campaign-title" name="title" type="text" placeholder="e.g. Green Week 2026" maxlength="80" required autofocus>
              <small>This is the headline visitors will see.</small>
            </label>
            <label class="field">
              <span>Campaign URL</span>
              <div class="slug-input">
                <span>/c/</span>
                <input id="campaign-slug" name="slug" type="text" placeholder="green-week-2026" maxlength="60" required>
              </div>
              <small>Lowercase letters, numbers, and hyphens.</small>
            </label>
            <p id="form-error" class="form-message form-message-error hidden" role="alert"></p>
            <button class="button button-primary button-full" type="submit">Create draft and continue <span>→</span></button>
          </form>
          <aside class="token-spend-card">
            <span class="token-gem">◆</span>
            <div>
              <span>Campaign creation</span>
              <strong>1 token</strong>
            </div>
            <hr>
            <p>You have <b>${user.tokenBalance} token${user.tokenBalance === 1 ? '' : 's'}</b>. Editing this campaign later is always free.</p>
          </aside>
        </div>
      </div>
    `,
  )
  bindLogout()

  const titleInput = document.querySelector('#campaign-title')
  const slugInput = document.querySelector('#campaign-slug')
  let slugWasEdited = false
  slugInput.addEventListener('input', () => {
    slugWasEdited = true
    slugInput.value = toSlug(slugInput.value)
  })
  titleInput.addEventListener('input', () => {
    if (!slugWasEdited) slugInput.value = toSlug(titleInput.value)
  })

  document.querySelector('#create-campaign-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const errorElement = form.querySelector('#form-error')
    const button = form.querySelector('button[type="submit"]')
    errorElement.classList.add('hidden')
    button.disabled = true
    button.textContent = translateText('Creating draft…')
    try {
      const campaign = dataService.createCampaign({
        userId: user.id,
        title: titleInput.value,
        slug: slugInput.value,
        description: translateText(
          'Add your photo, adjust the campaign frame, and download your result.',
        ),
      })
      showToast('Campaign created. 1 token used.')
      navigate(`/campaigns/${encodeURIComponent(campaign.id)}/edit`)
    } catch (error) {
      errorElement.textContent = translateText(error.message)
      errorElement.classList.remove('hidden')
      button.disabled = false
      button.textContent = `${translateText('Create draft and continue')} →`
    }
  })
}

function campaignEditorPage(campaignId) {
  const user = requireUser()
  if (!user) return
  const campaign = dataService.getCampaignForOwner(campaignId, user.id)
  if (!campaign) {
    notFoundPage('Campaign not found', 'This campaign does not exist or belongs to another account.')
    return
  }
  setTitle(`Edit ${campaign.title}`)

  app.innerHTML = appShell(
    user,
    `
      <div class="editor-page">
        <div class="editor-page-header">
          <div>
            <a class="back-link" href="/dashboard" data-link>← All campaigns</a>
            <div class="editor-title-row">
              <h1>Edit campaign</h1>
              ${campaignStatus(campaign)}
            </div>
          </div>
          <div class="editor-header-actions">
            <a class="button button-quiet" href="/c/${encodeURIComponent(campaign.slug)}" target="_blank" rel="noopener">Preview page ↗</a>
            <button class="button button-primary" id="save-campaign-top" type="button">Save changes</button>
          </div>
        </div>

        <form id="campaign-editor-form" class="campaign-editor-layout" novalidate>
          <div class="editor-settings">
            <section class="settings-card">
              <div class="settings-heading">
                <span class="settings-number">1</span>
                <div><h2>Campaign details</h2><p>Tell visitors what they’re joining.</p></div>
              </div>
              <div class="form-stack">
                <label class="field">
                  <span>Campaign title</span>
                  <input name="title" type="text" value="${escapeHtml(campaign.title)}" maxlength="80" required>
                </label>
                <label class="field">
                  <span>Description</span>
                  <textarea name="description" rows="4" maxlength="240" placeholder="Invite people to join your campaign.">${escapeHtml(campaign.description)}</textarea>
                  <small>Keep it short and action-oriented.</small>
                </label>
                <label class="field">
                  <span>Campaign URL</span>
                  <div class="slug-input"><span>/c/</span><input name="slug" type="text" value="${escapeHtml(campaign.slug)}" maxlength="60" required></div>
                </label>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-heading">
                <span class="settings-number">2</span>
                <div><h2>Campaign frame</h2><p>Use a transparent PNG for the best result.</p></div>
              </div>
              <div class="frame-upload-row">
                <div id="frame-thumbnail" class="frame-thumbnail">
                  <img src="${escapeHtml(campaign.frameAsset)}" alt="Current campaign frame">
                </div>
                <div>
                  <input id="frame-input" type="file" accept="image/png,image/webp" hidden>
                  <button id="frame-upload-button" class="button button-quiet" type="button">Upload new frame</button>
                  <p>PNG or WEBP · maximum 1 MB<br>Square, transparent artwork recommended.</p>
                </div>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-heading">
                <span class="settings-number">3</span>
                <div><h2>Page style</h2><p>Choose a simple look that fits the campaign.</p></div>
              </div>
              <div class="style-fields">
                <label class="field">
                  <span>Accent color</span>
                  <span class="color-field">
                    <input name="accent" type="color" value="${escapeHtml(campaign.theme.accent)}">
                    <output>${escapeHtml(campaign.theme.accent.toUpperCase())}</output>
                  </span>
                </label>
                <label class="field">
                  <span>Background</span>
                  <select name="background">
                    ${Object.entries(backgroundLabels)
                      .map(
                        ([value, label]) =>
                          `<option value="${value}" ${campaign.theme.background === value ? 'selected' : ''}>${label}</option>`,
                      )
                      .join('')}
                  </select>
                </label>
              </div>
            </section>

            <section class="settings-card publish-card">
              <div>
                <h2>Publish campaign</h2>
                <p>When published, anyone with the link can use this campaign page.</p>
              </div>
              <label class="switch">
                <input name="published" type="checkbox" ${campaign.published ? 'checked' : ''}>
                <span></span>
                <b>${campaign.published ? 'Published' : 'Draft'}</b>
              </label>
            </section>
            <p id="form-error" class="form-message form-message-error hidden" role="alert"></p>
            <button class="button button-primary button-full editor-mobile-save" type="submit">Save changes</button>
          </div>

          <aside class="live-preview-column">
            <div class="preview-label"><span>Live preview</span><small>Updates as you edit</small></div>
            <div id="campaign-page-preview" class="campaign-page-mini theme-${escapeHtml(campaign.theme.background)}" style="--campaign-accent:${escapeHtml(campaign.theme.accent)}">
              <span class="mini-brand">TWIBBONIZER</span>
              <h2>${escapeHtml(campaign.title)}</h2>
              <p>${escapeHtml(campaign.description)}</p>
              <div class="mini-editor">
                <img id="preview-frame" src="${escapeHtml(campaign.frameAsset)}" alt="">
                <span>Supporter photo</span>
              </div>
              <span class="mini-button">Choose a photo</span>
              <small>Photos stay on your device</small>
            </div>
          </aside>
        </form>
      </div>
    `,
  )
  bindLogout()

  const form = document.querySelector('#campaign-editor-form')
  const titleInput = form.elements.title
  const descriptionInput = form.elements.description
  const slugInput = form.elements.slug
  const accentInput = form.elements.accent
  const backgroundInput = form.elements.background
  const publishedInput = form.elements.published
  const preview = document.querySelector('#campaign-page-preview')
  const previewFrame = document.querySelector('#preview-frame')
  let frameAsset = campaign.frameAsset

  function updatePreview() {
    preview.querySelector('h2').textContent = titleInput.value || translateText('Campaign title')
    preview.querySelector('p').textContent =
      descriptionInput.value || translateText('Your campaign description')
    preview.style.setProperty('--campaign-accent', accentInput.value)
    preview.className = `campaign-page-mini theme-${backgroundInput.value}`
    accentInput.nextElementSibling.value = accentInput.value.toUpperCase()
    publishedInput.closest('.switch').querySelector('b').textContent = translateText(
      publishedInput.checked ? 'Published' : 'Draft',
    )
  }

  ;[titleInput, descriptionInput, accentInput, backgroundInput, publishedInput].forEach((element) =>
    element.addEventListener('input', updatePreview),
  )
  slugInput.addEventListener('input', () => {
    slugInput.value = toSlug(slugInput.value)
  })

  const frameInput = document.querySelector('#frame-input')
  document.querySelector('#frame-upload-button').addEventListener('click', () => frameInput.click())
  frameInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    if (!['image/png', 'image/webp'].includes(file.type)) {
      showToast('Please choose a PNG or WEBP frame.', 'error')
      return
    }
    if (file.size > localDataMeta.maxFrameBytes) {
      showToast('Frame images must be under 1 MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      frameAsset = reader.result
      document.querySelector('#frame-thumbnail img').src = frameAsset
      previewFrame.src = frameAsset
      showToast('Frame ready. Save to keep it.')
    }
    reader.onerror = () => {
      showToast('We could not read that frame image. Please choose another file.', 'error')
    }
    reader.readAsDataURL(file)
  })

  function saveCampaign(event) {
    event?.preventDefault()
    const errorElement = document.querySelector('#form-error')
    const buttons = [
      document.querySelector('#save-campaign-top'),
      form.querySelector('button[type="submit"]'),
    ]
    errorElement.classList.add('hidden')
    buttons.forEach((button) => {
      if (button) button.disabled = true
    })

    try {
      const updated = dataService.updateCampaign({
        campaignId: campaign.id,
        userId: user.id,
        changes: {
          title: titleInput.value,
          description: descriptionInput.value,
          slug: slugInput.value,
          frameAsset,
          theme: {
            accent: accentInput.value,
            background: backgroundInput.value,
          },
          published: publishedInput.checked,
        },
      })
      showToast(updated.published ? 'Campaign saved and published.' : 'Draft saved.')
      renderRoute()
    } catch (error) {
      errorElement.textContent = translateText(error.message)
      errorElement.classList.remove('hidden')
      buttons.forEach((button) => {
        if (button) button.disabled = false
      })
    }
  }

  form.addEventListener('submit', saveCampaign)
  document.querySelector('#save-campaign-top').addEventListener('click', saveCampaign)
}

function participantInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function supportersMarkup(campaign) {
  const participants = Array.isArray(campaign.participants) ? campaign.participants.slice(0, 6) : []
  const participantCount = campaign.participantCount || participants.length

  return `
    <section id="campaign-supporters" class="campaign-supporters" aria-label="People who joined">
      <div class="supporters-heading">
        <div>
          <span class="supporters-kicker">Community</span>
          <h2>People who joined</h2>
        </div>
        <strong>${participantCount} ${participantCount === 1 ? 'person' : 'people'} joined</strong>
      </div>
      ${
        participants.length
          ? `<ul class="supporters-list">
              ${participants
                .map(
                  (participant) => `
                    <li>
                      <span class="supporter-avatar" aria-hidden="true">${escapeHtml(participantInitials(participant.name))}</span>
                      <span data-no-i18n><b>${escapeHtml(participant.name)}</b><small>${formatDate(participant.joinedAt)}</small></span>
                    </li>
                  `,
                )
                .join('')}
             </ul>
             ${participantCount > participants.length ? `<p class="supporters-more">+${participantCount - participants.length} recent supporters</p>` : ''}`
          : `<p class="supporters-empty">Be the first to join this campaign.</p>`
      }
    </section>
  `
}

function renderSupporters(slug) {
  const latestCampaign = dataService.getPublishedCampaign(slug)
  const currentList = document.querySelector('#campaign-supporters')
  if (!latestCampaign || !currentList) return
  currentList.outerHTML = supportersMarkup(latestCampaign)
  localizePage(app)
}

function publicCampaignPage(slug) {
  const campaign = dataService.getPublishedCampaign(slug)
  if (!campaign) {
    notFoundPage(
      'Campaign unavailable',
      'This campaign is still a draft, has moved, or does not exist.',
    )
    return
  }

  setTitle(campaign.title)
  app.innerHTML = `
    <div class="public-campaign theme-${escapeHtml(campaign.theme.background)}" style="--campaign-accent:${escapeHtml(campaign.theme.accent)}">
      <header class="campaign-public-header">
        ${brand()}
        <div class="campaign-public-actions">
          ${languageSwitcher()}
          <a class="campaign-create-link" href="/register" data-link>Create your own campaign <span>→</span></a>
        </div>
      </header>
      <main class="campaign-public-main">
        <div class="campaign-content-column">
          <section class="campaign-intro">
            <span class="campaign-kicker">Join the campaign</span>
            <h1 data-no-i18n>${escapeHtml(campaign.title)}</h1>
            <p data-no-i18n>${escapeHtml(campaign.description)}</p>
            <div class="campaign-steps" aria-label="How it works">
              <span><b>1</b> Upload</span><i></i><span><b>2</b> Adjust</span><i></i><span><b>3</b> Download</span>
            </div>
          </section>
          ${supportersMarkup(campaign)}
        </div>
        <section class="campaign-tool-card">
          <label class="join-name-field">
            <span>Your name for the supporter list</span>
            <input id="supporter-name" type="text" maxlength="40" autocomplete="name" placeholder="Enter your name">
            <small>Your name will appear after your image is downloaded.</small>
          </label>
          <div id="twibbon-editor-root"></div>
          <p class="privacy-note"><span aria-hidden="true">⌁</span> Your photo is processed in your browser and never uploaded.</p>
        </section>
      </main>
      <footer class="campaign-footer">
        <span>Created with Twibbonizer</span>
        <a href="/register" data-link>Launch your campaign</a>
      </footer>
    </div>
  `

  const supporterNameInput = document.querySelector('#supporter-name')
  let supporterRecorded = false
  destroyCurrentView = createTwibbonEditor(document.querySelector('#twibbon-editor-root'), {
    frameAsset: campaign.frameAsset,
    campaignTitle: campaign.title,
    accent: campaign.theme.accent,
    beforeDownload: () => {
      const name = supporterNameInput.value.trim()
      if (name.length < 2) {
        showToast('Please enter your name before downloading.', 'error')
        supporterNameInput.focus()
        return false
      }
      return { name }
    },
    onDownloadSuccess: ({ name }) => {
      if (supporterRecorded) return
      dataService.addCampaignParticipant({ campaignId: campaign.id, name })
      supporterRecorded = true
      supporterNameInput.disabled = true
      renderSupporters(campaign.slug)
      showToast('You joined the campaign!')
    },
  })
}

function notFoundPage(title = 'Page not found', message = 'The page you requested does not exist.') {
  setTitle(title)
  app.innerHTML = `
    <div class="not-found-page">
      ${publicHeader()}
      <main>
        <span class="not-found-code">404</span>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        <a class="button button-primary" href="/" data-link>Back to home</a>
      </main>
    </div>
  `
}

function renderRoute() {
  if (destroyCurrentView) {
    destroyCurrentView()
    destroyCurrentView = null
  }

  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const publicCampaignMatch = path.match(/^\/c\/([^/]+)$/)
  const editCampaignMatch = path.match(/^\/campaigns\/([^/]+)\/edit$/)

  if (path === '/') landingPage()
  else if (path === '/login') authPage('login')
  else if (path === '/register') authPage('register')
  else if (path === '/dashboard') dashboardPage()
  else if (path === '/campaigns/new') newCampaignPage()
  else if (editCampaignMatch) campaignEditorPage(decodeURIComponent(editCampaignMatch[1]))
  else if (publicCampaignMatch) publicCampaignPage(decodeURIComponent(publicCampaignMatch[1]))
  else notFoundPage()

  localizePage(app)
}

document.addEventListener('click', (event) => {
  const localeButton = event.target.closest('[data-locale]')
  if (localeButton) {
    setLocale(localeButton.dataset.locale)
    renderRoute()
    return
  }

  const link = event.target.closest('a[data-link]')
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || link.target === '_blank') return
  const url = new URL(link.href, window.location.origin)
  if (url.origin !== window.location.origin) return
  event.preventDefault()
  if (link.getAttribute('aria-disabled') === 'true') {
    showToast('You need a campaign token to create another campaign.', 'info')
    return
  }
  navigate(`${url.pathname}${url.search}${url.hash}`)
})

window.addEventListener('popstate', renderRoute)
renderRoute()
