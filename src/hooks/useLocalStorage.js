import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  // Inicializa el estado con el valor almacenado en localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)

      // Si existe un valor guardado lo devuelve,
      // de lo contrario usa el valor inicial
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('error al leer localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      // Permite recibir un valor directo o una función actualizadora
      const valueToStore =
        value instanceof Function
          ? value(storedValue)
          : value

      // actualiza el estado de React
      setStoredValue(valueToStore)

      // guarda el valor actualizado en localStorage
      localStorage.setItem(
        key,
        JSON.stringify(valueToStore)
      )
    } catch (error) {
      console.error('error al escribir en localStorage:', error)
    }
  }

  // retorna el valor almacenado y la funcion para actualizarlo
  return [storedValue, setValue]
}