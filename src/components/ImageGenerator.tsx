import React, { useState, useCallback, useEffect } from 'react'
import { Search, AlertCircle, RefreshCw, Heart, Share2, History, Globe } from 'lucide-react'

interface ImageGeneratorProps {
  unsplashAccessKey: string
  darkMode: boolean
  addToFavorites: (imageUrl: string, photographer: string, query: string) => void
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ unsplashAccessKey, darkMode, addToFavorites }) => {
  const [query, setQuery] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [photographer, setPhotographer] = useState('')
  const [description, setDescription] = useState('')
  const [translatedDescription, setTranslatedDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Array<{ url: string; query: string }>>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('imageHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveHistory = useCallback((url: string, query: string) => {
    const newHistory = [{ url, query }, ...history.slice(0, 9)]
    setHistory(newHistory)
    localStorage.setItem('imageHistory', JSON.stringify(newHistory))
  }, [history])

  const generateImage = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')
    setPhotographer('')
    setDescription('')
    setTranslatedDescription('')

    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`, {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data && data.urls && data.urls.regular) {
        setImageUrl(data.urls.regular)
        setPhotographer(data.user.name)
        setDescription(data.description || data.alt_description || 'No description available')
        saveHistory(data.urls.regular, query)
      } else {
        throw new Error('Invalid response from Unsplash API')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      setError('Failed to generate image. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [query, unsplashAccessKey, saveHistory])

  const handleRetry = useCallback(() => {
    generateImage()
  }, [generateImage])

  const handleSaveToFavorites = useCallback(() => {
    if (imageUrl && photographer) {
      addToFavorites(imageUrl, photographer, query)
    }
  }, [imageUrl, photographer, query, addToFavorites])

  const handleShare = useCallback(() => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl).then(() => {
        alert('Image URL copied to clipboard!')
      }, (err) => {
        console.error('Could not copy text: ', err)
      })
    }
  }, [imageUrl])

  const translateDescription = useCallback(async () => {
    if (!description) return

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(description)}&langpair=en|es`)
      const data = await response.json()
      if (data && data.responseData && data.responseData.translatedText) {
        setTranslatedDescription(data.responseData.translatedText)
      } else {
        throw new Error('Translation failed')
      }
    } catch (error) {
      console.error('Error translating description:', error)
      setError('Failed to translate description. Please try again.')
    }
  }, [description])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateImage()}
            placeholder="Enter a search term"
            className={`flex-grow px-4 py-2 rounded-l-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className={`${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
        {error && (
          <div className={`mt-4 p-2 ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} border rounded flex items-center justify-between`}>
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {imageUrl && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt="Generated" 
              className="w-full rounded-lg shadow-lg"
              onError={() => setError('Failed to load image. Please try again.')}
            />
            <div className={`mt-2 flex justify-between items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>{photographer}</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors flex items-center"
                >
                  <Share2 size={16} className="mr-1" /> Copy URL
                </button>
                <button
                  onClick={handleSaveToFavorites}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors flex items-center"
                >
                  <Heart size={16} className="mr-1" /> Favorite
                </button>
              </div>
            </div>
            {description && (
              <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p><strong>Description:</strong> {description}</p>
                {translatedDescription ? (
                  <p><strong>Traducción:</strong> {translatedDescription}</p>
                ) : (
                  <button
                    onClick={translateDescription}
                    className="mt-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center"
                  >
                    <Globe size={16} className="mr-1" /> Translate to Spanish
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {history.length > 0 && (
          <div className={`mt-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <History size={20} className="mr-2" /> Recent Searches
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {history.map((item, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={item.url} 
                    alt={item.query} 
                    className="w-full h-24 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setQuery(item.query)
                      generateImage()
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs text-center">{item.query}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGenerator