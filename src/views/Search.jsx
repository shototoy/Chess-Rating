import React, { useState } from 'react';
import { usePlayerContext } from '../context/PlayerContext';
import { User, Search as SearchIcon, ArrowUpDown, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

export const Search = () => {
    const {
        players,
        loading,
        hasMore,
        query,
        sortConfig,
        page,
        handleSearch,
        handleSort,
        goToPage,
        totalPages
    } = usePlayerContext();

    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handlePlayerClick = (player) => {
        setSelectedPlayer(player);
    };

    return (
        <div className="search-layout">
            {/* Left Column: Profile Card */}
            <div className="search-sidebar">
                <div className="card" style={{
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'sticky',
                    top: 0
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
                        <div style={{
                            width: 100, height: 100,
                            background: 'var(--bg-color)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            border: '4px solid white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <User size={48} color={selectedPlayer ? "var(--primary-color)" : "#ccc"} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: selectedPlayer ? 'var(--text-primary)' : '#ccc' }}>
                                {selectedPlayer ? `${selectedPlayer.firstName} ${selectedPlayer.lastName}` : 'Select Player'}
                            </h2>
                            <span style={{
                                background: selectedPlayer ? 'var(--bg-color)' : '#f1f5f9',
                                color: selectedPlayer ? 'var(--text-secondary)' : '#ccc',
                                padding: '4px 12px',
                                borderRadius: 16,
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                {selectedPlayer ? (selectedPlayer.title || 'No Title') : 'Details will appear here'}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 24 }}>
                        <div style={{ background: 'var(--bg-color)', padding: '12px 4px', borderRadius: 10, textAlign: 'center', border: '1px solid #e2e8f0', opacity: 0.7 }}>
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', display: 'block', marginBottom: 4, fontWeight: 700 }}>STANDARD</small>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: selectedPlayer ? 'var(--text-primary)' : '#e0e0e0' }}>
                                ----
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-color)', padding: '12px 4px', borderRadius: 10, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <small style={{ color: 'var(--primary-color)', fontSize: '0.65rem', display: 'block', marginBottom: 4, fontWeight: 700 }}>RAPID</small>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: selectedPlayer ? 'var(--primary-color)' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.rapid : '----'}
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-color)', padding: '12px 4px', borderRadius: 10, textAlign: 'center', border: '1px solid #e2e8f0', opacity: 0.7 }}>
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', display: 'block', marginBottom: 4, fontWeight: 700 }}>BLITZ</small>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: selectedPlayer ? 'var(--text-primary)' : '#e0e0e0' }}>
                                ----
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                        <div style={{ background: 'var(--bg-color)', padding: '8px', borderRadius: 10, textAlign: 'center' }}>
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', display: 'block', marginBottom: 4 }}>FIDE ID</small>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedPlayer ? 'var(--text-primary)' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.id : '----'}
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-color)', padding: '8px', borderRadius: 10, textAlign: 'center' }}>
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', display: 'block', marginBottom: 4 }}>BORN</small>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedPlayer ? 'var(--text-primary)' : '#e0e0e0' }}>
                                {selectedPlayer ? selectedPlayer.bYear : '----'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Search & List */}
            <div className="search-main">
                {/* Header: Input & Filters */}
                <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', background: 'white', zIndex: 10 }}>
                    <div className="input-group" style={{ position: 'relative', marginBottom: 0 }}>
                        <SearchIcon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input
                            type="text"
                            className="input-field"
                            style={{ paddingLeft: 48, height: '48px', borderRadius: '24px', background: '#f8fafc' }}
                            placeholder="Search by name, ID or title..."
                            value={query || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Column Headers */}
                <div style={{
                    display: 'flex',
                    padding: '12px 24px',
                    background: '#f8fafc',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    <div
                        style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => handleSort('name')}
                    >
                        Player Details <ArrowUpDown size={14} style={{
                            marginLeft: 4,
                            opacity: sortConfig.key === 'name' ? 1 : 0.3,
                            color: sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                        }} />
                    </div>
                    <div
                        style={{ width: 90, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                        onClick={() => handleSort('standard')}
                    >
                        Standard <ArrowUpDown size={14} style={{
                            marginLeft: 4,
                            opacity: sortConfig.key === 'standard' ? 1 : 0.3,
                            color: sortConfig.key === 'standard' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                        }} />
                    </div>
                    <div
                        style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                        onClick={() => handleSort('rapid')}
                    >
                        Rapid <ArrowUpDown size={14} style={{
                            marginLeft: 4,
                            opacity: sortConfig.key === 'rapid' ? 1 : 0.3,
                            color: sortConfig.key === 'rapid' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                        }} />
                    </div>
                    <div
                        style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
                        onClick={() => handleSort('blitz')}
                    >
                        Blitz <ArrowUpDown size={14} style={{
                            marginLeft: 4,
                            opacity: sortConfig.key === 'blitz' ? 1 : 0.3,
                            color: sortConfig.key === 'blitz' ? (sortConfig.direction === 'asc' ? '#22c55e' : '#ef4444') : 'inherit'
                        }} />
                    </div>
                </div>

                {/* List Container */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading && players.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                            Loading players...
                        </div>
                    ) : players.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                            No players found matching your criteria.
                        </div>
                    ) : (
                        <div>
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    onClick={() => handlePlayerClick(player)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 24px',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        background: selectedPlayer?.id === player.id ? 'var(--bg-color)' : 'white',
                                        transition: 'background 0.2s',
                                        borderLeft: selectedPlayer?.id === player.id ? '4px solid var(--primary-color)' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                            {player.lastName}, {player.firstName}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                            {player.title && <span style={{ background: '#e2e8f0', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem' }}>{player.title}</span>}
                                            <span>ID: {player.id}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: 90,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        opacity: 0.5
                                    }}>
                                        -
                                    </div>
                                    <div style={{
                                        width: 80,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        color: 'var(--primary-color)',
                                        fontWeight: 700,
                                        fontSize: '0.95rem'
                                    }}>
                                        <Trophy size={14} style={{ marginRight: 4, opacity: 0.5 }} />
                                        {player.rapid}
                                    </div>
                                    <div style={{
                                        width: 80,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        opacity: 0.5
                                    }}>
                                        -
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                <div style={{
                    padding: '12px 24px',
                    borderTop: '1px solid var(--border-color)',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <button
                        className="btn"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1 || loading}
                        style={{
                            padding: '8px 16px',
                            background: page === 1 ? '#f1f5f9' : 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            color: page === 1 ? '#ccc' : 'var(--text-primary)',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: 'auto',
                            fontSize: '0.9rem'
                        }}
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>

                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Page {page} / {totalPages || 1}
                    </span>

                    <button
                        className="btn"
                        onClick={() => goToPage(page + 1)}
                        disabled={!hasMore || loading}
                        style={{
                            padding: '8px 16px',
                            background: !hasMore ? '#f1f5f9' : 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            color: !hasMore ? '#ccc' : 'var(--text-primary)',
                            cursor: !hasMore ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: 'auto',
                            fontSize: '0.9rem'
                        }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
