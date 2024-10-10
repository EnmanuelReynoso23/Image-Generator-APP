import React from 'react'
import { Trash2 } from 'lucide-react'

interface FavoritesPageProps {
  favorites: Array<{ url: string; photographer: string; query: string }>
  darkMode: boolean
  removeFromFavorites: (index: number) => void
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites, darkMode, removeFromFavorites }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Favorite Images</h2>
      {favorites.length === 0 ? (
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>You haven't saved any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden relative`}>
              <img src={favorite.url} alt={favorite.query} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {favorite.photographer}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Search: {favorite.query}
                </p>
              </div>
              <button
                onClick={() => removeFromFavorites(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage