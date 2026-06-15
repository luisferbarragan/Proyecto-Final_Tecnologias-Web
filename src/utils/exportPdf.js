import { jsPDF } from 'jspdf'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 40
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const ACCENT_COLOR = [37, 99, 235]
const TEXT_COLOR = [28, 34, 48]
const MUTED_COLOR = [94, 104, 121]
const BORDER_COLOR = [224, 229, 238]
const CARD_FILL = [249, 250, 255]

function normalizeText(value, fallback = '') {
  return String(value ?? '').trim() || fallback
}

function normalizeUrl(value) {
  const text = normalizeText(value)
  return text ? text.replace(/^https?:\/\//i, '').replace(/^www\./i, '') : ''
}

function formatDisplayUrl(value, maxLength = 42) {
  const text = normalizeUrl(value)

  if (!text) {
    return 'No registrado'
  }

  if (text.length <= maxLength) {
    return text
  }

  const parts = text.split('/')

  if (parts.length >= 3) {
    const head = `${parts[0]}/${parts[1]}`
    const tail = parts.at(-1)

    if (head.length + tail.length + 7 <= maxLength) {
      return `${head}/.../${tail}`
    }
  }

  return `${text.slice(0, maxLength - 3)}...`
}

async function imageToDataUrl(imageSource) {
  if (!imageSource) {
    return null
  }

  if (imageSource.startsWith('data:')) {
    return imageSource
  }

  const response = await fetch(imageSource)
  const blob = await response.blob()

  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.readAsDataURL(blob)
  })
}

async function loadImageElement(source) {
  return await new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo cargar la imagen.'))
    image.src = source
  })
}

async function prepareProfileImage(imageSource) {
  const dataUrl = await imageToDataUrl(imageSource)

  if (!dataUrl || typeof document === 'undefined') {
    return dataUrl
  }

  const image = await loadImageElement(dataUrl)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return dataUrl
  }

  const size = 900
  canvas.width = size
  canvas.height = size

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, size, size)

  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const offsetX = (size - drawWidth) / 2
  const offsetY = (size - drawHeight) / 2

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

  return canvas.toDataURL('image/jpeg', 0.92)
}

function addHeader(doc, pageNumber) {
  doc.setFillColor(...ACCENT_COLOR)
  doc.rect(0, 0, PAGE_WIDTH, 16, 'F')

  doc.setTextColor(...MUTED_COLOR)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('DevProfile', MARGIN, 28)
  doc.text(`Pagina ${pageNumber}`, PAGE_WIDTH - MARGIN, 28, { align: 'right' })

  doc.setTextColor(...TEXT_COLOR)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Curriculum Vitae', MARGIN, 46)

  doc.setDrawColor(...BORDER_COLOR)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, 54, PAGE_WIDTH - MARGIN, 54)
}

function addPage(doc) {
  doc.addPage()
  addHeader(doc, doc.getNumberOfPages())
}

function ensureSpace(doc, cursorY, neededHeight) {
  if (cursorY + neededHeight <= PAGE_HEIGHT - MARGIN) {
    return cursorY
  }

  addPage(doc)
  return 72
}

function splitText(doc, value, width, fallback = '') {
  return doc.splitTextToSize(normalizeText(value, fallback), width)
}

function measureLines(lines, lineHeight) {
  return Math.max(lines.length, 1) * lineHeight
}

function drawLines(doc, lines, x, y, options = {}) {
  const {
    fontSize = 11,
    lineHeight = 14,
    fontStyle = 'normal',
    color = TEXT_COLOR,
  } = options

  doc.setTextColor(...color)
  doc.setFont('helvetica', fontStyle)
  doc.setFontSize(fontSize)
  doc.text(lines, x, y)

  return y + measureLines(lines, lineHeight)
}

function drawSectionTitle(doc, title, y) {
  doc.setTextColor(...ACCENT_COLOR)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(title, MARGIN, y)

  doc.setDrawColor(...BORDER_COLOR)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, y + 4, PAGE_WIDTH - MARGIN, y + 4)

  return y + 18
}

