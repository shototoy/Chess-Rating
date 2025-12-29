import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const LoadingScreen = ({ onComplete }) => {
    const [status, setStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const MIN_LOADING_TIME = 2000;

        const initialize = async () => {
            try {
                setStatus('Checking server status...');
                setProgress(10);

                const statusCheck = await fetch(`${API_URL}/status`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (statusCheck.ok) {
                    const { maintenanceMode } = await statusCheck.json();
                    if (maintenanceMode) {
                        setProgress(30);
                        setStatus('High Server Traffic: Unable to establish connection');
                        return; 
                    }
                }
                setStatus('Connecting to server...');
                setProgress(30);

                const healthCheck = await fetch(API_URL.replace('/api', ''), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!healthCheck.ok) {
                    throw new Error('Server unavailable');
                }

                setProgress(30);

                setStatus('Loading announcements...');
                const newsResponse = await fetch(`${API_URL}/news`);
                if (newsResponse.ok) {
                    const newsData = await newsResponse.json();
                    localStorage.setItem('news_cache', JSON.stringify(newsData.data || []));
                }
                setProgress(60);

                setStatus('Loading leaderboard...');
                const playersResponse = await fetch(`${API_URL}/players?limit=50&sortBy=rapid_rating&order=desc`);
                if (playersResponse.ok) {
                    const playersData = await playersResponse.json();
                    const players = playersData.data || [];

                    localStorage.setItem('leaderboard_cache', JSON.stringify(players));
                    const top3 = players.slice(0, 3).map(p => ({
                        id: p.id,
                        firstName: p.first_name,
                        lastName: p.last_name,
                        title: p.title,
                        rapid: p.rapid_rating,
                        bYear: p.birth_year
                    }));
                    localStorage.setItem('top_players_cache', JSON.stringify(top3));
                }
                setProgress(90);
                setStatus('Ready!');
                setProgress(100);
                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

                setTimeout(() => {
                    onComplete();
                }, remainingTime);

            } catch (error) {
                console.error('Initialization error:', error);
                setStatus('Connection failed. Retrying...');
                setTimeout(() => {
                    initialize();
                }, 2000);
            }
        };

        initialize();
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white'
        }}>
            <div style={{
                width: 420,
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32
            }}>
                <img
                    src="/logo.png"
                    alt="Chess Ratings Logo"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        imageRendering: 'crisp-edges'
                    }}
                    loading="eager"
                    decoding="sync"
                />
            </div>

            <div style={{
                width: 280,
                height: 6,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: 16
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: status.includes('High Server Traffic') ? '#ef4444' : 'white',
                    transition: 'width 0.3s ease',
                    borderRadius: 3
                }} />
            </div>


            <p style={{
                fontSize: '1.3rem',
                margin: '0 0 8px 0',
                fontWeight: status.includes('High Server Traffic') ? 700 : 500,
                color: status.includes('High Server Traffic') ? '#ef4444' : 'white',
                opacity: 1,
                letterSpacing: 1,
                textAlign: 'center'
            }}>
                {status}
            </p>
            <p style={{
                fontSize: '0.95rem',
                margin: '0 0 2px 0',
                color: 'white',
                opacity: 0.85,
                textAlign: 'center',
                fontWeight: 600
            }}>
                Powered By: Biyaherong Arbiter
            </p>

            <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, opacity: 0.8 }}>
                    Developed By: NaN Coda
                </span>
            </div>
        </div>
    );
};
