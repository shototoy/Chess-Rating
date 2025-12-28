import { useState } from 'react';
import './index.css';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Dashboard } from './views/Dashboard';
import { BottomNav } from './components/BottomNav';

function App() {
    const [currentTab, setCurrentTab] = useState('home');

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
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

    return (
        <div className="app-shell">
            <header className="app-header">
                Chess Ratings
            </header>

            <main style={{ paddingBottom: 80 }}>
                {renderContent()}
            </main>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
}

export default App;
