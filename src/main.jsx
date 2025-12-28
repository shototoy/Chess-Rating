import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'


console.log('Backend URL:', import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <PlayerProvider>
                <App />
            </PlayerProvider>
        </AuthProvider>
    </StrictMode>,
)
