import React from 'react';
import { Search, LayoutDashboard, Home } from 'lucide-react';

export const BottomNav = ({ currentTab, onTabChange, style }) => {
    return (
        <nav className="bottom-nav" style={{ ...style, paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <div
                className={`nav-item ${currentTab === 'search' ? 'active' : ''}`}
                onClick={() => onTabChange('search')}
            >
                <Search className="nav-icon" size={24} />
                <span style={{ fontSize: '0.75rem' }}>Search</span>
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
                <span style={{ marginTop: 4, fontSize: '0.75rem' }}>Home</span>
            </div>

            <div
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
            >
                <LayoutDashboard className="nav-icon" size={24} />
                <span style={{ fontSize: '0.75rem' }}>Dashboard</span>
            </div>
        </nav>
    );
};

