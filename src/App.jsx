import { useState } from 'react';
import { Toast } from './components/Toast';
import './index.css';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Dashboard } from './views/Dashboard';
import { BottomNav } from './components/BottomNav';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', color: undefined });

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    const renderContent = () => {
        if (currentTab === 'search') {
            return <Search />;
        }

        if (currentTab === 'dashboard') {
            return <Dashboard setToast={setToast} />;
        }

        // Default to home
        return <Home />;
    };

    if (isLoading) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    return (
        <div className="app-shell">
            <Toast
                message={toast.message}
                show={toast.show}
                color={toast.color}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />


            {/* Fixed Header Banner */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: '13vh',
                marginBottom: '8px',
                overflow: 'hidden',
                background: 'white'
            }}>
                <img src="/banner1.jpg" alt="One Chess Movement" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
            </div>

            <main style={{ paddingBottom: 100 }}>
                {renderContent()}
            </main>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} style={{ paddingBottom: '1.5rem' }} />
        </div>
    );
}

export default App;

