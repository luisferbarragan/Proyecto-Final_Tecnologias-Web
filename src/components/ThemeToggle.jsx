function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v2.25" />
            <path d="M12 18.75V21" />
            <path d="M4.22 4.22l1.59 1.59" />
            <path d="M18.19 18.19l1.59 1.59" />
            <path d="M3 12h2.25" />
            <path d="M18.75 12H21" />
            <path d="M4.22 19.78l1.59-1.59" />
            <path d="M18.19 5.81l1.59-1.59" />
            <circle cx="12" cy="12" r="4.25" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.7A8.5 8.5 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" />
          </svg>
        )}
      </span>
      <span className="theme-toggle-text">{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  )
}

export default ThemeToggle