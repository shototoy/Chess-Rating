import React, { useEffect, useRef, useState } from 'react';
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

    const [selectedPlayer, setSelectedPlayer] = useState(null);
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
        setSelectedPlayer(player);
    };

    return (
        <div style={{
            height: 'calc(100vh - 60px - 60px)', // Minus header and nav height
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#f7f9fc'
        }}>

            {/* Top Section: Search Input + Details */}
            <div style={{ padding: 16, paddingBottom: 0, flexShrink: 0 }}>
                {/* Details Container */}
                <div className="card" style={{
                    background: 'white',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid #eee',
                    marginBottom: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 60, height: 60,
                            background: '#eef2f7',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <User size={30} color={selectedPlayer ? "var(--primary-color)" : "#ccc"} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: selectedPlayer ? '#333' : '#ccc' }}>
                                {selectedPlayer ? `${selectedPlayer.firstName} ${selectedPlayer.lastName}` : 'Select Player'}
                            </h2>
                            <div style={{ color: selectedPlayer ? 'var(--text-secondary)' : '#eee', marginTop: 4 }}>
                                {selectedPlayer ? selectedPlayer.title : 'Details will appear here'}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
                        <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6 }}>
                            <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>FIDE ID</small>
                            <div style={{ fontWeight: 600, color: selectedPlayer ? '#333' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.id : '----'}
                            </div>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6 }}>
                            <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>Rapid</small>
                            <div style={{ fontWeight: 600, color: selectedPlayer ? 'var(--primary-color)' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.rapid : '----'}
                            </div>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6 }}>
                            <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>Born</small>
                            <div style={{ fontWeight: 600, color: selectedPlayer ? '#333' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.bYear : '----'}
                            </div>
                        </div>
                    </div>
                </div>

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
                                        onClick={() => handlePlayerClick(player)}
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
                                        onClick={() => handlePlayerClick(player)}
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
