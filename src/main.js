import './style.css'

// ─── Analytics Helper ──────────────────────────────────────────
function trackEvent(name, params = {}) {
  if (typeof gtag !== 'undefined') gtag('event', name, params)
}

// ─── DOM References ────────────────────────────────────────────
const uploadZone = document.getElementById('upload-zone')
const photoInput = document.getElementById('photo-input')
const editorSection = document.getElementById('editor-section')
const editorContainer = document.getElementById('editor-container')
const twibbonWrapper = document.getElementById('twibbon-wrapper')
const twibbonImg = document.getElementById('twibbon-img')
const twibbonLabel = document.getElementById('twibbon-label')
const changeTwibbonBtn = document.getElementById('change-twibbon-btn')
const twibbonInput = document.getElementById('twibbon-input')
const downloadBtn = document.getElementById('download-btn')
const handles = document.querySelectorAll('.resize-handle')
const changePhotoBtn = document.getElementById('change-photo-btn')
const shapeControls = document.getElementById('shape-controls')
const shapeOptions = shapeControls.querySelectorAll('[data-shape]')

const state = {
  photoDataURL: null,
  twibbonAspectRatio: 1,
  twibbon: { x: 0, y: 0, width: 0, height: 0 },
  shape: 'circle',
  drag: { active: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 },
  resize: { active: false, corner: null, startX: 0, startY: 0, startW: 0, startH: 0, startLeft: 0, startTop: 0 }
}

// ─── Helpers ───────────────────────────────────────────────────
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ─── Twibbon Positioning ───────────────────────────────────────
function initTwibbonPosition() {
  const editorW = editorContainer.offsetWidth
  const editorH = editorContainer.offsetHeight
  state.twibbon.width = editorW
  state.twibbon.height = editorH
  state.twibbon.x = 0
  state.twibbon.y = 0
  applyTwibbonTransform()
}

function applyTwibbonTransform() {
  twibbonWrapper.style.left = state.twibbon.x + 'px'
  twibbonWrapper.style.top = state.twibbon.y + 'px'
  twibbonWrapper.style.width = state.twibbon.width + 'px'
  twibbonWrapper.style.height = state.twibbon.height + 'px'
  applyShape()
}

function getCircleInEditorCoords() {
  const cx = state.twibbon.x + state.twibbon.width / 2
  const cy = state.twibbon.y + state.twibbon.height / 2
  const r = Math.min(state.twibbon.width, state.twibbon.height) / 2
  return { cx, cy, r }
}

function applyShape() {
  if (state.shape === 'circle') {
    const { cx, cy, r } = getCircleInEditorCoords()
    editorContainer.style.clipPath = `circle(${r}px at ${cx}px ${cy}px)`
  } else {
    editorContainer.style.clipPath = ''
  }
  shapeOptions.forEach(btn => {
    btn.setAttribute('aria-checked', btn.dataset.shape === state.shape ? 'true' : 'false')
  })
}

// ─── Apply Photo ───────────────────────────────────────────────
function applyPhoto(dataURL, keepTwibbon = false) {
  state.photoDataURL = dataURL
  editorContainer.style.backgroundImage = `url(${dataURL})`
  uploadZone.classList.add('hidden')
  editorSection.classList.remove('hidden')
  downloadBtn.disabled = false
  if (!keepTwibbon) {
    initTwibbonPosition()
  } else {
    applyTwibbonTransform()
  }
}

// ─── Photo Upload (Click) ──────────────────────────────────────
uploadZone.addEventListener('click', () => photoInput.click())

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    applyPhoto(reader.result, false)
    trackEvent('photo_uploaded', { method: 'click' })
  }
  reader.readAsDataURL(file)
})

// ─── Photo Upload (Drag & Drop) ────────────────────────────────
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault()
  uploadZone.classList.add('border-blue-500', 'bg-blue-50')
})

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('border-blue-500', 'bg-blue-50')
})

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault()
  uploadZone.classList.remove('border-blue-500', 'bg-blue-50')
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    applyPhoto(reader.result, false)
    trackEvent('photo_uploaded', { method: 'drag_drop' })
  }
  reader.readAsDataURL(file)
})

// ─── Keyboard Upload (Accessibility) ───────────────────────────
uploadZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    photoInput.click()
  }
})

// ─── Change Photo Button ───────────────────────────────────────
changePhotoBtn.addEventListener('click', () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      applyPhoto(reader.result, true)
      trackEvent('photo_changed', { method: 'click' })
    }
    reader.readAsDataURL(file)
  })
  input.click()
})

