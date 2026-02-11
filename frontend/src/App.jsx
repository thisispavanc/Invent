import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Backend error:", err)
        setError("Could not connect to backend")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Tanuh Inventory Management</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h2 className="font-semibold text-gray-700">Frontend Status</h2>
            <p className="text-green-600">✅ Running successfully</p>
            <p className="text-sm text-gray-500 mt-1">Tailwind CSS is configured.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h2 className="font-semibold text-gray-700">Backend Status</h2>
            {loading ? (
              <p className="text-blue-500">Connecting...</p>
            ) : error ? (
              <p className="text-red-500">❌ {error}</p>
            ) : (
              <p className="text-green-600">✅ {data}</p>
            )}
            {error && (
              <p className="text-xs text-red-500 mt-1">
                Ensure backend server is running on port 3000 and database is connected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
