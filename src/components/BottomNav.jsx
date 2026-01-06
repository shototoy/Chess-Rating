import React from 'react';
import { Search, LayoutDashboard, Home } from 'lucide-react';

export const BottomNav = ({ currentTab, onTabChange, style }) => {
    const tabs = ['search', 'home', 'dashboard'];
    const activeIndex = tabs.indexOf(currentTab);

    return (
        <nav className="bottom-nav" style={{
            ...style,
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            display: 'flex',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border-color)',
            height: 'var(--nav-height)',
            zIndex: 50,
            overflow: 'visible'
        }}>
            {/* Sliding Fluid Background that Jumps Up for Home */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '33.333%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translateX(${activeIndex * 100}%) translateY(${currentTab === 'home' ? '-24px' : '0'})`,
                    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' // Account for bottom padding in alignment
                }}
            >
                <div style={{
                    width: currentTab === 'home' ? 56 : '92%',
                    height: currentTab === 'home' ? 56 : 44,
                    borderRadius: currentTab === 'home' ? '50%' : '12px',
                    background: 'var(--primary-color)',
                    boxShadow: '0 4px 12px rgba(31, 69, 110, 0.3)',
                    transition: 'all 0.3s ease'
                }}></div>
            </div>

            {/* Nav Items */}
            {tabs.map((tab) => {
                const isActive = currentTab === tab;
                const isHome = tab === 'home';
                let Icon;
                if (tab === 'search') Icon = Search;
                if (tab === 'home') Icon = Home;
                if (tab === 'dashboard') Icon = LayoutDashboard;

                return (
                    <div
                        key={tab}
                        className="nav-item"
                        onClick={() => onTabChange(tab)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1,
                            background: 'transparent',
                            height: '100%'
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: isHome && !isActive ? '#f8f9fa' : 'transparent',
                            border: isHome ? '4px solid #fff' : 'none',
                            boxShadow: isHome ? '0 -4px 12px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.3s ease',
                            transform: isHome ? 'translateY(-24px)' : 'none'
                        }}>
                            <Icon
                                size={isHome ? 30 : 28}
                                color={isActive ? 'white' : '#94a3b8'}
                                strokeWidth={isActive ? 2.5 : 2}
                                style={{
                                    transition: 'color 0.3s ease',
                                    zIndex: 2,
                                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </nav>
    );
};