// ─── Drag & Drop on Editor (re-upload) ────────────────────────
editorContainer.addEventListener('dragover', (e) => {
  e.preventDefault()
  editorContainer.classList.add('ring-2', 'ring-blue-400')
})

editorContainer.addEventListener('dragleave', () => {
  editorContainer.classList.remove('ring-2', 'ring-blue-400')
})

editorContainer.addEventListener('drop', (e) => {
  e.preventDefault()
  editorContainer.classList.remove('ring-2', 'ring-blue-400')
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    applyPhoto(reader.result, true)
    trackEvent('photo_changed', { method: 'drag_drop' })
  }
  reader.readAsDataURL(file)
})

// ─── Twibbon Default Load & Change ─────────────────────────────
function loadDefaultTwibbon() {
  twibbonImg.src = '/twibbon.png'
  twibbonImg.onload = () => {
    state.twibbonAspectRatio = twibbonImg.naturalWidth / twibbonImg.naturalHeight
    initTwibbonPosition()
  }
}

changeTwibbonBtn.addEventListener('click', () => twibbonInput.click())

twibbonInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    twibbonImg.src = reader.result
    twibbonImg.onload = () => {
      state.twibbonAspectRatio = twibbonImg.naturalWidth / twibbonImg.naturalHeight
      twibbonLabel.textContent = 'Using custom twibbon'
      trackEvent('twibbon_changed')
      initTwibbonPosition()
    }
  }
  reader.readAsDataURL(file)
})

shapeControls.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-shape]')
  if (!btn) return
  const next = btn.dataset.shape
  if (next === state.shape) return
  state.shape = next
  applyShape()
  trackEvent('crop_shape_changed', { shape: next })
})

shapeControls.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
  e.preventDefault()
  const order = ['circle', 'rectangle']
  const idx = order.indexOf(state.shape)
  const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1
  const next = order[(idx + dir + order.length) % order.length]
  state.shape = next
  applyShape()
  const nextBtn = shapeControls.querySelector(`[data-shape="${next}"]`)
  if (nextBtn) nextBtn.focus()
  trackEvent('crop_shape_changed', { shape: next, via: 'keyboard' })
})

// ─── Drag Logic ────────────────────────────────────────────────
twibbonWrapper.addEventListener('pointerdown', (e) => {
  if (e.target.classList.contains('resize-handle')) return
  state.drag.active = true
  state.drag.startX = e.clientX
  state.drag.startY = e.clientY
  state.drag.startLeft = state.twibbon.x
  state.drag.startTop = state.twibbon.y
  twibbonWrapper.setPointerCapture(e.pointerId)
  twibbonWrapper.classList.add('dragging')
})

document.addEventListener('pointermove', (e) => {
  if (state.drag.active) {
    const editorW = editorContainer.offsetWidth
    const editorH = editorContainer.offsetHeight
    const dx = e.clientX - state.drag.startX
    const dy = e.clientY - state.drag.startY
    state.twibbon.x = clamp(state.drag.startLeft + dx, -state.twibbon.width + 20, editorW - 20)
    state.twibbon.y = clamp(state.drag.startTop + dy, -state.twibbon.height + 20, editorH - 20)
    applyTwibbonTransform()
  }
  if (state.resize.active) {
    handleResize(e)
  }
})

document.addEventListener('pointerup', () => {
  state.drag.active = false
  state.resize.active = false
  twibbonWrapper.classList.remove('dragging')
})

// ─── Resize Logic ──────────────────────────────────────────────
handles.forEach(handle => {
  handle.addEventListener('pointerdown', (e) => {
    e.stopPropagation()
    state.resize.active = true
    state.resize.corner = handle.dataset.corner
    state.resize.startX = e.clientX
    state.resize.startY = e.clientY
    state.resize.startW = state.twibbon.width
    state.resize.startH = state.twibbon.height
    state.resize.startLeft = state.twibbon.x
    state.resize.startTop = state.twibbon.y
    handle.setPointerCapture(e.pointerId)
  })
})

