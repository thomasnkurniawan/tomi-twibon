import { translateText } from './i18n.js'

function editorMarkup({ allowFrameChange, campaignTitle }) {
  return `
    <div class="twibbon-tool">
      <div id="upload-zone" class="upload-zone" tabindex="0" role="button" aria-label="Upload your photo">
        <div class="upload-icon" aria-hidden="true">↑</div>
        <p class="upload-title">Drop your photo here</p>
        <p class="upload-subtitle">or click to browse · JPG, PNG, or WEBP</p>
        <p class="upload-meta">Square photos work best · minimum 400 × 400 px</p>
        <input type="file" id="photo-input" accept="image/jpeg,image/png,image/webp" hidden>
        <p id="upload-error" class="field-error hidden" role="alert"></p>
      </div>

      <div id="editor-section" class="editor-section hidden">
        <div id="editor-container" class="editor-canvas" aria-label="Photo and campaign frame preview">
          <div id="twibbon-wrapper" class="twibbon-wrapper">
            <img id="twibbon-img" class="twibbon-image" draggable="false" alt="${campaignTitle} campaign frame">
            <span class="resize-handle resize-nw" data-corner="nw"></span>
            <span class="resize-handle resize-ne" data-corner="ne"></span>
            <span class="resize-handle resize-sw" data-corner="sw"></span>
            <span class="resize-handle resize-se" data-corner="se"></span>
          </div>
        </div>

        <div class="editor-toolbar">
          <button id="change-photo-btn" class="button button-quiet button-small" type="button">Change photo</button>
          <span id="twibbon-label" class="editor-status">Campaign frame applied</span>
          ${
            allowFrameChange
              ? `<button id="change-twibbon-btn" class="button button-quiet button-small" type="button">Change frame</button>
                 <input type="file" id="twibbon-input" accept="image/*" hidden>`
              : ''
          }
        </div>

        <div id="shape-controls" class="shape-controls" role="radiogroup" aria-label="Crop shape">
          <span>Download shape</span>
          <div class="segmented-control">
            <button type="button" role="radio" data-shape="circle" aria-checked="true">Circle</button>
            <button type="button" role="radio" data-shape="rectangle" aria-checked="false">Square</button>
          </div>
        </div>

        <button id="download-btn" disabled class="button button-primary download-button" type="button">
          Download image
        </button>
      </div>
    </div>
  `
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params)
}

