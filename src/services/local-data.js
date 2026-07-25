const STORAGE_KEY = 'twibbonizer.mvp.v1'
const SESSION_KEY = 'twibbonizer.session.v1'
const FREE_CAMPAIGN_TOKENS = 2
const DEFAULT_FRAME_ASSET = '/default-frame.png'
const MAX_FRAME_BYTES = 1024 * 1024

function createEmptyDatabase() {
  return {
    users: [],
    campaigns: [],
  }
}

function readDatabase() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return createEmptyDatabase()
    const parsed = JSON.parse(value)
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      campaigns: Array.isArray(parsed.campaigns)
        ? parsed.campaigns.map((campaign) => {
            const participants = Array.isArray(campaign.participants) ? campaign.participants : []
            return {
              ...campaign,
              frameAsset:
                !campaign.frameAsset || campaign.frameAsset === '/twibbon.png'
                  ? DEFAULT_FRAME_ASSET
                  : campaign.frameAsset,
              participants,
              participantCount: Number.isFinite(campaign.participantCount)
                ? campaign.participantCount
                : participants.length,
            }
          })
        : [],
    }
  } catch {
    return createEmptyDatabase()
  }
}

function writeDatabase(database) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Local storage is full. Try a smaller frame image (under 1 MB).')
    }
    throw new Error('We could not save your changes on this device.')
  }
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

function writeSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function makeId(prefix) {
  if (crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function publicUser(user) {
  if (!user) return null
  const { passwordHash: _passwordHash, ...safeUser } = user
  return { ...safeUser }
}

export const dataService = {
  async register({ name, email, password }) {
    const cleanName = String(name || '').trim()
    const cleanEmail = normalizeEmail(email)

    if (cleanName.length < 2) throw new Error('Enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid email address.')
    if (String(password || '').length < 8) throw new Error('Password must be at least 8 characters.')

    const database = readDatabase()
    if (database.users.some((user) => user.email === cleanEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const now = new Date().toISOString()
    const user = {
      id: makeId('user'),
      name: cleanName,
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      tokenBalance: FREE_CAMPAIGN_TOKENS,
      createdAt: now,
      updatedAt: now,
    }

    database.users.push(user)
    writeDatabase(database)
    writeSession({ userId: user.id, createdAt: now })
    return publicUser(user)
  },

  async login({ email, password }) {
    const database = readDatabase()
    const user = database.users.find((item) => item.email === normalizeEmail(email))
    const passwordHash = await hashPassword(String(password || ''))

    if (!user || user.passwordHash !== passwordHash) {
      throw new Error('Email or password is incorrect.')
    }

    writeSession({ userId: user.id, createdAt: new Date().toISOString() })
    return publicUser(user)
  },

  logout() {
    writeSession(null)
  },

  getCurrentUser() {
    const session = readSession()
    if (!session?.userId) return null
    const user = readDatabase().users.find((item) => item.id === session.userId)
    if (!user) {
      writeSession(null)
      return null
    }
    return publicUser(user)
  },

  listCampaigns(userId) {
    return readDatabase()
      .campaigns
      .filter((campaign) => campaign.userId === userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },

  getCampaignForOwner(campaignId, userId) {
    return (
      readDatabase().campaigns.find(
        (campaign) => campaign.id === campaignId && campaign.userId === userId,
      ) || null
    )
  },

  getPublishedCampaign(slug) {
    return (
      readDatabase().campaigns.find(
        (campaign) => campaign.slug === toSlug(slug) && campaign.published,
      ) || null
    )
  },

  isSlugAvailable(slug, exceptCampaignId = null) {
    const cleanSlug = toSlug(slug)
    if (!cleanSlug) return false
    return !readDatabase().campaigns.some(
      (campaign) => campaign.slug === cleanSlug && campaign.id !== exceptCampaignId,
    )
  },

  createCampaign({ userId, title, slug, description }) {
    const database = readDatabase()
    const user = database.users.find((item) => item.id === userId)
    if (!user) throw new Error('Your session has expired. Please log in again.')
    if (user.tokenBalance < 1) throw new Error('You need a campaign token to create a new campaign.')

    const cleanTitle = String(title || '').trim()
    const cleanSlug = toSlug(slug || cleanTitle)
    if (cleanTitle.length < 3) throw new Error('Campaign title must be at least 3 characters.')
    if (cleanSlug.length < 3) throw new Error('Campaign URL must be at least 3 characters.')
    if (database.campaigns.some((campaign) => campaign.slug === cleanSlug)) {
      throw new Error('That campaign URL is already in use.')
    }

    const now = new Date().toISOString()
    const campaign = {
      id: makeId('campaign'),
      userId,
      title: cleanTitle,
      slug: cleanSlug,
      description:
        String(description || '').trim() ||
        'Add your photo, adjust the campaign frame, and download your result.',
      frameAsset: DEFAULT_FRAME_ASSET,
      theme: {
        accent: '#2563eb',
        background: 'mist',
      },
      published: false,
      participants: [],
      participantCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    user.tokenBalance -= 1
    user.updatedAt = now
    database.campaigns.push(campaign)
    writeDatabase(database)
    return campaign
  },

  updateCampaign({ campaignId, userId, changes }) {
    const database = readDatabase()
    const campaign = database.campaigns.find(
      (item) => item.id === campaignId && item.userId === userId,
    )
    if (!campaign) throw new Error('Campaign not found.')

    const cleanTitle = String(changes.title || '').trim()
    const cleanSlug = toSlug(changes.slug)
    if (cleanTitle.length < 3) throw new Error('Campaign title must be at least 3 characters.')
    if (cleanSlug.length < 3) throw new Error('Campaign URL must be at least 3 characters.')
    if (
      database.campaigns.some(
        (item) => item.slug === cleanSlug && item.id !== campaign.id,
      )
    ) {
      throw new Error('That campaign URL is already in use.')
    }

    Object.assign(campaign, {
      title: cleanTitle,
      slug: cleanSlug,
      description: String(changes.description || '').trim(),
      frameAsset: changes.frameAsset || DEFAULT_FRAME_ASSET,
      theme: {
        accent: changes.theme?.accent || '#2563eb',
        background: changes.theme?.background || 'mist',
      },
      published: Boolean(changes.published),
      updatedAt: new Date().toISOString(),
    })

    writeDatabase(database)
    return campaign
  },

  addCampaignParticipant({ campaignId, name }) {
    const cleanName = String(name || '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40)
    if (cleanName.length < 2) throw new Error('Please enter your name before downloading.')

    const database = readDatabase()
    const campaign = database.campaigns.find(
      (item) => item.id === campaignId && item.published,
    )
    if (!campaign) throw new Error('Campaign unavailable')

    const participant = {
      id: makeId('participant'),
      name: cleanName,
      joinedAt: new Date().toISOString(),
    }
    campaign.participants = [participant, ...(campaign.participants || [])].slice(0, 50)
    campaign.participantCount = (campaign.participantCount || 0) + 1
    writeDatabase(database)
    return participant
  },
}

export const localDataMeta = {
  freeCampaignTokens: FREE_CAMPAIGN_TOKENS,
  storageKey: STORAGE_KEY,
  defaultFrameAsset: DEFAULT_FRAME_ASSET,
  maxFrameBytes: MAX_FRAME_BYTES,
}
