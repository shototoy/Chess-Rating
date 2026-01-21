import React, { useState, useEffect } from 'react';
import { getPlayers, getNews } from '../services/data';
import { Trophy, TrendingUp, Newspaper, X, Clock, ChevronRight } from 'lucide-react';

export const Home = () => {
    const [topPlayers, setTopPlayers] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            const NEWS_CACHE_KEY = 'news_cache';
            const PLAYERS_CACHE_KEY = 'top_players_cache';


            try {
                const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
                if (cachedNews) {
                    setNewsList(JSON.parse(cachedNews));
                }
            } catch (e) {
                console.warn('News cache error:', e);
            }

            try {
                const cachedPlayers = localStorage.getItem(PLAYERS_CACHE_KEY);
                if (cachedPlayers) {
                    setTopPlayers(JSON.parse(cachedPlayers));
                }
            } catch (e) {
                console.warn('Players cache error:', e);
            }


            try {
                const news = await getNews();
                const newsString = JSON.stringify(news);
                const cachedNewsString = localStorage.getItem(NEWS_CACHE_KEY);

                if (newsString !== cachedNewsString) {
                    setNewsList(news);
                    localStorage.setItem(NEWS_CACHE_KEY, newsString);
                }
            } catch (e) {
                console.error('Failed to fetch news:', e);
            }

            try {
                const result = await getPlayers();
                const players = result.players || [];
                const sorted = [...players].sort((a, b) => b.rapid - a.rapid).slice(0, 3);
                const playersString = JSON.stringify(sorted);
                const cachedPlayersString = localStorage.getItem(PLAYERS_CACHE_KEY);

                if (playersString !== cachedPlayersString) {
                    setTopPlayers(sorted);
                    localStorage.setItem(PLAYERS_CACHE_KEY, playersString);
                }
            } catch (e) {
                console.error('Failed to fetch players:', e);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Test Redis connection on load
        import('../services/data').then(({ testRedis }) => {
            testRedis().then(result => {
                console.log('Redis test result:', result);
            });
        });
    }, []);

    const openNews = (news) => {
        setSelectedNews(news);
    };

    const closeNews = () => {
        setSelectedNews(null);
    };

    return (
        <div style={{ position: 'relative' }}>

            <div style={{
                width: '100%',
                height: '240px',
                marginBottom: '32px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(197, 90, 32, 0.4)'
            }}>
                <img src="/banner1.jpg" alt="One Chess Movement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '80px',
                    background: 'linear-gradient(to top, rgba(197, 90, 32, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
                    pointerEvents: 'none'
                }}>
                </div>
            </div>

            <div className="home-layout">
                {/* News Section */}
                <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: '0px 0px 16px 0px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                        <Newspaper size={24} /> Latest News
                    </h3>

                    <div className="news-scroll-container" style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 16,
                        paddingBottom: 4,
                        marginBottom: 30,
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-x'
                    }}>
                        {newsList.map(news => {
                            let gradient;
                            if (news.category === 'Tournament') {
                                gradient = 'linear-gradient(135deg, var(--primary-color), var(--primary-light))';
                            } else if (news.category === 'App Changelog') {
                                gradient = 'linear-gradient(135deg, #64748b, #475569)';
                            } else {
                                gradient = 'linear-gradient(135deg, #059669, #047857)';
                            }

                            return (
                                <div
                                    key={news.id}
                                    className="card news-card"
                                    onClick={() => openNews(news)}
                                    style={{
                                        minWidth: '280px',
                                        height: '220px',
                                        background: gradient,
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        scrollSnapAlign: 'start',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: 'none',
                                        margin: 0
                                    }}
                                >

                                    <div style={{
                                        position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%'
                                    }} />

                                    <div style={{ padding: 4, position: 'relative', zIndex: 1 }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            padding: '4px 10px',
                                            borderRadius: 20,
                                            display: 'inline-block',
                                            marginBottom: 12,
                                            fontWeight: 600
                                        }}>
                                            {news.category}
                                        </span>
                                        <h4 style={{ margin: '0', fontSize: '1.25rem', lineHeight: '1.3', fontWeight: 700 }}>
                                            {news.title}
                                        </h4>
                                        <p style={{ margin: '8px 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                                            {news.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Players Section */}
                <div>
                    <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                        <TrendingUp size={24} /> Top Rated Players
                    </h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {topPlayers.map((player, index) => (
                            <div key={player.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px',
                                borderBottom: index < topPlayers.length - 1 ? '1px solid var(--border-color)' : 'none',
                                transition: 'background 0.2s',
                                cursor: 'default'
                            }}>

                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: index === 0 ? 'var(--accent-color)' : index === 1 ? '#94a3b8' : '#b45309', // Specific medal colors kep as is unless we want variables
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    color: 'white',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {index + 1}
                                </div>


                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--text-primary)',
                                        marginBottom: 4,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {player.lastName}, {player.firstName}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6
                                    }}>
                                        {player.title && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{player.title}</span>}
                                        <span>ID: {player.id}</span>
                                    </div>
                                </div>


                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    background: 'var(--primary-color)',
                                    padding: '6px 12px',
                                    borderRadius: 20,
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    flexShrink: 0
                                }}>
                                    <Trophy size={14} />
                                    {player.rapid}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* News Modal (unchanged logic, just style tweaks if needed) */}
            {selectedNews && (() => {
                let gradient;
                if (selectedNews.category === 'Tournament') {
                    gradient = 'linear-gradient(135deg, var(--primary-color), var(--primary-light))';
                } else if (selectedNews.category === 'App Changelog') {
                    gradient = 'linear-gradient(135deg, #64748b, #475569)';
                } else {
                    gradient = 'linear-gradient(135deg, #059669, #047857)';
                }

                return (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 1000,
                        background: 'rgba(255,255,255,1)',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideUp 0.3s ease-out'
                    }}>

                        <div style={{
                            height: 'auto',
                            minHeight: '200px',
                            background: gradient,
                            color: 'white',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '60px 20px 20px 20px'
                        }}>
                            <button
                                onClick={closeNews}
                                style={{
                                    position: 'absolute', top: 20, right: 20,
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <X size={24} />
                            </button>

                            <span style={{
                                fontSize: '0.85rem',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '4px 12px',
                                borderRadius: 20,
                                alignSelf: 'flex-start',
                                marginBottom: 12,
                                backdropFilter: 'blur(4px)',
                                fontWeight: 600
                            }}>
                                {selectedNews.category}
                            </span>
                            <h1 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.2, fontWeight: 800 }}>
                                {selectedNews.title}
                            </h1>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '0.9rem',
                                marginTop: 12
                            }}>
                                <Clock size={16} />
                                <span>{selectedNews.date || 'Just now'}</span>
                            </div>
                        </div>


                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px', width: '100%' }}>
                            <h3 style={{ margin: '0 0 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.4 }}>
                                {selectedNews.subtitle}
                            </h3>

                            <div
                                style={{ lineHeight: 1.3, color: 'var(--text-primary)', fontSize: '1.05rem' }}
                                dangerouslySetInnerHTML={{ __html: selectedNews.body }}
                            />
                        </div>
                    </div>
                );
            })()}

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};
