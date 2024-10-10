import React from 'react'
import { Camera, Search, Heart, History, Moon, Sun, Globe } from 'lucide-react'

interface HomePageProps {
  darkMode: boolean
}

const HomePage: React.FC<HomePageProps> = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <Camera size={64} className="text-blue-500 dark:text-blue-400 mb-4" />
      <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Image Generator</h1>
      <p className={`text-xl mb-6 text-center max-w-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Discover and generate beautiful images using the power of Unsplash API.
        Simply enter a search term, and we'll fetch a random image that matches your query.
      </p>
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md w-full max-w-2xl`}>
        <h2 className="text-2xl font-semibold mb-4">App Features</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <Search className="mr-2 text-blue-500" size={20} />
            <span>Generate random images based on your search terms</span>
          </li>
          <li className="flex items-center">
            <Heart className="mr-2 text-pink-500" size={20} />
            <span>Save your favorite images for later</span>
          </li>
          <li className="flex items-center">
            <History className="mr-2 text-green-500" size={20} />
            <span>View and reuse your recent search history</span>
          </li>
          <li className="flex items-center">
            <Moon className="mr-2 text-yellow-500" size={20} />
            <Sun className="mr-2 text-yellow-500" size={20} />
            <span>Toggle between light and dark modes for comfortable viewing</span>
          </li>
          <li className="flex items-center">
            <Globe className="mr-2 text-indigo-500" size={20} />
            <span>Translate image descriptions from English to Spanish</span>
          </li>
        </ul>
      </div>
      <div className={`mt-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md w-full max-w-2xl`}>
        <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
        <ul className="space-y-2">
          <li><strong>Created by:</strong> Enmanuel Reynoso</li>
          <li><strong>Powered by:</strong> Unsplash API</li>
          <li><strong>Tech Stack:</strong> React, TypeScript, Tailwind CSS</li>
          <li><strong>Additional Libraries:</strong> Lucide React for icons, Framer Motion for animations</li>
          <li><strong>Features:</strong> Dark Mode, Random Image Generation, Favorites, Search History, English to Spanish Translation</li>
        </ul>
      </div>
      <div className={`mt-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
        <p>Start exploring by navigating to the Image Generator page using the icon in the top right corner.</p>
        <p>Happy image hunting!</p>
      </div>
    </div>
  )
}

export default HomePage