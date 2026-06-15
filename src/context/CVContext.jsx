import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CVContext = createContext()

const defaultPersonalInfo = {
  fullName: '',
  profession: '',
  city: '',
  email: '',
  phone: '',
  profile: '',
  github: '',
  linkedin: '',
  portfolio: '',
  profileImage: '',
}

const createId = (prefix) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeText = (value) => String(value ?? '').trim()

const normalizeSkillLevel = (value) => {
  const text = normalizeText(value).toLowerCase()

  if (text.startsWith('b')) return 'Basico'
  if (text.startsWith('i')) return 'Intermedio'
  if (text.startsWith('a')) return 'Avanzado'

  return normalizeText(value)
}

const normalizeSkill = (skill, index) =>
  typeof skill === 'string'
    ? {
        id: `legacy-skill-${index}`,
        name: skill,
        category: '',
        level: '',
        description: '',
      }
    : {
        id: skill?.id || `legacy-skill-${index}`,
        name: normalizeText(skill?.name || skill?.skill),
        category: normalizeText(skill?.category),
        level: normalizeSkillLevel(skill?.level),
        description: normalizeText(skill?.description),
      }

const prepareSkill = (skill, currentSkillId) => {
  if (typeof skill === 'string') {
    const name = normalizeText(skill)

    if (!name) {
      return null
    }

    return {
      id: currentSkillId || createId('skill'),
      name,
      category: '',
      level: '',
      description: '',
    }
  }

  if (!skill || typeof skill !== 'object') {
    return null
  }

  const name = normalizeText(skill.name || skill.skill)

  if (!name) {
    return null
  }

  return {
    id: currentSkillId || skill.id || createId('skill'),
    name,
    category: normalizeText(skill.category),
    level: normalizeSkillLevel(skill.level),
    description: normalizeText(skill.description),
  }
}

const normalizeProject = (project, index) => ({
  id: project?.id || `legacy-project-${index}`,
  name: normalizeText(project?.name),
  description: normalizeText(project?.description),
  technologies: normalizeText(project?.technologies),
  repository: normalizeText(project?.repository),
  deploy: normalizeText(project?.deploy),
  image: normalizeText(project?.image),
})

const prepareProject = (project, currentProjectId) => ({
  id: currentProjectId || project?.id || createId('project'),
  name: normalizeText(project?.name),
  description: normalizeText(project?.description),
  technologies: normalizeText(project?.technologies),
  repository: normalizeText(project?.repository),
  deploy: normalizeText(project?.deploy),
  image: normalizeText(project?.image),
})

const normalizeEducation = (entry, index) =>
  typeof entry === 'string'
    ? {
        id: `legacy-education-${index}`,
        institution: entry,
        program: '',
        period: '',
        description: '',
      }
    : {
        id: entry?.id || `legacy-education-${index}`,
        institution: normalizeText(entry?.institution),
        program: normalizeText(entry?.program),
        period: normalizeText(entry?.period),
        description: normalizeText(entry?.description),
      }

const prepareEducation = (entry, currentEducationId) => ({
  id: currentEducationId || entry?.id || createId('education'),
  institution: normalizeText(entry?.institution),
  program: normalizeText(entry?.program),
  period: normalizeText(entry?.period),
  description: normalizeText(entry?.description),
})

const normalizeLanguage = (language, index) =>
  typeof language === 'string'
    ? {
        id: `legacy-language-${index}`,
        name: language,
        level: '',
        description: '',
      }
    : {
        id: language?.id || `legacy-language-${index}`,
        name: normalizeText(language?.name),
        level: normalizeText(language?.level),
        description: normalizeText(language?.description),
      }

const prepareLanguage = (language, currentLanguageId) => ({
  id: currentLanguageId || language?.id || createId('language'),
  name: normalizeText(language?.name),
  level: normalizeText(language?.level),
  description: normalizeText(language?.description),
})

