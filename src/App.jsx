import { useState } from 'react';
import { Toast } from './components/Toast';
import './index.css';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Dashboard } from './views/Dashboard';
import { Navbar } from './components/Navbar';
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

            <Navbar currentTab={currentTab} onTabChange={handleTabChange} />

            <main style={{ paddingTop: '80px', paddingBottom: '20px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
                {renderContent()}
            </main>
        </div>
    );
}

export default App;

