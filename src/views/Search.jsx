import React, { useEffect, useRef } from 'react';
import { usePlayerContext } from '../context/PlayerContext';
import { User, Search as SearchIcon, ArrowUpDown } from 'lucide-react';

export const Search = () => {
    const {
        players,
        loading,
        hasMore,
        query,
        sortConfig,
        handleSearch,
        handleSort,
        loadMore
    } = usePlayerContext();

    const observer = useRef();
    const lastPlayerElementRef = useRef();

    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });

        if (lastPlayerElementRef.current) {
            observer.current.observe(lastPlayerElementRef.current);
        }
    }, [loading, hasMore]);

    const handlePlayerClick = (player) => {
        // setSelectedPlayer(player); // Logic for selecting player reserved for dashboard or detailed view
    };

    return (
        <div style={{
            height: 'calc(100vh - 60px - 60px)', // Minus header and nav height
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#f7f9fc'
        }}>

            {/* Top Section: Search Input */}
            <div style={{ padding: 16, paddingBottom: 0, flexShrink: 0 }}>
                <div className="input-group" style={{ position: 'relative', marginBottom: 12 }}>
                    <SearchIcon style={{ position: 'absolute', left: 12, top: 12, color: '#999' }} size={20} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: 40 }}
                        placeholder="Search name or ID..."
                        value={query || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Table Header */}
            <div style={{
                display: 'flex',
                padding: '8px 32px',
                background: '#e0e6ed',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#555',
                borderBottom: '1px solid #ccc'
            }}>
                <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                >
                    Name <ArrowUpDown size={14} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'name' ? 1 : 0.3,
                        color: sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
                <div
                    style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                    onClick={() => handleSort('rapid')}
                >
                    Score <ArrowUpDown size={14} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'rapid' ? 1 : 0.3,
                        color: sortConfig.key === 'rapid' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
            </div>

            {/* Scrollable List */}
            <div className="card" style={{
                flex: 1,
                overflowY: 'auto',
                margin: 0,
                borderRadius: 0,
                boxShadow: 'none',
                padding: 0
            }}>
                {players.length === 0 && !loading ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No players found.
                    </div>
                ) : (
                    <div>
                        {players.map((player, index) => {
                            if (players.length === index + 1) {
                                return (
                                    <div
                                        ref={lastPlayerElementRef}
                                        key={player.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 16px',
                                            borderBottom: '1px solid #f0f0f0',
                                            cursor: 'pointer',
                                            background: 'white'
                                        }}
                                    >
                                        <div className="player-info" style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{player.lastName}, {player.firstName}</h3>
                                        </div>
                                        <div style={{
                                            width: 60,
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            color: 'var(--primary-color)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {player.rapid}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={player.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 16px',
                                            borderBottom: '1px solid #f0f0f0',
                                            cursor: 'pointer',
                                            background: 'white'
                                        }}
                                    >
                                        <div className="player-info" style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{player.lastName}, {player.firstName}</h3>
                                        </div>
                                        <div style={{
                                            width: 60,
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            color: 'var(--primary-color)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {player.rapid}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        {loading && (
                            <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>Loading...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