function drawCard(doc, x, y, width, height) {
  doc.setDrawColor(...BORDER_COLOR)
  doc.setFillColor(...CARD_FILL)
  doc.roundedRect(x, y, width, height, 10, 10, 'FD')
}

function buildContactItem(doc, item, width) {
  const isLink = Boolean(item.href)
  const text = isLink
    ? formatDisplayUrl(item.value)
    : normalizeText(item.value, 'No registrado')
  const lines = splitText(doc, text, width)

  return {
    ...item,
    isLink,
    lines,
    height: 12 + measureLines(lines, 12) + 12,
  }
}

function drawContactItem(doc, item, x, y, width) {
  doc.setTextColor(...MUTED_COLOR)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.8)
  doc.text(item.label.toUpperCase(), x, y)

  const color = item.isLink && normalizeText(item.value) ? ACCENT_COLOR : TEXT_COLOR
  const style = item.isLink && normalizeText(item.value) ? 'bold' : 'normal'
  const nextY = drawLines(doc, item.lines, x, y + 14, {
    fontSize: 10.5,
    lineHeight: 12,
    fontStyle: style,
    color,
  })

  if (item.isLink && normalizeText(item.href)) {
    doc.link(x, y + 4, width, measureLines(item.lines, 12) + 8, {
      url: item.href,
    })
  }

  return nextY + 10
}

function buildSkillBlock(doc, skill, index) {
  const data = typeof skill === 'string' ? { name: skill } : skill || {}
  const width = CONTENT_WIDTH - 24
  const titleLines = splitText(
    doc,
    `${index + 1}. ${normalizeText(data.name || data.skill, 'Habilidad')}`,
    width,
  )

  const metaParts = []
  if (normalizeText(data.category)) metaParts.push(`Categoria: ${normalizeText(data.category)}`)
  if (normalizeText(data.level)) metaParts.push(`Nivel: ${normalizeText(data.level)}`)

  const metaLines = metaParts.length > 0 ? splitText(doc, metaParts.join(' | '), width) : []
  const descriptionLines = normalizeText(data.description)
    ? splitText(doc, data.description, width)
    : []

  let height = 18 + measureLines(titleLines, 13)

  if (metaLines.length > 0) {
    height += measureLines(metaLines, 11) + 4
  }

  if (descriptionLines.length > 0) {
    height += measureLines(descriptionLines, 12) + 6
  }

  height += 12

  return {
    titleLines,
    metaLines,
    descriptionLines,
    height,
  }
}

function drawSkillBlock(doc, block, y) {
  drawCard(doc, MARGIN, y - 8, CONTENT_WIDTH, block.height)

  let blockY = y + 6
  blockY = drawLines(doc, block.titleLines, MARGIN + 12, blockY, {
    fontSize: 11.5,
    lineHeight: 13,
    fontStyle: 'bold',
  })

  if (block.metaLines.length > 0) {
    blockY = drawLines(doc, block.metaLines, MARGIN + 12, blockY + 2, {
      fontSize: 9.6,
      lineHeight: 11,
      fontStyle: 'bold',
      color: ACCENT_COLOR,
    })
  }

  if (block.descriptionLines.length > 0) {
    drawLines(doc, block.descriptionLines, MARGIN + 12, blockY + 3, {
      fontSize: 10.4,
      lineHeight: 12,
    })
  }

  return y + block.height + 8
}

function buildProjectBlock(doc, project) {
  const data = project || {}
  const width = CONTENT_WIDTH - 24
  const titleLines = splitText(doc, normalizeText(data.name, 'Proyecto'), width)
  const descriptionLines = normalizeText(data.description)
    ? splitText(doc, data.description, width)
    : []
  const technologiesLines = normalizeText(data.technologies)
    ? splitText(doc, `Tecnologias: ${normalizeText(data.technologies)}`, width)
    : []
  const repositoryLines = normalizeText(data.repository)
    ? splitText(doc, `Repositorio: ${formatDisplayUrl(data.repository)}`, width)
    : []
  const deployLines = normalizeText(data.deploy)
    ? splitText(doc, `Demo: ${formatDisplayUrl(data.deploy)}`, width)
    : []

  let height = 18 + measureLines(titleLines, 13)

  if (descriptionLines.length > 0) {
    height += measureLines(descriptionLines, 12) + 5
  }

  if (technologiesLines.length > 0) {
    height += measureLines(technologiesLines, 11) + 4
  }

  if (repositoryLines.length > 0) {
    height += measureLines(repositoryLines, 11) + 4
  }

  if (deployLines.length > 0) {
    height += measureLines(deployLines, 11) + 4
  }

  height += 12

  return {
    titleLines,
    descriptionLines,
    technologiesLines,
    repositoryLines,
    deployLines,
    repository: normalizeText(data.repository),
    deploy: normalizeText(data.deploy),
    height,
  }
}

