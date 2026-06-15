import { jsPDF } from 'jspdf'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 40
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const ACCENT_COLOR = [37, 99, 235]
const TEXT_COLOR = [28, 34, 48]
const MUTED_COLOR = [94, 104, 121]
const BORDER_COLOR = [224, 229, 238]
const CARD_FILL = [248, 250, 252]

function normalizeText(value, fallback = '') {
  return String(value ?? '').trim() || fallback
}

function normalizeUrl(value) {
  const text = normalizeText(value)
  return text ? text.replace(/^https?:\/\//i, '') : ''
}

function getImageFormat(source) {
  if (source.startsWith('data:image/jpeg')) return 'JPEG'
  if (source.startsWith('data:image/jpg')) return 'JPEG'
  return 'PNG'
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

function addHeader(doc, pageNumber) {
  doc.setFillColor(...ACCENT_COLOR)
  doc.rect(0, 0, PAGE_WIDTH, 16, 'F')

  doc.setTextColor(...MUTED_COLOR)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('DevProfile', MARGIN, 28)
  doc.text(`Página ${pageNumber}`, PAGE_WIDTH - MARGIN, 28, { align: 'right' })

  doc.setTextColor(...TEXT_COLOR)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Currículum Vitae', MARGIN, 46)

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
  return 70
}

function drawWrappedText(doc, text, x, y, width, options = {}) {
  const {
    fontSize = 11,
    lineHeight = 15,
    fontStyle = 'normal',
    color = TEXT_COLOR,
  } = options

  const lines = doc.splitTextToSize(normalizeText(text), width)

  doc.setTextColor(...color)
  doc.setFont('helvetica', fontStyle)
  doc.setFontSize(fontSize)
  doc.text(lines, x, y)

  return y + lines.length * lineHeight
}

function drawLabelValue(doc, label, value, x, y, width, options = {}) {
  const labelText = `${label}: `
  const labelWidth = doc.getTextWidth(labelText)
  const availableWidth = Math.max(40, width - labelWidth)
  const text = normalizeText(value, 'No registrado')
  const lines = doc.splitTextToSize(text, availableWidth)

  doc.setTextColor(...MUTED_COLOR)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(options.fontSize ?? 10)
  doc.text(labelText, x, y)

  doc.setTextColor(...TEXT_COLOR)
  doc.setFont('helvetica', 'normal')
  doc.text(lines, x + labelWidth, y)

  return y + lines.length * (options.lineHeight ?? 13)
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

function drawCard(doc, x, y, height) {
  doc.setDrawColor(...BORDER_COLOR)
  doc.setFillColor(...CARD_FILL)
  doc.roundedRect(x, y, CONTENT_WIDTH, height, 8, 8, 'S')
}

export async function exportCvToPdf(cvData, fileName = 'cv-devprofile.pdf') {
  const { personalInfo = {}, skills = [], projects = [], education = [] } = cvData || {}
  const doc = new jsPDF('p', 'pt', 'a4')

  addHeader(doc, 1)
  let cursorY = 82

  const profileImage = await imageToDataUrl(personalInfo.profileImage).catch(() => null)
  const imageSize = 104
  const imageX = PAGE_WIDTH - MARGIN - imageSize

  if (profileImage) {
    doc.setDrawColor(...BORDER_COLOR)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(imageX, cursorY - 6, imageSize, imageSize, 10, 10, 'S')
    doc.addImage(profileImage, getImageFormat(profileImage), imageX + 4, cursorY - 2, imageSize - 8, imageSize - 8)
  } else {
    doc.setDrawColor(...BORDER_COLOR)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(imageX, cursorY - 6, imageSize, imageSize, 10, 10, 'S')
    doc.setTextColor(...MUTED_COLOR)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text('CV', imageX + imageSize / 2, cursorY + 52, { align: 'center' })
  }

  const textWidth = CONTENT_WIDTH - imageSize - 24
  cursorY = drawWrappedText(
    doc,
    normalizeText(personalInfo.fullName, 'Nombre completo'),
    MARGIN,
    cursorY + 6,
    textWidth,
    { fontSize: 22, lineHeight: 26, fontStyle: 'bold' }
  )

  cursorY = drawWrappedText(
    doc,
    normalizeText(personalInfo.profession, 'Profesión'),
    MARGIN,
    cursorY + 2,
    textWidth,
    { fontSize: 13, lineHeight: 16, fontStyle: 'italic', color: ACCENT_COLOR }
  )

  cursorY = drawWrappedText(
    doc,
    normalizeText(personalInfo.city, 'Ciudad'),
    MARGIN,
    cursorY + 1,
    textWidth,
    { fontSize: 11, lineHeight: 14, color: MUTED_COLOR }
  )

  cursorY += 14
  doc.setDrawColor(...BORDER_COLOR)
  doc.line(MARGIN, cursorY, PAGE_WIDTH - MARGIN, cursorY)
  cursorY += 18

  cursorY = drawSectionTitle(doc, 'Contacto y enlaces', cursorY)
  cursorY = ensureSpace(doc, cursorY, 56)

  const leftColumnWidth = 250
  const rightColumnX = MARGIN + leftColumnWidth + 24
  const rightColumnWidth = CONTENT_WIDTH - leftColumnWidth - 24

  let leftY = cursorY
  leftY = drawLabelValue(doc, 'Correo', personalInfo.email, MARGIN, leftY, leftColumnWidth)
  leftY = drawLabelValue(doc, 'Teléfono', personalInfo.phone, MARGIN, leftY + 2, leftColumnWidth)

  let rightY = cursorY
  rightY = drawLabelValue(doc, 'GitHub', normalizeUrl(personalInfo.github), rightColumnX, rightY, rightColumnWidth)
  rightY = drawLabelValue(doc, 'LinkedIn', normalizeUrl(personalInfo.linkedin), rightColumnX, rightY + 2, rightColumnWidth)
  rightY = drawLabelValue(doc, 'Portafolio', normalizeUrl(personalInfo.portfolio), rightColumnX, rightY + 2, rightColumnWidth)

  cursorY = Math.max(leftY, rightY) + 18

  cursorY = drawSectionTitle(doc, 'Perfil profesional', cursorY)
  const profileText = normalizeText(
    personalInfo.profile,
    'Todavía no has escrito una descripción profesional.'
  )
  const profileLines = doc.splitTextToSize(profileText, CONTENT_WIDTH)
  cursorY = ensureSpace(doc, cursorY, profileLines.length * 14 + 8)
  doc.setTextColor(...TEXT_COLOR)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(profileLines, MARGIN, cursorY)
  cursorY += profileLines.length * 14 + 16

  cursorY = drawSectionTitle(doc, 'Habilidades', cursorY)
  if (skills.length === 0) {
    cursorY = drawWrappedText(doc, 'No hay habilidades registradas.', MARGIN, cursorY, CONTENT_WIDTH, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    })
    cursorY += 8
  } else {
    skills.forEach((skill, index) => {
      const skillName = normalizeText(skill.name || skill.skill, 'Habilidad')
      const parts = [skillName]
      if (skill.category) parts.push(`Categoría: ${skill.category}`)
      if (skill.level) parts.push(`Nivel: ${skill.level}`)
      if (skill.description) parts.push(skill.description)

      const lines = doc.splitTextToSize(parts.join(' | '), CONTENT_WIDTH - 24)
      const blockHeight = lines.length * 13 + 20
      cursorY = ensureSpace(doc, cursorY, blockHeight)

      drawCard(doc, MARGIN, cursorY - 10, blockHeight)
      doc.setTextColor(...TEXT_COLOR)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(`${index + 1}. ${skillName}`, MARGIN + 12, cursorY + 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.text(lines, MARGIN + 12, cursorY + 18)
      cursorY += blockHeight + 10
    })
  }

  cursorY = drawSectionTitle(doc, 'Proyectos', cursorY)
  if (projects.length === 0) {
    cursorY = drawWrappedText(doc, 'No hay proyectos registrados.', MARGIN, cursorY, CONTENT_WIDTH, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    })
    cursorY += 8
  } else {
    for (const project of projects) {
      const title = normalizeText(project.name, 'Proyecto')
      const description = normalizeText(project.description)
      const technologies = normalizeText(project.technologies)
      const links = [project.repository, project.deploy].map(normalizeUrl).filter(Boolean)
      const contentLines = []

      if (description) contentLines.push(description)
      if (technologies) contentLines.push(`Tecnologías: ${technologies}`)
      if (links.length > 0) contentLines.push(`Enlaces: ${links.join(' | ')}`)

      const lines = doc.splitTextToSize(contentLines.join('\n'), CONTENT_WIDTH - 24)
      const blockHeight = lines.length * 13 + 20
      cursorY = ensureSpace(doc, cursorY, blockHeight)

      drawCard(doc, MARGIN, cursorY - 10, blockHeight)
      doc.setTextColor(...TEXT_COLOR)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11.5)
      doc.text(title, MARGIN + 12, cursorY + 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.text(lines, MARGIN + 12, cursorY + 18)

      cursorY += blockHeight + 10
    }
  }

  cursorY = drawSectionTitle(doc, 'Educación', cursorY)
  if (education.length === 0) {
    cursorY = drawWrappedText(doc, 'No hay registros educativos.', MARGIN, cursorY, CONTENT_WIDTH, {
      fontSize: 11,
      lineHeight: 14,
      color: MUTED_COLOR,
    })
  } else {
    for (const entry of education) {
      const program = normalizeText(entry.program, 'Programa')
      const institution = normalizeText(entry.institution)
      const period = normalizeText(entry.period)
      const description = normalizeText(entry.description)
      const contentLines = [institution, period, description].filter(Boolean)
      const lines = doc.splitTextToSize(contentLines.join('\n'), CONTENT_WIDTH - 24)
      const blockHeight = lines.length * 13 + 20
      cursorY = ensureSpace(doc, cursorY, blockHeight)

      drawCard(doc, MARGIN, cursorY - 10, blockHeight)
      doc.setTextColor(...TEXT_COLOR)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11.5)
      doc.text(program, MARGIN + 12, cursorY + 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.text(lines, MARGIN + 12, cursorY + 18)

      cursorY += blockHeight + 10
    }
  }

  doc.save(fileName)
}