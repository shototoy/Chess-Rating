import React from 'react';
import { Search, LayoutDashboard, Home, Menu } from 'lucide-react';

export const Navbar = ({ currentTab, onTabChange }) => {
    const tabs = ['home', 'search', 'dashboard'];

    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: 'var(--surface-color)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
            padding: '0 20px',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Logo / Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/logo1.jpg" alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px'
                }}>
                    One Chess Movement
                </span>
            </div>

            {/* Desktop Nav Items */}
            <div className="nav-items" style={{ display: 'flex', gap: 8 }}>
                {tabs.map((tab) => {
                    const isActive = currentTab === tab;
                    let Icon;
                    let Label;
                    if (tab === 'search') { Icon = Search; Label = 'Search'; }
                    if (tab === 'home') { Icon = Home; Label = 'Home'; }
                    if (tab === 'dashboard') { Icon = LayoutDashboard; Label = 'Admin'; }

                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: isActive ? 'var(--primary-color)' : 'transparent',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            <Icon size={18} />
                            <span className="nav-label">{Label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