function handleResize(e) {
  const editorW = editorContainer.offsetWidth
  const editorH = editorContainer.offsetHeight
  const dx = e.clientX - state.resize.startX
  const dy = e.clientY - state.resize.startY

  let newW = state.resize.startW
  let newH = state.resize.startH
  let newX = state.resize.startLeft
  let newY = state.resize.startTop

  const corner = state.resize.corner

  if (corner === 'se' || corner === 'ne') {
    newW = state.resize.startW + dx
  } else {
    newW = state.resize.startW - dx
  }

  newW = clamp(newW, 60, editorW)
  newH = newW / state.twibbonAspectRatio
  if (newH < 60 || newH > editorH) {
    newH = clamp(newH, 60, editorH)
    newW = clamp(newH * state.twibbonAspectRatio, 60, editorW)
  }

  if (corner === 'nw' || corner === 'sw') {
    newX = state.resize.startLeft + (state.resize.startW - newW)
  }
  if (corner === 'nw' || corner === 'ne') {
    newY = state.resize.startTop + (state.resize.startH - newH)
  }

  state.twibbon.width = newW
  state.twibbon.height = newH
  state.twibbon.x = newX
  state.twibbon.y = newY
  applyTwibbonTransform()
}

// ─── Canvas Export & Download ──────────────────────────────────
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true
  downloadBtn.textContent = 'Processing...'
  try {
    const photoImg = await loadImage(state.photoDataURL)
    const twibbonData = await loadImage(twibbonImg.src)
    const natW = photoImg.naturalWidth
    const natH = photoImg.naturalHeight
    const canvasSize = Math.min(natW, natH)

    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')

    const scale = canvasSize / Math.min(natW, natH)
    const scaledW = natW * scale
    const scaledH = natH * scale
    const offsetX = (canvasSize - scaledW) / 2
    const offsetY = (canvasSize - scaledH) / 2
    ctx.drawImage(photoImg, offsetX, offsetY, scaledW, scaledH)

    const editorW = editorContainer.offsetWidth
    const pixelRatio = canvasSize / editorW
    const tX = state.twibbon.x * pixelRatio
    const tY = state.twibbon.y * pixelRatio
    const tW = state.twibbon.width * pixelRatio
    const tH = state.twibbon.height * pixelRatio

    ctx.drawImage(twibbonData, tX, tY, tW, tH)

    let cropCanvas
    if (state.shape === 'circle') {
      const { cx, cy, r } = getCircleInEditorCoords()
      const radiusPx = r * pixelRatio
      const centerXCanvas = cx * pixelRatio
      const centerYCanvas = cy * pixelRatio
      const size = radiusPx * 2
      cropCanvas = document.createElement('canvas')
      cropCanvas.width = size
      cropCanvas.height = size
      const cropCtx = cropCanvas.getContext('2d')
      cropCtx.drawImage(
        canvas,
        centerXCanvas - radiusPx,
        centerYCanvas - radiusPx,
        size,
        size,
        0,
        0,
        size,
        size
      )
      cropCtx.save()
      cropCtx.globalCompositeOperation = 'destination-in'
      cropCtx.beginPath()
      cropCtx.arc(radiusPx, radiusPx, radiusPx, 0, Math.PI * 2)
      cropCtx.fill()
      cropCtx.restore()
    } else {
      cropCanvas = document.createElement('canvas')
      cropCanvas.width = tW
      cropCanvas.height = tH
      const cropCtx = cropCanvas.getContext('2d')
      cropCtx.drawImage(canvas, tX, tY, tW, tH, 0, 0, tW, tH)
    }

    const link = document.createElement('a')
    link.download = 'twibbonized.png'
    link.href = cropCanvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    link.remove()

    trackEvent('image_downloaded', { shape: state.shape })

    downloadBtn.textContent = 'Download Image'
  } catch (err) {
    console.error('Download failed:', err)
    downloadBtn.textContent = 'Download failed'
  } finally {
    downloadBtn.disabled = false
  }
})

// ─── Window Resize Handler (Group 5 – Task 25) ─────────────────
let resizeTimeout
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const editorW = editorContainer.offsetWidth
    const editorH = editorContainer.offsetHeight
    state.twibbon.width = Math.min(state.twibbon.width, editorW)
    state.twibbon.height = state.twibbon.width / state.twibbonAspectRatio
    state.twibbon.x = clamp(state.twibbon.x, -state.twibbon.width + 20, editorW - 20)
    state.twibbon.y = clamp(state.twibbon.y, -state.twibbon.height + 20, editorH - 20)
    applyTwibbonTransform()
  }, 100)
})

// ─── Init ──────────────────────────────────────────────────────
loadDefaultTwibbon()
