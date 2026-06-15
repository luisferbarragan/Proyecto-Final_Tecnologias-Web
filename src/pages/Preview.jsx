import { useRef, useState } from 'react'
import { useCV } from '../context/CVContext'
import CVPreview from '../components/CVPreview'
import { exportCvToPdf } from '../utils/exportPdf'
import '../styles/cv-form.css'

function Preview() {
  const { cvData } = useCV()
  const previewRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState('')

  const handleExportPdf = async () => {
    if (isExporting) {
      return
    }

    setIsExporting(true)
    setExportMessage('')

    try {
      await exportCvToPdf(cvData, 'cv-devprofile.pdf')
      setExportMessage('PDF generado correctamente.')
    } catch (error) {
      console.error('Error al exportar el PDF:', error)
      setExportMessage('No se pudo generar el PDF.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="container preview-page">
      <div className="editor-hero">
        <p className="editor-kicker">Vista previa</p>
        <h1>Perfil profesional</h1>
        <p className="editor-intro">
          Esta es la información que se va construyendo desde el formulario del editor.
        </p>
      </div>

      <div className="preview-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleExportPdf}
          disabled={isExporting}
        >
          {isExporting ? 'Generando PDF...' : 'Exportar a PDF'}
        </button>
        {exportMessage && <p className="export-status">{exportMessage}</p>}
      </div>

      <CVPreview ref={previewRef} />
    </section>
  )
}

export default Preview