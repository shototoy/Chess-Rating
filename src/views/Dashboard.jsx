import React, { useState } from 'react';
import { LogIn, Plus, TrendingUp, Search as SearchIcon, Save, X, Megaphone, UserPlus, User } from 'lucide-react';
import { searchPlayers, updatePlayer, addPlayer, addNews } from '../services/data';

export const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Dashboard State
    const [activeModal, setActiveModal] = useState(null); // 'addUser' | 'addNews' | null
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownResults, setDropdownResults] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Inputs
    const [formData, setFormData] = useState({});
    const [newsData, setNewsData] = useState({ title: '', subtitle: '', category: 'General', gradientStart: '#007bff', gradientEnd: '#0056b3', body: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') setIsAuthenticated(true);
        else alert('Incorrect password');
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.length > 0) {
            setDropdownResults(searchPlayers(val));
        } else {
            setDropdownResults([]);
        }
    };

    const selectPlayer = (player) => {
        setSelectedPlayer(player);
        setFormData({ ...player });
        setSearchQuery('');
        setDropdownResults([]);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const savePlayerChanges = () => {
        if (!selectedPlayer) return;
        const updated = {
            ...formData,
            rapid: parseInt(formData.rapid),
            bYear: parseInt(formData.bYear)
        };
        updatePlayer(updated);
        setSelectedPlayer(updated);
        alert('Player updated successfully!');
    };

    const submitNewPlayer = (e) => {
        e.preventDefault();
        const newPlayer = {
            id: formData.id,
            lastName: formData.lastName,
            firstName: formData.firstName,
            title: formData.title,
            rapid: parseInt(formData.rapid),
            bYear: parseInt(formData.bYear)
        };
        addPlayer(newPlayer);
        setActiveModal(null);
        setFormData({});
        alert('Player added!');
    };

    const submitNews = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            title: newsData.title,
            subtitle: newsData.subtitle,
            date: new Date().toLocaleDateString() + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: newsData.category,
            gradient: `linear-gradient(135deg, ${newsData.gradientStart}, ${newsData.gradientEnd})`,
            body: newsData.body
        };
        addNews(newItem);
        setActiveModal(null);
        setNewsData({ title: '', subtitle: '', category: 'General', gradientStart: '#007bff', gradientEnd: '#0056b3', body: '' });
        alert('Announcement posted!');
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ background: '#eef2f7', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <LogIn size={40} color="var(--primary-color)" />
                    </div>
                    <h2 style={{ marginBottom: 8 }}>Admin Access</h2>
                    <p style={{ color: '#666', marginBottom: 24 }}>Enter password to manage database</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            style={{ marginBottom: 16, textAlign: 'center' }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            height: 'calc(100vh - 60px - 60px)', // Strict height: Viewport - Header - Footer
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            overflow: 'hidden', // Prevent page scroll
            background: 'var(--bg-color)'
        }}>

            {/* Top 30%: Action Buttons */}
            <div style={{
                height: '30%',
                display: 'flex',
                gap: 16,
                paddingBottom: 16,
                flexShrink: 0
            }}>
                <div
                    className="card"
                    onClick={() => { setActiveModal('addUser'); setFormData({}); }}
                    style={{
                        flex: 1,
                        height: '100%', // Fill container
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: 'var(--primary-color)',
                        color: 'white',
                        margin: 0,
                        padding: 0
                    }}
                >
                    <UserPlus size={28} style={{ marginBottom: 8 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Add User</span>
                </div>

                <div
                    className="card"
                    onClick={() => { setActiveModal('addNews'); }}
                    style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: '#6610f2',
                        color: 'white',
                        margin: 0,
                        padding: 0
                    }}
                >
                    <Megaphone size={28} style={{ marginBottom: 8 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Add News</span>
                </div>
            </div>

            {/* Middle 15%: Search */}
            <div style={{
                height: '15%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 20, // Higher than profile
                paddingBottom: 16,
                flexShrink: 0
            }}>
                <div style={{ width: '100%', position: 'relative' }}>
                    <SearchIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: 40, height: 48 }}
                        placeholder="Search to edit..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    {/* Dropdown Results */}
                    {dropdownResults.length > 0 && (
                        <div className="card" style={{
                            position: 'absolute',
                            top: '100%', left: 0, right: 0,
                            marginTop: 4,
                            maxHeight: 200,
                            overflowY: 'auto',
                            padding: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 30
                        }}>
                            {dropdownResults.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => selectPlayer(p)}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #eee', cursor: 'pointer', background: 'white' }}
                                >
                                    <div style={{ fontWeight: 600 }}>{p.lastName}, {p.firstName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.title} • ID: {p.id}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom: Editable Profile (Matches Search View Style) */}
            <div className="card" style={{
                flex: 1, // Rest of the height
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '16px',
                opacity: selectedPlayer ? 1 : 0.6,
                pointerEvents: selectedPlayer ? 'auto' : 'none',
                overflowY: 'auto',
                border: '1px solid #eee'
            }}>
                {!selectedPlayer ? (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <SearchIcon size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>Select a player to edit</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                            <div style={{
                                width: 50, height: 50,
                                background: '#eef2f7',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <User size={24} color="var(--primary-color)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <input
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleEditChange}
                                            placeholder="First"
                                            className="input-field"
                                            style={{ padding: '4px 8px', fontSize: '1rem', flex: 1 }}
                                        />
                                        <input
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleEditChange}
                                            placeholder="Last"
                                            className="input-field"
                                            style={{ padding: '4px 8px', fontSize: '1rem', fontWeight: 600, flex: 1 }}
                                        />
                                    </div>
                                    <input
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleEditChange}
                                        className="input-field"
                                        style={{ padding: '2px 8px', fontSize: '0.8rem', color: '#666', width: 60 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3-Column Stats Grid (Like Search) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                            <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6 }}>
                                <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>FIDE ID</small>
                                <input
                                    className="input-field"
                                    name="id"
                                    value={formData.id || ''}
                                    onChange={handleEditChange}
                                    style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 600, color: '#333', fontSize: '1rem', width: '100%' }}
                                />
                            </div>
                            <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6, border: '1px solid var(--primary-color)' }}>
                                <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>Rapid</small>
                                <input
                                    className="input-field"
                                    type="number"
                                    name="rapid"
                                    value={formData.rapid || ''}
                                    onChange={handleEditChange}
                                    style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1rem', width: '100%' }}
                                />
                            </div>
                            <div style={{ background: '#f8f9fa', padding: 8, borderRadius: 6 }}>
                                <small style={{ color: '#999', fontSize: '0.65rem', display: 'block' }}>Born</small>
                                <input
                                    className="input-field"
                                    type="number"
                                    name="bYear"
                                    value={formData.bYear || ''}
                                    onChange={handleEditChange}
                                    style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 600, color: '#333', fontSize: '1rem', width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setSelectedPlayer(null)}
                                className="btn-secondary"
                                style={{ flex: 1, borderRadius: 20, padding: 10, border: 'none', background: '#eee', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePlayerChanges}
                                className="btn-primary"
                                style={{ flex: 2, padding: 10, borderRadius: 20 }}
                            >
                                <Save size={16} style={{ marginRight: 6 }} /> Save
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {activeModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 400, maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0 }}>{activeModal === 'addUser' ? 'Add New Player' : 'Post Announcement'}</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setActiveModal(null)} />
                        </div>

                        {activeModal === 'addUser' ? (
                            <form onSubmit={submitNewPlayer}>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <input className="input-field" placeholder="ID" name="id" onChange={(e) => setFormData({ ...formData, id: e.target.value })} required />
                                    <input className="input-field" placeholder="First Name" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                                    <input className="input-field" placeholder="Last Name" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                                    <select className="input-field" name="title" onChange={(e) => setFormData({ ...formData, title: e.target.value })}>
                                        <option value="">No Title</option>
                                        <option value="GM">GM</option>
                                        <option value="IM">IM</option>
                                        <option value="FM">FM</option>
                                        <option value="CM">CM</option>
                                    </select>
                                    <input className="input-field" type="number" placeholder="Rapid Rating" name="rapid" onChange={(e) => setFormData({ ...formData, rapid: e.target.value })} required />
                                    <input className="input-field" type="number" placeholder="Birth Year" name="bYear" onChange={(e) => setFormData({ ...formData, bYear: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 20 }}>Create User</button>
                            </form>
                        ) : (
                            <form onSubmit={submitNews}>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <label className="label">Headline</label>
                                    <input className="input-field" value={newsData.title} onChange={e => setNewsData({ ...newsData, title: e.target.value })} required />

                                    <label className="label">Subtitle</label>
                                    <input className="input-field" value={newsData.subtitle} onChange={e => setNewsData({ ...newsData, subtitle: e.target.value })} required />

                                    <label className="label">Category</label>
                                    <select className="input-field" value={newsData.category} onChange={e => setNewsData({ ...newsData, category: e.target.value })}>
                                        <option>General</option>
                                        <option>Tournament Update</option>
                                        <option>FIDE News</option>
                                        <option>Community</option>
                                    </select>

                                    <label className="label">Body Text</label>
                                    <textarea className="input-field" rows={5} value={newsData.body} onChange={e => setNewsData({ ...newsData, body: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 20 }}>Post News</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};
