import React, { useState, useEffect } from 'react';
import { getPlayers } from '../services/data';
import { Trophy, TrendingUp, Newspaper } from 'lucide-react';

export const Home = () => {
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {
        const players = getPlayers();
        // Sort by rating desc and take top 5
        const sorted = [...players].sort((a, b) => b.rapid - a.rapid).slice(0, 3);
        setTopPlayers(sorted);
    }, []);

    return (
        <div className="container">
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
                {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{
                        minWidth: '280px',
                        margin: 0,
                        height: '160px',
                        background: `linear-gradient(135deg, var(--primary-color), var(--primary-dark))`,
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        scrollSnapAlign: 'start'
                    }}>
                        <div style={{ padding: 8 }}>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10 }}>
                                Tournament Update
                            </span>
                            <h4 style={{ margin: '8px 0 0' }}>Grand Prix 2025: Round {i} Results</h4>
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
        </div>
    );
};
