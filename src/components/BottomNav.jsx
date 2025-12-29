import React from 'react';
import { Search, LayoutDashboard, Home } from 'lucide-react';

export const BottomNav = ({ currentTab, onTabChange, style }) => {
    return (
        <nav className="bottom-nav" style={{ ...style, paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <div
                className={`nav-item ${currentTab === 'search' ? 'active' : ''}`}
                onClick={() => onTabChange('search')}
            >
                <Search className="nav-icon" size={28} />
            </div>

            <div
                className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => onTabChange('home')}
            >
                <div style={{
                    background: currentTab === 'home' ? 'var(--primary-color)' : '#eee',
                    borderRadius: '50%',
                    width: 56, height: 56,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: -24,
                    border: '4px solid white',
                    boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
                }}>
                    <Home className="nav-icon" size={28} color={currentTab === 'home' ? 'white' : '#666'} />
                </div>
            </div>

            <div
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
            >
                <LayoutDashboard className="nav-icon" size={28} />
            </div>
        </nav>
    );
};