function drawLinkBlock(doc, lines, url, x, y) {
  const nextY = drawLines(doc, lines, x, y, {
    fontSize: 10,
    lineHeight: 11,
    fontStyle: 'bold',
    color: ACCENT_COLOR,
  })

  doc.link(x, y - 8, CONTENT_WIDTH - 24, measureLines(lines, 11) + 6, { url })
  return nextY
}

function drawProjectBlock(doc, block, y) {
  drawCard(doc, MARGIN, y - 8, CONTENT_WIDTH, block.height)

  let blockY = y + 6
  blockY = drawLines(doc, block.titleLines, MARGIN + 12, blockY, {
    fontSize: 11.5,
    lineHeight: 13,
    fontStyle: 'bold',
  })

  if (block.descriptionLines.length > 0) {
    blockY = drawLines(doc, block.descriptionLines, MARGIN + 12, blockY + 3, {
      fontSize: 10.4,
      lineHeight: 12,
    })
  }

  if (block.technologiesLines.length > 0) {
    blockY = drawLines(doc, block.technologiesLines, MARGIN + 12, blockY + 2, {
      fontSize: 9.8,
      lineHeight: 11,
      fontStyle: 'bold',
      color: MUTED_COLOR,
    })
  }

  if (block.repositoryLines.length > 0) {
    blockY = drawLinkBlock(doc, block.repositoryLines, block.repository, MARGIN + 12, blockY + 3)
  }

  if (block.deployLines.length > 0) {
    drawLinkBlock(doc, block.deployLines, block.deploy, MARGIN + 12, blockY + 3)
  }

  return y + block.height + 8
}

function buildEducationBlock(doc, entry) {
  const data = typeof entry === 'string' ? { program: entry } : entry || {}
  const width = CONTENT_WIDTH - 24
  const titleLines = splitText(doc, normalizeText(data.program, 'Programa'), width)
  const institutionLines = normalizeText(data.institution)
    ? splitText(doc, normalizeText(data.institution), width)
    : []
  const periodLines = normalizeText(data.period)
    ? splitText(doc, normalizeText(data.period), width)
    : []
  const descriptionLines = normalizeText(data.description)
    ? splitText(doc, normalizeText(data.description), width)
    : []

  let height = 18 + measureLines(titleLines, 13)

  if (institutionLines.length > 0) {
    height += measureLines(institutionLines, 12) + 3
  }

  if (periodLines.length > 0) {
    height += measureLines(periodLines, 11) + 3
  }

  if (descriptionLines.length > 0) {
    height += measureLines(descriptionLines, 12) + 5
  }

  height += 12

  return {
    titleLines,
    institutionLines,
    periodLines,
    descriptionLines,
    height,
  }
}

function drawEducationBlock(doc, block, y) {
  drawCard(doc, MARGIN, y - 8, CONTENT_WIDTH, block.height)

  let blockY = y + 6
  blockY = drawLines(doc, block.titleLines, MARGIN + 12, blockY, {
    fontSize: 11.5,
    lineHeight: 13,
    fontStyle: 'bold',
  })

  if (block.institutionLines.length > 0) {
    blockY = drawLines(doc, block.institutionLines, MARGIN + 12, blockY + 3, {
      fontSize: 10.4,
      lineHeight: 12,
    })
  }

  if (block.periodLines.length > 0) {
    blockY = drawLines(doc, block.periodLines, MARGIN + 12, blockY + 2, {
      fontSize: 9.8,
      lineHeight: 11,
      fontStyle: 'bold',
      color: MUTED_COLOR,
    })
  }

  if (block.descriptionLines.length > 0) {
    drawLines(doc, block.descriptionLines, MARGIN + 12, blockY + 3, {
      fontSize: 10.4,
      lineHeight: 12,
    })
  }

  return y + block.height + 8
}

