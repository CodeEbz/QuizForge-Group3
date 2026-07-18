import { useState, useEffect } from "react"


export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("quizforge_theme")
    if (saved === "light" || saved === "dark") return saved
    return "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "light") {
      root.setAttribute("data-theme", "light")
    } else {
      root.removeAttribute("data-theme")
    }
    localStorage.setItem("quizforge_theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === "dark" ? "light" : "dark"))

  return { theme, toggleTheme }
}