export function createTwibbonEditor(
  root,
  {
    frameAsset = '/default-frame.png',
    campaignTitle = 'Campaign',
    allowFrameChange = false,
    accent = '#2563eb',
    beforeDownload,
    onDownloadSuccess,
  } = {},
) {
  root.innerHTML = editorMarkup({ allowFrameChange, campaignTitle })
  root.style.setProperty('--campaign-accent', accent)

  const uploadZone = root.querySelector('#upload-zone')
  const photoInput = root.querySelector('#photo-input')
  const uploadError = root.querySelector('#upload-error')
  const editorSection = root.querySelector('#editor-section')
  const editorContainer = root.querySelector('#editor-container')
  const twibbonWrapper = root.querySelector('#twibbon-wrapper')
  const twibbonImg = root.querySelector('#twibbon-img')
  const twibbonLabel = root.querySelector('#twibbon-label')
  const changeTwibbonBtn = root.querySelector('#change-twibbon-btn')
  const twibbonInput = root.querySelector('#twibbon-input')
  const downloadBtn = root.querySelector('#download-btn')
  const handles = root.querySelectorAll('.resize-handle')
  const changePhotoBtn = root.querySelector('#change-photo-btn')
  const shapeControls = root.querySelector('#shape-controls')
  const shapeOptions = shapeControls.querySelectorAll('[data-shape]')

  const state = {
    photoDataURL: null,
    twibbonAspectRatio: 1,
    twibbon: { x: 0, y: 0, width: 0, height: 0 },
    shape: 'circle',
    drag: { active: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 },
    resize: {
      active: false,
      corner: null,
      startX: 0,
      startY: 0,
      startW: 0,
      startH: 0,
      startLeft: 0,
      startTop: 0,
    },
  }

  function showUploadError(message) {
    uploadError.textContent = translateText(message)
    uploadError.classList.remove('hidden')
    clearTimeout(showUploadError.timeout)
    showUploadError.timeout = setTimeout(() => uploadError.classList.add('hidden'), 4000)
  }

  function validateImageFile(file) {
    if (!file) return 'No file selected.'
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Please upload a JPG, PNG, or WEBP image.'
    }
    if (file.size > 15 * 1024 * 1024) return 'That file is too large. Please use an image under 15 MB.'
    return null
  }

  function getCircleInEditorCoords() {
    const cx = state.twibbon.x + state.twibbon.width / 2
    const cy = state.twibbon.y + state.twibbon.height / 2
    const radius = Math.min(state.twibbon.width, state.twibbon.height) / 2
    return { cx, cy, radius }
  }

  function applyShape() {
    if (state.shape === 'circle') {
      const { cx, cy, radius } = getCircleInEditorCoords()
      editorContainer.style.clipPath = `circle(${radius}px at ${cx}px ${cy}px)`
    } else {
      editorContainer.style.clipPath = ''
    }
    shapeOptions.forEach((button) => {
      button.setAttribute('aria-checked', button.dataset.shape === state.shape ? 'true' : 'false')
    })
  }

  function applyTwibbonTransform() {
    twibbonWrapper.style.left = `${state.twibbon.x}px`
    twibbonWrapper.style.top = `${state.twibbon.y}px`
    twibbonWrapper.style.width = `${state.twibbon.width}px`
    twibbonWrapper.style.height = `${state.twibbon.height}px`
    applyShape()
  }

  function initTwibbonPosition() {
    const editorWidth = editorContainer.offsetWidth
    const editorHeight = editorContainer.offsetHeight
    state.twibbon.width = editorWidth
    state.twibbon.height = editorHeight
    state.twibbon.x = 0
    state.twibbon.y = 0
    applyTwibbonTransform()
  }

  async function applyPhoto(dataURL, keepTwibbon = false) {
    const image = await loadImage(dataURL)
    if (image.naturalWidth < 400 || image.naturalHeight < 400) {
      showUploadError('Image is too small. Please use a photo at least 400 × 400 px.')
      return false
    }
    state.photoDataURL = dataURL
    editorContainer.style.backgroundImage = `url("${dataURL}")`
    uploadZone.classList.add('hidden')
    editorSection.classList.remove('hidden')
    downloadBtn.disabled = false
    if (keepTwibbon) applyTwibbonTransform()
    else initTwibbonPosition()
    return true
  }

  function readPhotoFile(file, keepTwibbon, method) {
    const error = validateImageFile(file)
    if (error) {
      showUploadError(error)
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const applied = await applyPhoto(reader.result, keepTwibbon)
        if (applied) trackEvent(keepTwibbon ? 'photo_changed' : 'photo_uploaded', { method })
      } catch {
        showUploadError('We could not read that image. Please choose another JPG, PNG, or WEBP file.')
      }
    }
    reader.onerror = () => {
      showUploadError('We could not read that image. Please choose another JPG, PNG, or WEBP file.')
    }
    reader.readAsDataURL(file)
  }

  uploadZone.addEventListener('click', () => photoInput.click())
  uploadZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      photoInput.click()
    }
  })
  uploadZone.addEventListener('dragover', (event) => {
    event.preventDefault()
    uploadZone.classList.add('is-dragging')
  })
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('is-dragging'))
  uploadZone.addEventListener('drop', (event) => {
    event.preventDefault()
    uploadZone.classList.remove('is-dragging')
    readPhotoFile(event.dataTransfer.files[0], false, 'drag_drop')
  })
  photoInput.addEventListener('change', (event) => {
    readPhotoFile(event.target.files[0], false, 'click')
    event.target.value = ''
  })

  changePhotoBtn.addEventListener('click', () => photoInput.click())
  editorContainer.addEventListener('dragover', (event) => {
    event.preventDefault()
    editorContainer.classList.add('is-dragging')
  })
  editorContainer.addEventListener('dragleave', () => editorContainer.classList.remove('is-dragging'))
  editorContainer.addEventListener('drop', (event) => {
    event.preventDefault()
    editorContainer.classList.remove('is-dragging')
    readPhotoFile(event.dataTransfer.files[0], true, 'drag_drop')
  })

  if (changeTwibbonBtn && twibbonInput) {
    changeTwibbonBtn.addEventListener('click', () => twibbonInput.click())
    twibbonInput.addEventListener('change', (event) => {
      const file = event.target.files[0]
      if (!file || !file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        twibbonImg.src = reader.result
        twibbonImg.onload = () => {
          state.twibbonAspectRatio = twibbonImg.naturalWidth / twibbonImg.naturalHeight
          twibbonLabel.textContent = translateText('Custom frame applied')
          trackEvent('twibbon_changed')
          initTwibbonPosition()
        }
      }
      reader.readAsDataURL(file)
    })
  }

  shapeControls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-shape]')
    if (!button || button.dataset.shape === state.shape) return
    state.shape = button.dataset.shape
    applyShape()
    trackEvent('crop_shape_changed', { shape: state.shape })
  })
  shapeControls.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const order = ['circle', 'rectangle']
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
    const next = order[(order.indexOf(state.shape) + direction + order.length) % order.length]
    state.shape = next
    applyShape()
    shapeControls.querySelector(`[data-shape="${next}"]`)?.focus()
  })

  twibbonWrapper.addEventListener('pointerdown', (event) => {
    if (event.target.classList.contains('resize-handle')) return
    Object.assign(state.drag, {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: state.twibbon.x,
      startTop: state.twibbon.y,
    })
    twibbonWrapper.setPointerCapture(event.pointerId)
    twibbonWrapper.classList.add('dragging')
  })

  handles.forEach((handle) => {
    handle.addEventListener('pointerdown', (event) => {
      event.stopPropagation()
      Object.assign(state.resize, {
        active: true,
        corner: handle.dataset.corner,
        startX: event.clientX,
        startY: event.clientY,
        startW: state.twibbon.width,
        startH: state.twibbon.height,
        startLeft: state.twibbon.x,
        startTop: state.twibbon.y,
      })
      handle.setPointerCapture(event.pointerId)
    })
  })

  function handleResize(event) {
    const editorWidth = editorContainer.offsetWidth
    const editorHeight = editorContainer.offsetHeight
    const dx = event.clientX - state.resize.startX
    const corner = state.resize.corner
    let width =
      corner === 'se' || corner === 'ne'
        ? state.resize.startW + dx
        : state.resize.startW - dx

    width = clamp(width, 60, editorWidth)
    let height = width / state.twibbonAspectRatio
    if (height < 60 || height > editorHeight) {
      height = clamp(height, 60, editorHeight)
      width = clamp(height * state.twibbonAspectRatio, 60, editorWidth)
    }

    state.twibbon.width = width
    state.twibbon.height = height
    state.twibbon.x =
      corner === 'nw' || corner === 'sw'
        ? state.resize.startLeft + (state.resize.startW - width)
        : state.resize.startLeft
    state.twibbon.y =
      corner === 'nw' || corner === 'ne'
        ? state.resize.startTop + (state.resize.startH - height)
        : state.resize.startTop
    applyTwibbonTransform()
  }

  function onPointerMove(event) {
    if (state.drag.active) {
      const editorWidth = editorContainer.offsetWidth
      const editorHeight = editorContainer.offsetHeight
      state.twibbon.x = clamp(
        state.drag.startLeft + event.clientX - state.drag.startX,
        -state.twibbon.width + 20,
        editorWidth - 20,
      )
      state.twibbon.y = clamp(
        state.drag.startTop + event.clientY - state.drag.startY,
        -state.twibbon.height + 20,
        editorHeight - 20,
      )
      applyTwibbonTransform()
    }
    if (state.resize.active) handleResize(event)
  }

  function onPointerUp() {
    state.drag.active = false
    state.resize.active = false
    twibbonWrapper.classList.remove('dragging')
  }

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)

  downloadBtn.addEventListener('click', async () => {
    let downloadContext = true
    if (beforeDownload) {
      downloadContext = await beforeDownload()
      if (!downloadContext) return
    }

    downloadBtn.disabled = true
    downloadBtn.textContent = translateText('Preparing image…')
    try {
      const photoImage = await loadImage(state.photoDataURL)
      const twibbonData = await loadImage(twibbonImg.src)
      const naturalWidth = photoImage.naturalWidth
      const naturalHeight = photoImage.naturalHeight
      const canvasSize = Math.min(naturalWidth, naturalHeight, 2048)
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize
      canvas.height = canvasSize
      const context = canvas.getContext('2d')

      const scale = canvasSize / Math.min(naturalWidth, naturalHeight)
      const scaledWidth = naturalWidth * scale
      const scaledHeight = naturalHeight * scale
      context.drawImage(
        photoImage,
        (canvasSize - scaledWidth) / 2,
        (canvasSize - scaledHeight) / 2,
        scaledWidth,
        scaledHeight,
      )

      const pixelRatio = canvasSize / editorContainer.offsetWidth
      const twibbonX = state.twibbon.x * pixelRatio
      const twibbonY = state.twibbon.y * pixelRatio
      const twibbonWidth = state.twibbon.width * pixelRatio
      const twibbonHeight = state.twibbon.height * pixelRatio
      context.drawImage(twibbonData, twibbonX, twibbonY, twibbonWidth, twibbonHeight)

      let cropCanvas
      if (state.shape === 'circle') {
        const { cx, cy, radius } = getCircleInEditorCoords()
        const radiusPixels = radius * pixelRatio
        const size = radiusPixels * 2
        cropCanvas = document.createElement('canvas')
        cropCanvas.width = size
        cropCanvas.height = size
        const cropContext = cropCanvas.getContext('2d')
        cropContext.drawImage(
          canvas,
          cx * pixelRatio - radiusPixels,
          cy * pixelRatio - radiusPixels,
          size,
          size,
          0,
          0,
          size,
          size,
        )
        cropContext.globalCompositeOperation = 'destination-in'
        cropContext.beginPath()
        cropContext.arc(radiusPixels, radiusPixels, radiusPixels, 0, Math.PI * 2)
        cropContext.fill()
      } else {
        cropCanvas = document.createElement('canvas')
        cropCanvas.width = twibbonWidth
        cropCanvas.height = twibbonHeight
        cropCanvas
          .getContext('2d')
          .drawImage(
            canvas,
            twibbonX,
            twibbonY,
            twibbonWidth,
            twibbonHeight,
            0,
            0,
            twibbonWidth,
            twibbonHeight,
          )
      }

      let quality = 0.92
      let dataURL
      for (;;) {
        dataURL = cropCanvas.toDataURL('image/jpeg', quality)
        const bytes = atob(dataURL.split(',')[1]).length
        if (bytes <= 1048576 || quality <= 0.6) break
        quality -= 0.05
      }

      const link = document.createElement('a')
      link.download = `${campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'campaign'}-photo.jpg`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      link.remove()
      trackEvent('image_downloaded', { shape: state.shape })
      if (onDownloadSuccess) await onDownloadSuccess(downloadContext)
    } catch (error) {
      console.error('Download failed:', error)
      showUploadError('We could not prepare the download. Please try another image.')
    } finally {
      downloadBtn.disabled = false
      downloadBtn.textContent = translateText('Download image')
    }
  })

  let resizeTimeout
  function onWindowResize() {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const editorWidth = editorContainer.offsetWidth
      const editorHeight = editorContainer.offsetHeight
      state.twibbon.width = Math.min(state.twibbon.width, editorWidth)
      state.twibbon.height = state.twibbon.width / state.twibbonAspectRatio
      state.twibbon.x = clamp(state.twibbon.x, -state.twibbon.width + 20, editorWidth - 20)
      state.twibbon.y = clamp(state.twibbon.y, -state.twibbon.height + 20, editorHeight - 20)
      applyTwibbonTransform()
    }, 100)
  }
  window.addEventListener('resize', onWindowResize)

  twibbonImg.src = frameAsset
  twibbonImg.onload = () => {
    state.twibbonAspectRatio = twibbonImg.naturalWidth / twibbonImg.naturalHeight
    initTwibbonPosition()
  }
  twibbonImg.onerror = () => {
    twibbonImg.src = '/default-frame.png'
  }

  return () => {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('resize', onWindowResize)
    clearTimeout(resizeTimeout)
  }
}
