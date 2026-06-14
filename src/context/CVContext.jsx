import { createContext, useContext, useState } from 'react'

const CVContext = createContext()

const createSkillId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeSkill = (skill, index) =>
  typeof skill === 'string'
    ? { id: `legacy-skill-${index}`, name: skill }
    : skill

const initialCVData = {
  personalInfo: {
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
    city: '',
  },
  skills: [],
  projects: [],
  education: [],
}

export function CVProvider({ children }) {
  const [cvData, setCVData] = useState(initialCVData)

  const updatePersonalInfo = (field, value) => {
    setCVData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [field]: value,
      },
    }))
  }

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim()

    if (!trimmedSkill) {
      return
    }

    setCVData((prevData) => ({
      ...prevData,
      skills: [
        ...prevData.skills.map(normalizeSkill),
        {
          id: createSkillId(),
          name: trimmedSkill,
        },
      ],
    }))
  }

  const updateSkill = (skillId, nextSkill) => {
    const trimmedSkill = nextSkill.trim()

    if (!trimmedSkill) {
      return
    }

    setCVData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill, index) => {
        const normalizedSkill = normalizeSkill(skill, index)

        if (normalizedSkill.id !== skillId) {
          return normalizedSkill
        }

        return {
          ...normalizedSkill,
          name: trimmedSkill,
        }
      }),
    }))
  }

  const deleteSkill = (skillId) => {
    setCVData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill, index) => {
        const normalizedSkill = normalizeSkill(skill, index)
        return normalizedSkill.id !== skillId
      }),
    }))
  }

  const addProject = (project) => {
    setCVData((prevData) => ({
      ...prevData,
      projects: [...prevData.projects, project],
    }))
  }

  const updateProject = (projectId, updatedProject) => {
  setCVData((prevData) => ({
    ...prevData,
    projects: prevData.projects.map((project) =>
      project.id === projectId
        ? { ...project, ...updatedProject }
        : project
    ),
  }))
}

const deleteProject = (projectId) => {
  setCVData((prevData) => ({
    ...prevData,
    projects: prevData.projects.filter((project) => project.id !== projectId),
  }))
}

  const addEducation = (educationItem) => {
    setCVData((prevData) => ({
      ...prevData,
      education: [...prevData.education, educationItem],
    }))
  }

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCVData,
        updatePersonalInfo,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        addEducation,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </CVContext.Provider>
  )
}

export function useCV() {
  return useContext(CVContext)
}