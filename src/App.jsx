import { useState } from 'react';
import './index.css';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Dashboard } from './views/Dashboard';
import { BottomNav } from './components/BottomNav';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [isLoading, setIsLoading] = useState(true);

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
            return <Dashboard />;
        }

        // Default to home
        return <Home />;
    };

    if (isLoading) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    return (
        <div className="app-shell">
            <header className="app-header" style={{ paddingTop: '1.5rem' }}>
                Biyaherong Arbiter
            </header>

            <main style={{ paddingBottom: 80 }}>
                {renderContent()}
            </main>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} style={{ paddingBottom: '1.5rem' }} />
        </div>
    );
}

export default App;

