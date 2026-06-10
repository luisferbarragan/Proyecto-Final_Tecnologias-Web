import { createContext, useContext, useState } from 'react'

const CVContext = createContext()

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
    setCVData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, skill],
    }))
  }

  const addProject = (project) => {
    setCVData((prevData) => ({
      ...prevData,
      projects: [...prevData.projects, project],
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
        addProject,
        addEducation,
      }}
    >
      {children}
    </CVContext.Provider>
  )
}

export function useCV() {
  return useContext(CVContext)
}