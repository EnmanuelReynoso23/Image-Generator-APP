import React, { useState, useCallback, useEffect } from 'react'
import { Search, AlertCircle, RefreshCw, Moon, Sun, Home, Image, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './components/HomePage'
import ImageGenerator from './components/ImageGenerator'
import FavoritesPage from './components/FavoritesPage'

const UNSPLASH_ACCESS_KEY = 'svkNBuj1LQ1FTSbWcaDdsD8QNZcivmgqI-45tqcP0kQ'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [favorites, setFavorites] = useState<Array<{ url: string, photographer: string, query: string }>>([])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const addToFavorites = useCallback((imageUrl: string, photographer: string, query: string) => {
    setFavorites(prev => [...prev, { url: imageUrl, photographer, query }])
  }, [])

  const removeFromFavorites = useCallback((index: number) => {
    setFavorites(prev => prev.filter((_, i) => i !== index))
  }, [])

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <nav className="bg-blue-500 dark:bg-blue-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Image Generator</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => setCurrentPage('generator')}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Image size={24} />
          </button>
          <button
            onClick={() => setCurrentPage('favorites')}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Heart size={24} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </nav>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="container mx-auto p-4"
        >
          {currentPage === 'home' ? (
            <HomePage darkMode={darkMode} />
          ) : currentPage === 'generator' ? (
            <ImageGenerator 
              unsplashAccessKey={UNSPLASH_ACCESS_KEY} 
              darkMode={darkMode} 
              addToFavorites={addToFavorites}
            />
          ) : (
            <FavoritesPage 
              favorites={favorites} 
              darkMode={darkMode} 
              removeFromFavorites={removeFromFavorites}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App