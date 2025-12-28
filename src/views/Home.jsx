import React, { useState, useEffect } from 'react';
import { getPlayers, getNews } from '../services/data';
import { Trophy, TrendingUp, Newspaper, X, Clock, ChevronRight } from 'lucide-react';

export const Home = () => {
    const [topPlayers, setTopPlayers] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // 1. News Config (Prioritized)
            const NEWS_CACHE_KEY = 'news_cache';
            const PLAYERS_CACHE_KEY = 'top_players_cache';

            // Load from cache immediately (synchronous)
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

            // Fetch fresh data in background and only update if changed
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
                const players = await getPlayers();
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

    const openNews = (news) => {
        setSelectedNews(news);
    };

    const closeNews = () => {
        setSelectedNews(null);
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            {/* News Carousel */}
            <h3 style={{ margin: '0px 0px 10px 0px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)' }}>
                <Newspaper size={20} /> Latest News
            </h3>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: 16,
                paddingBottom: 16,
                marginBottom: 30,
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x'
            }}>
                {newsList.map(news => {
                    // Generate gradient based on category
                    let gradient;
                    if (news.category === 'Tournament') {
                        gradient = 'linear-gradient(135deg, #007bff, #0056b3)'; // Blue
                    } else if (news.category === 'App Changelog') {
                        gradient = 'linear-gradient(135deg, #6c757d, #495057)'; // Grey
                    } else { // Community
                        gradient = 'linear-gradient(135deg, #28a745, #1e7e34)'; // Green
                    }

                    return (
                        <div
                            key={news.id}
                            className="card"
                            onClick={() => openNews(news)}
                            style={{
                                minWidth: '280px',
                                margin: 0,
                                height: '200px',
                                background: gradient,
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                scrollSnapAlign: 'start',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative Shine */}
                            <div style={{
                                position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                            }} />

                            <div style={{ padding: 12, position: 'relative', zIndex: 1 }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    display: 'inline-block',
                                    marginBottom: 8
                                }}>
                                    {news.category}
                                </span>
                                <h4 style={{ margin: '0', fontSize: '1.1rem', lineHeight: '1.3', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                    {news.title}
                                </h4>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leaderboard */}
            <h3 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)' }}>
                <TrendingUp size={20} /> Top Rated Players
            </h3>
            <div className="card" style={{ padding: 0 }}>
                {topPlayers.map((player, index) => (
                    <div key={player.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: index < topPlayers.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                        {/* Rank Badge */}
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            color: 'white',
                            flexShrink: 0
                        }}>
                            {index + 1}
                        </div>

                        {/* Player Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: '#333',
                                marginBottom: 2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {player.lastName}, {player.firstName}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#999',
                                fontWeight: 500
                            }}>
                                {player.title}
                            </div>
                        </div>

                        {/* Rating Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#e8f4fd',
                            padding: '6px 12px',
                            borderRadius: 20,
                            color: 'var(--primary-color)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            flexShrink: 0
                        }}>
                            <Trophy size={14} />
                            {player.rapid}
                        </div>
                    </div>
                ))}
            </div>

            {/* News Details Overlay */}
            {selectedNews && (() => {
                // Generate gradient based on category
                let gradient;
                if (selectedNews.category === 'Tournament') {
                    gradient = 'linear-gradient(135deg, #007bff, #0056b3)'; // Blue
                } else if (selectedNews.category === 'App Changelog') {
                    gradient = 'linear-gradient(135deg, #6c757d, #495057)'; // Grey
                } else { // Community
                    gradient = 'linear-gradient(135deg, #28a745, #1e7e34)'; // Green
                }

                return (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 1000,
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Overlay Header / Banner */}
                        <div style={{
                            height: '240px',
                            background: gradient,
                            color: 'white',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: 20
                        }}>
                            <button
                                onClick={closeNews}
                                style={{
                                    position: 'absolute', top: 16, right: 16,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 36, height: 36,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                <X size={20} />
                            </button>

                            <span style={{
                                fontSize: '0.8rem',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '4px 10px',
                                borderRadius: 20,
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                                backdropFilter: 'blur(4px)'
                            }}>
                                {selectedNews.category}
                            </span>
                            <h1 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                {selectedNews.title}
                            </h1>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.85rem',
                                marginTop: 8
                            }}>
                                <Clock size={14} />
                                <span>{selectedNews.date}</span>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>


                            <h3 style={{ margin: '0 0 16px', fontWeight: 500, color: '#444' }}>
                                {selectedNews.subtitle}
                            </h3>

                            <div
                                style={{ lineHeight: 1.6, color: '#333' }}
                                dangerouslySetInnerHTML={{ __html: selectedNews.body }}
                            />
                        </div>
                    </div>
                );
            })()}

            < style > {`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
        </div >
    );
};