const sanitizeCvData = (data) => {
  const source = data && typeof data === 'object' ? data : {}

  return {
    personalInfo: {
      ...defaultPersonalInfo,
      ...(source.personalInfo || {}),
    },
    skills: Array.isArray(source.skills)
      ? source.skills.map(normalizeSkill).filter((skill) => skill.name)
      : [],
    projects: Array.isArray(source.projects)
      ? source.projects.map(normalizeProject).filter((project) => project.name)
      : [],
    education: Array.isArray(source.education)
      ? source.education.map(normalizeEducation).filter((entry) => entry.program || entry.institution)
      : [],
    languages: Array.isArray(source.languages)
      ? source.languages.map(normalizeLanguage).filter((language) => language.name)
      : [],
  }
}

const initialCVData = sanitizeCvData({})

export function CVProvider({ children }) {
  const [storedCvData, setStoredCvData] = useLocalStorage('cv-data', initialCVData)
  const cvData = sanitizeCvData(storedCvData)

  const updatePersonalInfo = (field, value) => {
    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        personalInfo: {
          ...currentData.personalInfo,
          [field]: value,
        },
      }
    })
  }

  const addSkill = (skill) => {
    const nextSkill = prepareSkill(skill)

    if (!nextSkill) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        skills: [...currentData.skills, nextSkill],
      }
    })
  }

  const updateSkill = (skillId, nextSkill) => {
    const preparedSkill = prepareSkill(nextSkill, skillId)

    if (!preparedSkill) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        skills: currentData.skills.map((skill) =>
          skill.id === skillId ? preparedSkill : skill,
        ),
      }
    })
  }

  const deleteSkill = (skillId) => {
    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        skills: currentData.skills.filter((skill) => skill.id !== skillId),
      }
    })
  }

  const addProject = (project) => {
    const preparedProject = prepareProject(project)

    if (!preparedProject.name) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        projects: [...currentData.projects, preparedProject],
      }
    })
  }

  const updateProject = (projectId, updatedProject) => {
    const preparedProject = prepareProject(updatedProject, projectId)

    if (!preparedProject.name) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        projects: currentData.projects.map((project) =>
          project.id === projectId ? preparedProject : project,
        ),
      }
    })
  }

  const deleteProject = (projectId) => {
    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        projects: currentData.projects.filter((project) => project.id !== projectId),
      }
    })
  }

  const addEducation = (educationItem) => {
    const preparedEducation = prepareEducation(educationItem)

    if (!preparedEducation.program && !preparedEducation.institution) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        education: [...currentData.education, preparedEducation],
      }
    })
  }

  const updateEducation = (educationId, educationItem) => {
    const preparedEducation = prepareEducation(educationItem, educationId)

    if (!preparedEducation.program && !preparedEducation.institution) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        education: currentData.education.map((entry) =>
          entry.id === educationId ? preparedEducation : entry,
        ),
      }
    })
  }

  const deleteEducation = (educationId) => {
    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        education: currentData.education.filter((entry) => entry.id !== educationId),
      }
    })
  }

  const addLanguage = (language) => {
    const preparedLanguage = prepareLanguage(language)

    if (!preparedLanguage.name) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        languages: [...currentData.languages, preparedLanguage],
      }
    })
  }

  const updateLanguage = (languageId, language) => {
    const preparedLanguage = prepareLanguage(language, languageId)

    if (!preparedLanguage.name) {
      return
    }

    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        languages: currentData.languages.map((entry) =>
          entry.id === languageId ? preparedLanguage : entry,
        ),
      }
    })
  }

  const deleteLanguage = (languageId) => {
    setStoredCvData((prevData) => {
      const currentData = sanitizeCvData(prevData)

      return {
        ...currentData,
        languages: currentData.languages.filter((entry) => entry.id !== languageId),
      }
    })
  }

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCVData: setStoredCvData,
        updatePersonalInfo,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addEducation,
        updateEducation,
        deleteEducation,
        addLanguage,
        updateLanguage,
        deleteLanguage,
      }}
    >
      {children}
    </CVContext.Provider>
  )
}

export function useCV() {
  return useContext(CVContext)
}
