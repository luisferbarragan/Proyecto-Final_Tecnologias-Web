export const validateRequired = (value) => {
  return value.trim() !== ''
}

export const validateEmail = (email) => {
  if (!email.trim()) return true

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url) => {
  if (!url.trim()) return true

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateMinLength = (value, min) => {
  return value.trim().length >= min
}

export const validateMaxLength = (value, max) => {
  return value.trim().length <= max
}