import React, { useState, useRef } from 'react';
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
    const listRef = useRef(null);

    const handlePlayerClick = (player) => {
        setSelectedPlayer(player);
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Load more when scrolled near bottom
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
            loadMore();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 13vh - 8px)', overflow: 'hidden' }}>
            {/* Compact Profile Card */}
            <div style={{
                background: 'white',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                zIndex: 10
            }}>
                <div style={{
                    width: 50, height: 50,
                    background: 'var(--bg-color)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #e2e8f0',
                    flexShrink: 0
                }}>
                    <User size={24} color={selectedPlayer ? "var(--primary-color)" : "#ccc"} />
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1rem',
                        color: selectedPlayer ? 'var(--text-primary)' : '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {selectedPlayer ? `${selectedPlayer.lastName}, ${selectedPlayer.firstName}` : 'Select Player'}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: selectedPlayer ? 'var(--text-secondary)' : '#cbd5e1' }}>
                        {selectedPlayer ? (selectedPlayer.title ? `${selectedPlayer.title} • ID: ${selectedPlayer.id}` : `ID: ${selectedPlayer.id}`) : 'Tap a player to view details'}
                    </span>
                </div>

                {/* Ratings - Compact Grid */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: 2 }}>STD</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedPlayer ? 'var(--primary-color)' : '#e2e8f0' }}>{selectedPlayer ? (selectedPlayer.standard || '---') : '---'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: 2 }}>RAPID</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedPlayer ? 'var(--primary-color)' : '#e2e8f0' }}>
                            {selectedPlayer ? selectedPlayer.rapid : '---'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: 2 }}>BLTZ</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedPlayer ? 'var(--primary-color)' : '#e2e8f0' }}>{selectedPlayer ? (selectedPlayer.blitz || '---') : '---'}</div>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div style={{ padding: '12px 16px', background: 'white', flexShrink: 0 }}>
                <div className="input-group" style={{ position: 'relative', marginBottom: 0 }}>
                    <SearchIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: 40, height: '40px', borderRadius: '20px', background: '#f1f5f9', fontSize: '0.9rem', border: 'none' }}
                        placeholder="Search by name, ID or title..."
                        value={query || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List Headers */}
            <div style={{
                display: 'flex',
                padding: '8px 16px',
                background: '#f8fafc',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                flexShrink: 0
            }}>
                <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                >
                    Player <ArrowUpDown size={12} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'name' ? 1 : 0.3,
                        color: sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
                <div
                    style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                    onClick={() => handleSort('standard')}
                >
                    Std <ArrowUpDown size={12} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'standard' ? 1 : 0.3,
                        color: sortConfig.key === 'standard' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
                <div
                    style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                    onClick={() => handleSort('rapid')}
                >
                    Rapid <ArrowUpDown size={12} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'rapid' ? 1 : 0.3,
                        color: sortConfig.key === 'rapid' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
                <div
                    style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                    onClick={() => handleSort('blitz')}
                >
                    Blitz <ArrowUpDown size={12} style={{
                        marginLeft: 4,
                        opacity: sortConfig.key === 'blitz' ? 1 : 0.3,
                        color: sortConfig.key === 'blitz' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                    }} />
                </div>
            </div>

            {/* Scrollable Player List */}
            <div
                ref={listRef}
                style={{ flex: 1, overflowY: 'auto', background: 'white' }}
                onScroll={handleScroll}
            >
                {players.length === 0 && !loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                        No players found.
                    </div>
                ) : (
                    players.map((player) => (
                        <div
                            key={player.id}
                            onClick={() => handlePlayerClick(player)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 16px',
                                borderBottom: '1px solid #f1f5f9',
                                cursor: 'pointer',
                                background: selectedPlayer?.id === player.id ? '#f0f9ff' : 'white',
                                borderLeft: selectedPlayer?.id === player.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                                transition: 'background 0.1s'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    {player.lastName}, {player.firstName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {player.title && <span style={{ background: '#e2e8f0', padding: '0 4px', borderRadius: 4, fontSize: '0.7rem' }}>{player.title}</span>}
                                    <span style={{ fontFamily: 'monospace' }}>{player.id}</span>
                                </div>
                            </div>
                            <div style={{ width: 60, textAlign: 'right', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 700 }}>{player.standard || '-'}</div>
                            <div style={{ width: 60, textAlign: 'right', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 700 }}>{player.rapid}</div>
                            <div style={{ width: 60, textAlign: 'right', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 700 }}>{player.blitz || '-'}</div>
                        </div>
                    ))
                )}
                {loading && (
                    <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {players.length > 0 ? 'Loading more players...' : 'Loading...'}
                    </div>
                )}
                {/* Space for bottom nav */}
                <div style={{ height: 80 }} />
            </div>
        </div>
    );
};
