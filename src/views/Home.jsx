import React, { useState, useEffect } from 'react';
import { getPlayers, getNews } from '../services/data';
import { Trophy, TrendingUp, Newspaper, X, Clock, ChevronRight } from 'lucide-react';

export const Home = () => {
    const [topPlayers, setTopPlayers] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        // 1. Fetch Players & Sort
        const players = getPlayers();
        const sorted = [...players].sort((a, b) => b.rapid - a.rapid).slice(0, 3);
        setTopPlayers(sorted);

        // 2. Fetch News from Service
        const news = getNews();
        setNewsList(news);
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
            <h3 style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)' }}>
                <Newspaper size={20} /> Latest News
            </h3>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: 16,
                paddingBottom: 16,
                marginBottom: 20,
                scrollSnapType: 'x mandatory'
            }}>
                {newsList.map(news => (
                    <div
                        key={news.id}
                        className="card"
                        onClick={() => openNews(news)}
                        style={{
                            minWidth: '280px',
                            margin: 0,
                            height: '160px',
                            background: news.gradient,
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
                ))}
            </div>

            {/* Leaderboard */}
            <h3 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-color)' }}>
                <TrendingUp size={20} /> Top Rated Players
            </h3>
            <div className="card" style={{ padding: 0 }}>
                {topPlayers.map((player, index) => (
                    <div key={player.id} className="player-item" style={{ padding: '12px 16px' }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            color: index < 3 ? 'white' : '#666'
                        }}>
                            {index + 1}
                        </div>
                        <div className="player-info">
                            <h3>{player.lastName}, {player.firstName}</h3>
                            <div className="player-meta">{player.title}</div>
                        </div>
                        <div className="rating-badge">
                            <Trophy size={12} style={{ marginRight: 4 }} />
                            {player.rapid}
                        </div>
                    </div>
                ))}
            </div>

            {/* News Details Overlay */}
            {selectedNews && (
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
                        background: selectedNews.gradient,
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
                    </div>

                    {/* Content Body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#666',
                            fontSize: '0.9rem',
                            marginBottom: 16,
                            borderBottom: '1px solid #eee',
                            paddingBottom: 16
                        }}>
                            <Clock size={16} />
                            <span>{selectedNews.date}</span>
                        </div>

                        <h3 style={{ margin: '0 0 16px', fontWeight: 500, color: '#444' }}>
                            {selectedNews.subtitle}
                        </h3>

                        <div style={{ lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
                            {selectedNews.body}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
