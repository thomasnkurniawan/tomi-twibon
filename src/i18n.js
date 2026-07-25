const LOCALE_KEY = 'twibbonizer.locale.v1'
const SUPPORTED_LOCALES = ['en', 'id']

const idTranslations = {
  'Twibbonizer home': 'Beranda Twibbonizer',
  'Main navigation': 'Navigasi utama',
  Dashboard: 'Dasbor',
  'Log in': 'Masuk',
  'Start free': 'Mulai gratis',
  'Campaign tokens': 'Token kampanye',
  'Log out': 'Keluar',
  'You are logged out.': 'Anda telah keluar.',
  'Campaign pages, ready in minutes': 'Halaman kampanye, siap dalam hitungan menit',
  'Turn every supporter into your campaign’s': 'Jadikan setiap pendukung sebagai',
  'loudest voice.': 'suara terkuat kampanye Anda.',
  'Create a branded photo-frame campaign, share one link, and let your community make polished campaign photos from any device.':
    'Buat kampanye bingkai foto bermerek, bagikan satu tautan, dan biarkan komunitas Anda membuat foto kampanye dari perangkat apa pun.',
  'Create your first campaign': 'Buat kampanye pertama',
  'See how it works': 'Lihat cara kerjanya',
  '2 free campaign tokens': '2 token kampanye gratis',
  'No card required': 'Tanpa kartu kredit',
  'Campaign page product preview': 'Pratinjau produk halaman kampanye',
  'I’m taking a stand for a greener tomorrow.': 'Saya bergerak untuk masa depan yang lebih hijau.',
  'Join thousands of neighbors building cleaner, kinder cities.':
    'Bergabung bersama ribuan warga membangun kota yang lebih bersih dan ramah.',
  'Upload your photo': 'Unggah foto Anda',
  'supporter downloads': 'unduhan pendukung',
  'Made for campaigns that move people': 'Dibuat untuk kampanye yang menggerakkan banyak orang',
  'Campaign types': 'Jenis kampanye',
  COMMUNITIES: 'KOMUNITAS',
  EVENTS: 'ACARA',
  NONPROFITS: 'ORGANISASI',
  CREATORS: 'KREATOR',
  CAUSES: 'GERAKAN',
  'Simple by design': 'Sederhana sejak awal',
  'From idea to shareable': 'Dari ide hingga siap dibagikan',
  'in three small steps.': 'dalam tiga langkah mudah.',
  'No design team, code, or complicated setup needed.':
    'Tanpa tim desain, coding, atau pengaturan yang rumit.',
  'Build your campaign': 'Bangun kampanye Anda',
  'Add a title, message, frame, and colors that feel like your brand.':
    'Tambahkan judul, pesan, bingkai, dan warna yang sesuai dengan identitas Anda.',
  'Publish one link': 'Terbitkan satu tautan',
  'Share your campaign page anywhere your community already gathers.':
    'Bagikan halaman kampanye di mana pun komunitas Anda berkumpul.',
  'Watch it spread': 'Lihat gerakannya menyebar',
  'Supporters create and download their own campaign-ready photos.':
    'Pendukung membuat dan mengunduh foto kampanye mereka sendiri.',
  'Built for momentum': 'Dibuat untuk membangun momentum',
  'Your campaign. Their photo. One unmistakable movement.':
    'Kampanye Anda. Foto mereka. Satu gerakan yang tak terlupakan.',
  'Every supporter gets a polished result without uploading their photo to a server. Their image stays on their device from start to finish.':
    'Setiap pendukung mendapat hasil profesional tanpa mengunggah foto ke server. Foto tetap berada di perangkat mereka dari awal hingga akhir.',
  'Private, browser-based image processing': 'Pemrosesan gambar privat di browser',
  'Mobile-friendly crop and positioning': 'Pemotongan dan posisi yang ramah seluler',
  'Downloads optimized for sharing': 'Unduhan siap untuk dibagikan',
  'Downloaded ✓': 'Terunduh ✓',
  'Your first two are on us': 'Dua kampanye pertama gratis',
  'A stronger campaign can start today.': 'Kampanye yang lebih kuat bisa dimulai hari ini.',
  'Register free, create two campaigns, and see what your community makes.':
    'Daftar gratis, buat dua kampanye, dan lihat karya komunitas Anda.',
  'Get 2 free tokens': 'Dapatkan 2 token gratis',
  'Campaign frames made simple.': 'Bingkai kampanye dibuat lebih mudah.',
  'Back to home': 'Kembali ke beranda',
  'Start for free': 'Mulai gratis',
  'Welcome back': 'Selamat datang kembali',
  'Welcome back.': 'Selamat datang kembali.',
  'Create your campaign studio.': 'Buat studio kampanye Anda.',
  'Continue building momentum.': 'Lanjutkan membangun momentum.',
  'Your account includes 2 free campaign tokens.': 'Akun Anda mendapat 2 token kampanye gratis.',
  'Log in to manage your campaigns and tokens.': 'Masuk untuk mengelola kampanye dan token.',
  'Full name': 'Nama lengkap',
  'Your name': 'Nama Anda',
  'Email address': 'Alamat email',
  Password: 'Kata sandi',
  'At least 8 characters': 'Minimal 8 karakter',
  'Your password': 'Kata sandi Anda',
  'Create free account': 'Buat akun gratis',
  'Already have an account?': 'Sudah punya akun?',
  'New to Twibbonizer?': 'Baru di Twibbonizer?',
  'Create an account': 'Buat akun',
  'MVP note: this account is stored only in this browser.':
    'Catatan MVP: akun ini hanya tersimpan di browser ini.',
  'It should take minutes to give a movement a face.':
    'Hanya perlu beberapa menit untuk memberi wajah pada sebuah gerakan.',
  'Twibbonizer keeps setup simple so you can focus on the message that matters.':
    'Twibbonizer menyederhanakan proses agar Anda fokus pada pesan yang penting.',
  '2 campaign tokens': '2 token kampanye',
  'included with every new account': 'tersedia untuk setiap akun baru',
  'Creating account…': 'Membuat akun…',
  'Logging in…': 'Sedang masuk…',
  'Welcome! Your 2 free campaign tokens are ready.':
    'Selamat datang! 2 token kampanye gratis Anda sudah siap.',
  'Log in to continue.': 'Masuk untuk melanjutkan.',
  Live: 'Aktif',
  Draft: 'Draf',
  Published: 'Diterbitkan',
  'Campaign studio': 'Studio kampanye',
  'Make something your community will be proud to share.':
    'Buat sesuatu yang akan dibagikan komunitas Anda dengan bangga.',
  'New campaign': 'Kampanye baru',
  'Account overview': 'Ringkasan akun',
  'Campaign tokens available': 'Token kampanye tersedia',
  'Campaign token available': 'Token kampanye tersedia',
  '1 token creates 1 campaign': '1 token untuk 1 kampanye',
  'Total campaigns': 'Total kampanye',
  'Total campaign': 'Total kampanye',
  'Drafts and published': 'Draf dan diterbitkan',
  'Published campaigns': 'Kampanye diterbitkan',
  'Published campaign': 'Kampanye diterbitkan',
  'Currently public': 'Saat ini publik',
  'Your campaigns': 'Kampanye Anda',
  'Manage, publish, and share your campaign pages.':
    'Kelola, terbitkan, dan bagikan halaman kampanye Anda.',
  Edit: 'Edit',
  'Your next movement starts here.': 'Gerakan berikutnya dimulai di sini.',
  'Create a branded campaign page and share it with your community.':
    'Buat halaman kampanye bermerek dan bagikan ke komunitas Anda.',
  Updated: 'Diperbarui',
  '← Back to home': '← Kembali ke beranda',
  '← Back to dashboard': '← Kembali ke dasbor',
  '← All campaigns': '← Semua kampanye',
  'Back to dashboard': 'Kembali ke dasbor',
  'You’re out of campaign tokens.': 'Token kampanye Anda habis.',
  'Your existing campaigns are still fully editable. Token purchases are the next billing feature planned for this MVP.':
    'Kampanye yang ada tetap dapat diedit. Pembelian token adalah fitur pembayaran berikutnya untuk MVP ini.',
  'Manage existing campaigns': 'Kelola kampanye yang ada',
  'Give your campaign a name.': 'Beri nama kampanye Anda.',
  'We’ll create a private draft. You can add your frame, message, and colors next.':
    'Kami akan membuat draf privat. Selanjutnya tambahkan bingkai, pesan, dan warna.',
  'Campaign title': 'Judul kampanye',
  'This is the headline visitors will see.': 'Ini adalah judul yang akan dilihat pengunjung.',
  'Campaign URL': 'URL kampanye',
  'Lowercase letters, numbers, and hyphens.': 'Gunakan huruf kecil, angka, dan tanda hubung.',
  'Create draft and continue': 'Buat draf dan lanjutkan',
  'Campaign creation': 'Pembuatan kampanye',
  '1 token': '1 token',
  'Editing this campaign later is always free.': 'Mengedit kampanye ini selanjutnya selalu gratis.',
  '. Editing this campaign later is always free.':
    '. Mengedit kampanye ini selanjutnya selalu gratis.',
  'You have': 'Anda memiliki',
  'Creating draft…': 'Membuat draf…',
  'Campaign created. 1 token used.': 'Kampanye dibuat. 1 token digunakan.',
  'Campaign not found': 'Kampanye tidak ditemukan',
  'This campaign does not exist or belongs to another account.':
    'Kampanye ini tidak ada atau dimiliki akun lain.',
  'All campaigns': 'Semua kampanye',
  'Edit campaign': 'Edit kampanye',
  'Preview page': 'Pratinjau halaman',
  'Preview page ↗': 'Pratinjau halaman ↗',
  'Save changes': 'Simpan perubahan',
  'Campaign details': 'Detail kampanye',
  'Tell visitors what they’re joining.': 'Jelaskan gerakan yang akan diikuti pengunjung.',
  Description: 'Deskripsi',
  'Invite people to join your campaign.': 'Ajak orang bergabung dengan kampanye Anda.',
  'Keep it short and action-oriented.': 'Buat singkat dan berorientasi pada aksi.',
  'Campaign frame': 'Bingkai kampanye',
  'Use a transparent PNG for the best result.': 'Gunakan PNG transparan untuk hasil terbaik.',
  'Current campaign frame': 'Bingkai kampanye saat ini',
  'Upload new frame': 'Unggah bingkai baru',
  'Square, transparent artwork recommended.': 'Disarankan gambar persegi transparan.',
  'Page style': 'Gaya halaman',
  'Choose a simple look that fits the campaign.': 'Pilih tampilan sederhana yang sesuai kampanye.',
  'Accent color': 'Warna aksen',
  Background: 'Latar belakang',
  'Soft mist': 'Kabut lembut',
  'Warm paper': 'Kertas hangat',
  Midnight: 'Tengah malam',
  'Publish campaign': 'Terbitkan kampanye',
  'When published, anyone with the link can use this campaign page.':
    'Setelah diterbitkan, siapa pun dengan tautan dapat menggunakan halaman ini.',
  'Live preview': 'Pratinjau langsung',
  'Updates as you edit': 'Diperbarui saat Anda mengedit',
  'Supporter photo': 'Foto pendukung',
  'Your campaign description': 'Deskripsi kampanye Anda',
  'Add your photo, adjust the campaign frame, and download your result.':
    'Tambahkan foto, atur bingkai kampanye, lalu unduh hasilnya.',
  'Choose a photo': 'Pilih foto',
  'Photos stay on your device': 'Foto tetap berada di perangkat Anda',
  'Please choose a PNG or WEBP frame.': 'Pilih bingkai PNG atau WEBP.',
  'PNG or WEBP · maximum 1 MB': 'PNG atau WEBP · maksimum 1 MB',
  'Frame images must be under 1 MB.': 'Ukuran bingkai harus di bawah 1 MB.',
  'Frame ready. Save to keep it.': 'Bingkai siap. Simpan untuk mempertahankannya.',
  'We could not read that frame image. Please choose another file.':
    'Bingkai tidak dapat dibaca. Silakan pilih file lain.',
  'Campaign saved and published.': 'Kampanye disimpan dan diterbitkan.',
  'Draft saved.': 'Draf disimpan.',
  'Create your own campaign': 'Buat kampanye Anda sendiri',
  'Join the campaign': 'Gabung kampanye',
  'How it works': 'Cara kerja',
  Upload: 'Unggah',
  Adjust: 'Atur',
  Download: 'Unduh',
  'Your name for the supporter list': 'Nama Anda untuk daftar pendukung',
  'Enter your name': 'Masukkan nama Anda',
  'Your name will appear after your image is downloaded.':
    'Nama Anda akan muncul setelah gambar berhasil diunduh.',
  'People who joined': 'Orang yang sudah bergabung',
  Community: 'Komunitas',
  'Be the first to join this campaign.': 'Jadilah orang pertama yang bergabung.',
  'recent supporters': 'pendukung terbaru',
  'joined this campaign': 'telah bergabung',
  'Your photo is processed in your browser and never uploaded.':
    'Foto diproses di browser dan tidak pernah diunggah.',
  'Created with Twibbonizer': 'Dibuat dengan Twibbonizer',
  'Launch your campaign': 'Luncurkan kampanye Anda',
  'Please enter your name before downloading.': 'Masukkan nama Anda sebelum mengunduh.',
  'You joined the campaign!': 'Anda telah bergabung dengan kampanye!',
  'YOUR CAUSE': 'GERAKAN ANDA',
  'OUR CITY': 'KOTA KITA',
  'OUR FUTURE': 'MASA DEPAN KITA',
  'I’M WITH': 'SAYA BERSAMA',
  'THE MOVEMENT': 'GERAKAN INI',
  'Campaign unavailable': 'Kampanye tidak tersedia',
  'This campaign is still a draft, has moved, or does not exist.':
    'Kampanye ini masih berupa draf, telah dipindahkan, atau tidak ada.',
  'Page not found': 'Halaman tidak ditemukan',
  'The page you requested does not exist.': 'Halaman yang Anda cari tidak tersedia.',
  'Back to home': 'Kembali ke beranda',
  'Upload your photo': 'Unggah foto Anda',
  'Drop your photo here': 'Letakkan foto Anda di sini',
  'or click to browse · JPG, PNG, or WEBP': 'atau klik untuk memilih · JPG, PNG, atau WEBP',
  'Square photos work best · minimum 400 × 400 px':
    'Foto persegi memberikan hasil terbaik · minimum 400 × 400 px',
  'Photo and campaign frame preview': 'Pratinjau foto dan bingkai kampanye',
  'Change photo': 'Ganti foto',
  'Campaign frame applied': 'Bingkai kampanye diterapkan',
  'Change frame': 'Ganti bingkai',
  'Crop shape': 'Bentuk potongan',
  'Download shape': 'Bentuk unduhan',
  Circle: 'Lingkaran',
  Square: 'Persegi',
  'Download image': 'Unduh gambar',
  'No file selected.': 'Tidak ada file yang dipilih.',
  'Please upload a JPG, PNG, or WEBP image.': 'Unggah gambar JPG, PNG, atau WEBP.',
  'We could not read that image. Please choose another JPG, PNG, or WEBP file.':
    'Gambar tidak dapat dibaca. Silakan pilih file JPG, PNG, atau WEBP lain.',
  'That file is too large. Please use an image under 15 MB.':
    'Ukuran file terlalu besar. Gunakan gambar di bawah 15 MB.',
  'Image is too small. Please use a photo at least 400 × 400 px.':
    'Gambar terlalu kecil. Gunakan foto minimal 400 × 400 px.',
  'Custom frame applied': 'Bingkai khusus diterapkan',
  'Preparing image…': 'Menyiapkan gambar…',
  'We could not prepare the download. Please try another image.':
    'Unduhan tidak dapat disiapkan. Coba gunakan gambar lain.',
  'You need a campaign token to create another campaign.':
    'Anda memerlukan token untuk membuat kampanye baru.',
  'Enter your full name.': 'Masukkan nama lengkap Anda.',
  'Enter a valid email address.': 'Masukkan alamat email yang valid.',
  'Password must be at least 8 characters.': 'Kata sandi minimal 8 karakter.',
  'An account with this email already exists.': 'Akun dengan email ini sudah ada.',
  'Email or password is incorrect.': 'Email atau kata sandi salah.',
  'Your session has expired. Please log in again.': 'Sesi Anda berakhir. Silakan masuk kembali.',
  'You need a campaign token to create a new campaign.':
    'Anda memerlukan token untuk membuat kampanye baru.',
  'Campaign title must be at least 3 characters.': 'Judul kampanye minimal 3 karakter.',
  'Campaign URL must be at least 3 characters.': 'URL kampanye minimal 3 karakter.',
  'That campaign URL is already in use.': 'URL kampanye tersebut sudah digunakan.',
  'Local storage is full. Try a smaller frame image (under 1 MB).':
    'Penyimpanan lokal penuh. Gunakan bingkai yang lebih kecil (di bawah 1 MB).',
  'We could not save your changes on this device.':
    'Perubahan tidak dapat disimpan di perangkat ini.',
}