export async function exportCvToPdf(cvData, fileName = 'cv-devprofile.pdf') {
  const {
    personalInfo = {},
    skills = [],
    projects = [],
    education = [],
    languages = [],
  } = cvData || {}
  const doc = new jsPDF('p', 'pt', 'a4')

  addHeader(doc, 1)

  const profileImage = await prepareProfileImage(personalInfo.profileImage).catch(() => null)

  let cursorY = 82
  const imageSize = 96
  const imageX = PAGE_WIDTH - MARGIN - imageSize
  const imageTop = 78

  doc.setDrawColor(...BORDER_COLOR)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(imageX, imageTop, imageSize, imageSize, 12, 12, 'FD')

  if (profileImage) {
    doc.addImage(profileImage, 'JPEG', imageX + 5, imageTop + 5, imageSize - 10, imageSize - 10)
  } else {
    doc.setTextColor(...MUTED_COLOR)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text('CV', imageX + imageSize / 2, imageTop + 57, { align: 'center' })
  }

  const textWidth = CONTENT_WIDTH - imageSize - 28
  let heroY = cursorY + 10

  heroY = drawLines(
    doc,
    splitText(doc, personalInfo.fullName, textWidth, 'Nombre completo'),
    MARGIN,
    heroY,
    { fontSize: 22, lineHeight: 24, fontStyle: 'bold' },
  )

  heroY = drawLines(
    doc,
    splitText(doc, personalInfo.profession, textWidth, 'Profesion'),
    MARGIN,
    heroY + 4,
    { fontSize: 13, lineHeight: 16, fontStyle: 'italic', color: ACCENT_COLOR },
  )

  heroY = drawLines(
    doc,
    splitText(doc, personalInfo.city, textWidth, 'Ciudad'),
    MARGIN,
    heroY + 1,
    { fontSize: 11, lineHeight: 14, color: MUTED_COLOR },
  )

  const heroBottom = Math.max(heroY + 8, imageTop + imageSize + 14)
  doc.setDrawColor(...BORDER_COLOR)
  doc.line(MARGIN, heroBottom, PAGE_WIDTH - MARGIN, heroBottom)
  cursorY = heroBottom + 18

  const contactLeftWidth = 180
  const contactGap = 24
  const contactRightX = MARGIN + contactLeftWidth + contactGap
  const contactRightWidth = CONTENT_WIDTH - contactLeftWidth - contactGap

  const leftItems = [
    buildContactItem(doc, {
      label: 'Correo',
      value: personalInfo.email,
      href: normalizeText(personalInfo.email) ? `mailto:${normalizeText(personalInfo.email)}` : '',
    }, contactLeftWidth),
    buildContactItem(doc, {
      label: 'Telefono',
      value: personalInfo.phone,
      href: normalizeText(personalInfo.phone) ? `tel:${normalizeText(personalInfo.phone)}` : '',
    }, contactLeftWidth),
  ]

  const rightItems = [
    buildContactItem(doc, {
      label: 'GitHub',
      value: personalInfo.github,
      href: normalizeText(personalInfo.github),
    }, contactRightWidth),
    buildContactItem(doc, {
      label: 'LinkedIn',
      value: personalInfo.linkedin,
      href: normalizeText(personalInfo.linkedin),
    }, contactRightWidth),
    buildContactItem(doc, {
      label: 'Portafolio',
      value: personalInfo.portfolio,
      href: normalizeText(personalInfo.portfolio),
    }, contactRightWidth),
  ]

  const contactHeight = Math.max(
    leftItems.reduce((sum, item) => sum + item.height, 0),
    rightItems.reduce((sum, item) => sum + item.height, 0),
  )

  cursorY = ensureSpace(doc, cursorY, contactHeight + 26)
  cursorY = drawSectionTitle(doc, 'Contacto y enlaces', cursorY)

  let leftY = cursorY
  leftItems.forEach((item) => {
    leftY = drawContactItem(doc, item, MARGIN, leftY, contactLeftWidth)
  })

  let rightY = cursorY
  rightItems.forEach((item) => {
    rightY = drawContactItem(doc, item, contactRightX, rightY, contactRightWidth)
  })

  cursorY = Math.max(leftY, rightY) + 6

  const profileLines = splitText(
    doc,
    personalInfo.profile,
    CONTENT_WIDTH,
    'Todavia no has escrito una descripcion profesional.',
  )

  cursorY = ensureSpace(doc, cursorY, measureLines(profileLines, 14) + 26)
  cursorY = drawSectionTitle(doc, 'Perfil profesional', cursorY)
  cursorY = drawLines(doc, profileLines, MARGIN, cursorY, {
    fontSize: 10.8,
    lineHeight: 14,
  }) + 8

  const firstSkillBlock = skills.length > 0 ? buildSkillBlock(doc, skills[0], 0) : null
  cursorY = ensureSpace(doc, cursorY, (firstSkillBlock?.height || 18) + 26)
  cursorY = drawSectionTitle(doc, 'Habilidades', cursorY)

  if (skills.length === 0) {
    cursorY = drawLines(doc, ['No hay habilidades registradas.'], MARGIN, cursorY, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    }) + 8
  } else {
    skills.forEach((skill, index) => {
      const block = index === 0 ? firstSkillBlock : buildSkillBlock(doc, skill, index)
      cursorY = ensureSpace(doc, cursorY, block.height + 8)
      cursorY = drawSkillBlock(doc, block, cursorY)
    })
  }

  const firstProjectBlock = projects.length > 0 ? buildProjectBlock(doc, projects[0]) : null
  cursorY = ensureSpace(doc, cursorY, (firstProjectBlock?.height || 18) + 26)
  cursorY = drawSectionTitle(doc, 'Proyectos', cursorY)

  if (projects.length === 0) {
    cursorY = drawLines(doc, ['No hay proyectos registrados.'], MARGIN, cursorY, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    }) + 8
  } else {
    projects.forEach((project, index) => {
      const block = index === 0 ? firstProjectBlock : buildProjectBlock(doc, project)
      cursorY = ensureSpace(doc, cursorY, block.height + 8)
      cursorY = drawProjectBlock(doc, block, cursorY)
    })
  }

  const firstEducationBlock = education.length > 0 ? buildEducationBlock(doc, education[0]) : null
  cursorY = ensureSpace(doc, cursorY, (firstEducationBlock?.height || 18) + 26)
  cursorY = drawSectionTitle(doc, 'Educacion', cursorY)

  if (education.length === 0) {
    cursorY = drawLines(doc, ['No hay registros educativos.'], MARGIN, cursorY, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    }) + 8
  } else {
    education.forEach((entry, index) => {
      const block = index === 0 ? firstEducationBlock : buildEducationBlock(doc, entry)
      cursorY = ensureSpace(doc, cursorY, block.height + 8)
      cursorY = drawEducationBlock(doc, block, cursorY)
    })
  }

  const firstLanguageBlock = languages.length > 0
    ? buildEducationBlock(doc, {
        program: languages[0].name,
        institution: languages[0].level,
        period: '',
        description: languages[0].description,
      })
    : null

  cursorY = ensureSpace(doc, cursorY, (firstLanguageBlock?.height || 18) + 26)
  cursorY = drawSectionTitle(doc, 'Idiomas', cursorY)

  if (languages.length === 0) {
    drawLines(doc, ['No hay idiomas registrados.'], MARGIN, cursorY, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    })
  } else {
    languages.forEach((language, index) => {
      const block = index === 0
        ? firstLanguageBlock
        : buildEducationBlock(doc, {
            program: language.name,
            institution: language.level,
            period: '',
            description: language.description,
          })

      cursorY = ensureSpace(doc, cursorY, block.height + 8)
      cursorY = drawEducationBlock(doc, block, cursorY)
    })
  }

  doc.save(fileName)
}
