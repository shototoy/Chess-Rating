import React from 'react';
import { Search, LayoutDashboard, Home } from 'lucide-react';

export const BottomNav = ({ currentTab, onTabChange }) => {
    return (
        <nav className="bottom-nav">
            <div
                className={`nav-item ${currentTab === 'search' ? 'active' : ''}`}
                onClick={() => onTabChange('search')}
            >
                <Search className="nav-icon" size={24} />
                <span>Search</span>
            </div>

            <div
                className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => onTabChange('home')}
            >
                <div style={{
                    background: currentTab === 'home' ? 'var(--primary-color)' : '#eee',
                    borderRadius: '50%',
                    width: 48, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: -20,
                    border: '4px solid white',
                    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
                }}>
                    <Home className="nav-icon" size={24} color={currentTab === 'home' ? 'white' : '#666'} style={{ marginBottom: 0 }} />
                </div>
                <span style={{ marginTop: 4 }}>Home</span>
            </div>

            <div
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
            >
                <LayoutDashboard className="nav-icon" size={24} />
                <span>Dashboard</span>
            </div>
        </nav>
    );
};