function detectInitialLocale() {
  const stored = localStorage.getItem(LOCALE_KEY)
  if (SUPPORTED_LOCALES.includes(stored)) return stored
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

let currentLocale = detectInitialLocale()

export function getLocale() {
  return currentLocale
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  currentLocale = locale
  localStorage.setItem(LOCALE_KEY, locale)
  document.documentElement.lang = locale
}

export function translateText(value) {
  const text = String(value ?? '')
  if (currentLocale === 'en') return text
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return text
  if (idTranslations[normalized]) return idTranslations[normalized]

  let match = normalized.match(/^Good (morning|afternoon|evening), (.+)\.$/)
  if (match) {
    const greeting = {
      morning: 'Selamat pagi',
      afternoon: 'Selamat siang',
      evening: 'Selamat malam',
    }[match[1]]
    return `${greeting}, ${match[2]}.`
  }

  match = normalized.match(/^Updated (.+)$/)
  if (match) return `Diperbarui ${match[1]}`

  match = normalized.match(/^(\d+) tokens?$/)
  if (match) return `${match[1]} token`

  match = normalized.match(/^(\d+) Campaign tokens? available$/i)
  if (match) return `${match[1]} token kampanye tersedia`

  match = normalized.match(/^(\d+) Total campaigns?$/i)
  if (match) return `${match[1]} total kampanye`

  match = normalized.match(/^(\d+) Published campaigns?$/i)
  if (match) return `${match[1]} kampanye diterbitkan`

  match = normalized.match(/^You have (\d+) tokens?\. Editing this campaign later is always free\.$/)
  if (match) return `Anda memiliki ${match[1]} token. Mengedit kampanye ini selanjutnya selalu gratis.`

  match = normalized.match(/^(\d+) people joined$/)
  if (match) return `${match[1]} orang bergabung`

  match = normalized.match(/^(\d+) person joined$/)
  if (match) return `${match[1]} orang bergabung`

  match = normalized.match(/^\+(\d+) recent supporters$/)
  if (match) return `+${match[1]} pendukung terbaru`

  match = normalized.match(/^(.+) campaign frame$/)
  if (match) return `Bingkai kampanye ${match[1]}`

  return text
}

export function localizePage(root = document) {
  document.documentElement.lang = currentLocale
  if (currentLocale === 'en') return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  nodes.forEach((node) => {
    if (node.parentElement?.closest('[data-no-i18n]')) return
    const raw = node.nodeValue
    const trimmed = raw.trim()
    if (!trimmed) return
    const translated = translateText(trimmed)
    if (translated === trimmed) return
    const leading = raw.match(/^\s*/)?.[0] || ''
    const trailing = raw.match(/\s*$/)?.[0] || ''
    node.nodeValue = `${leading}${translated}${trailing}`
  })

  root.querySelectorAll?.('[placeholder], [aria-label], [title], [alt]').forEach((element) => {
    ;['placeholder', 'aria-label', 'title', 'alt'].forEach((attribute) => {
      if (!element.hasAttribute(attribute) || element.closest('[data-no-i18n]')) return
      element.setAttribute(attribute, translateText(element.getAttribute(attribute)))
    })
  })
}

export function languageSwitcher() {
  return `
    <div class="language-switcher" aria-label="${currentLocale === 'id' ? 'Pilih bahasa' : 'Choose language'}">
      <button type="button" data-locale="id" class="${currentLocale === 'id' ? 'is-active' : ''}" aria-pressed="${currentLocale === 'id'}">ID</button>
      <button type="button" data-locale="en" class="${currentLocale === 'en' ? 'is-active' : ''}" aria-pressed="${currentLocale === 'en'}">EN</button>
    </div>
  `
}
