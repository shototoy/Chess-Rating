import React, { useState, useRef, useEffect } from 'react';
import { Toast } from '../components/Toast';
import { LogIn, Plus, TrendingUp, Search as SearchIcon, Save, X, Megaphone, UserPlus, User, Bold, Italic, Heading, Type, Eraser, CaseLower, FileText } from 'lucide-react';
import { searchPlayers, updatePlayer, addPlayer, addNews, loginUser } from '../services/data';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const [toast, setToast] = useState({ show: false, message: '', color: undefined });
    const { login, isAuthenticated } = useAuth();

    const [password, setPassword] = useState('');

    // 'addUser', 'addNews', or null (default)
    const [activeView, setActiveView] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Form States
    const [formData, setFormData] = useState({});
    const [newsData, setNewsData] = useState({ title: '', subtitle: '', category: 'Tournament', body: '' });

    // Rich Text Editor State
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState([]);
    const [isBodyExpanded, setIsBodyExpanded] = useState(false);

    useEffect(() => {
        if (activeView === 'addNews' && editorRef.current && document.activeElement !== editorRef.current) {
            editorRef.current.innerHTML = newsData.body;
        }
    }, [activeView, newsData.body]);

    const checkFormats = () => {
        const formats = [];
        if (document.queryCommandState('bold')) formats.push('bold');
        if (document.queryCommandState('italic')) formats.push('italic');
        const blockValue = document.queryCommandValue('formatBlock');
        if (blockValue && blockValue.toLowerCase() === 'h3') formats.push('H3');
        const sizeValue = document.queryCommandValue('fontSize');
        if (sizeValue === '1') formats.push('small');
        if (!blockValue || blockValue.toLowerCase() === 'div') formats.push('normal');
        setActiveFormats(formats);
    };

    const handleCommand = (e, command, value = null) => {
        e.preventDefault();
        document.execCommand(command, false, value);
        checkFormats();
    };

    // Handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(password);
            login(data.admin, data.token);
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    const handleSearch = async (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.length > 0) {
            const result = await searchPlayers(val, 1, 50);
            setSearchResults(result.players);
        } else {
            setSearchResults([]);
        }
    };

    const selectPlayer = (player) => {
        setSelectedPlayer(player);
        setFormData({ ...player });
        setActiveView(null); // Clear other views to show editor
        // We do NOT clear search query/results here, allows user to quickly switch
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const savePlayerChanges = async () => {
        if (!selectedPlayer) return;
        const updated = {
            ...formData,
            rapid: parseInt(formData.rapid),
            bYear: formData.bYear ? parseInt(formData.bYear) : null
        };
        await updatePlayer(updated);

        // Update local state to reflect changes instantly in the list (optional, but good UX)
        setSearchResults(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));

        setToast({ show: true, message: 'Player updated successfully!', color: 'var(--primary-color)' });
    };

    const submitNewPlayer = async (e) => {
        e.preventDefault();
        const newPlayer = {
            lastName: formData.lastName,
            firstName: formData.firstName,
            title: formData.title,
            rapid: parseInt(formData.rapid),
            bYear: formData.bYear ? parseInt(formData.bYear) : null
        };
        await addPlayer(newPlayer);
        setActiveView(null);
        setFormData({});
        setToast({ show: true, message: 'Player added!', color: 'var(--primary-color)' });
    };

    const submitNews = async (e) => {
        e.preventDefault();
        const newItem = {
            title: newsData.title,
            subtitle: newsData.subtitle,
            category: newsData.category,
            body: newsData.body
        };
        await addNews(newItem);
        setActiveView(null);
        setNewsData({ title: '', subtitle: '', category: 'Tournament', body: '' });
        setToast({ show: true, message: 'Announcement posted!', color: '#6610f2' });
    };

    // Authentication View
    if (!isAuthenticated) {
        return (
            <div style={{
                height: 'calc(100vh - 100px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', maxWidth: 400, width: '100%' }}>
                    <div style={{ background: '#eff6ff', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
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

    // Main Dashboard View
    return (
        <div className="search-layout">
            <Toast
                message={toast.message}
                show={toast.show}
                color={toast.color}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />

            {/* Sidebar: Actions & Search */}
            <div className="search-sidebar">
                {/* Admin Actions */}
                <div className="card" style={{ marginBottom: 16, padding: 16 }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                        <button
                            className="btn"
                            onClick={() => { setActiveView('addUser'); setSelectedPlayer(null); setFormData({}); }}
                            style={{
                                background: activeView === 'addUser' ? 'var(--primary-color)' : '#f1f5f9',
                                color: activeView === 'addUser' ? 'white' : 'var(--text-primary)',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            <UserPlus size={18} /> Add New Player
                        </button>
                        <button
                            className="btn"
                            onClick={() => { setActiveView('addNews'); setSelectedPlayer(null); setNewsData({ title: '', subtitle: '', category: 'Tournament', body: '' }); }}
                            style={{
                                background: activeView === 'addNews' ? 'var(--primary-color)' : '#f1f5f9',
                                color: activeView === 'addNews' ? 'white' : 'var(--text-primary)',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            <Megaphone size={18} /> Post News
                        </button>
                    </div>
                </div>

                {/* Player Search & List */}
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                    <div style={{ padding: 12, borderBottom: '1px solid var(--border-color)', background: 'white' }}>
                        <div className="input-group" style={{ position: 'relative', marginBottom: 0 }}>
                            <SearchIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={16} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: 36, height: 40, fontSize: '0.9rem' }}
                                placeholder="Find player to edit..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {searchResults.length === 0 ? (
                            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                {searchQuery ? 'No players found.' : 'Search for a player to edit.'}
                            </div>
                        ) : (
                            searchResults.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => selectPlayer(p)}
                                    style={{
                                        padding: '10px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        background: selectedPlayer?.id === p.id ? '#f0f9ff' : 'white',
                                        borderLeft: selectedPlayer?.id === p.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.lastName}, {p.firstName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.title || 'UR'} • ID: {p.id}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main Area: Workspace */}
            <div className="search-main" style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0, overflow: 'hidden' }}>

                    {/* VIEW: ADD USER */}
                    {activeView === 'addUser' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
                                <UserPlus size={24} color="var(--primary-color)" style={{ marginRight: 12 }} />
                                <h2 style={{ margin: 0 }}>Add New Player</h2>
                            </div>
                            <form onSubmit={submitNewPlayer} style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label className="input-label">FIRST NAME</label>
                                        <input className="input-field" placeholder="First" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="input-label">LAST NAME</label>
                                        <input className="input-field" placeholder="Last" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <label className="input-label">TITLE</label>
                                    <select className="input-field" name="title" onChange={(e) => setFormData({ ...formData, title: e.target.value })}>
                                        <option value="">No Title</option>
                                        <option value="GM">GM</option>
                                        <option value="IM">IM</option>
                                        <option value="FM">FM</option>
                                        <option value="CM">CM</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                                    <div>
                                        <label className="input-label">RAPID RATING</label>
                                        <input className="input-field" type="number" placeholder="Rating" name="rapid" onChange={(e) => setFormData({ ...formData, rapid: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="input-label">BIRTH YEAR</label>
                                        <input className="input-field" type="number" placeholder="Year (Optional)" name="bYear" onChange={(e) => setFormData({ ...formData, bYear: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ padding: 16 }}>Create Player</button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: ADD NEWS */}
                    {activeView === 'addNews' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
                                <Megaphone size={24} color="var(--primary-color)" style={{ marginRight: 12 }} />
                                <h2 style={{ margin: 0 }}>Post Announcement</h2>
                            </div>
                            <form onSubmit={submitNews} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <label className="input-label">HEADLINE</label>
                                        <input className="input-field" placeholder="Enter headline" value={newsData.title} onChange={e => setNewsData({ ...newsData, title: e.target.value })} required />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <label className="input-label">SUBTITLE</label>
                                        <input className="input-field" placeholder="Enter subtitle" value={newsData.subtitle} onChange={e => setNewsData({ ...newsData, subtitle: e.target.value })} required />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <label className="input-label">CATEGORY</label>
                                        <select className="input-field" value={newsData.category} onChange={e => setNewsData({ ...newsData, category: e.target.value })}>
                                            <option>Tournament</option>
                                            <option>App Changelog</option>
                                            <option>Community</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 300 }}>
                                        <label className="input-label">BODY TEXT</label>
                                        <div style={{
                                            display: 'flex',
                                            gap: 4,
                                            marginBottom: 8,
                                            background: '#f8fafc',
                                            padding: '4px',
                                            borderRadius: 8,
                                            border: '1px solid #e2e8f0',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            <button type="button" onMouseDown={(e) => handleCommand(e, 'bold')} className={`rich-text-btn ${activeFormats.includes('bold') ? 'active' : ''}`}><Bold size={16} /></button>
                                            <button type="button" onMouseDown={(e) => handleCommand(e, 'italic')} className={`rich-text-btn ${activeFormats.includes('italic') ? 'active' : ''}`}><Italic size={16} /></button>
                                            <button type="button" onMouseDown={(e) => handleCommand(e, 'formatBlock', 'H3')} className={`rich-text-btn ${activeFormats.includes('H3') ? 'active' : ''}`}><Heading size={16} /></button>
                                            <button type="button" onMouseDown={(e) => { handleCommand(e, 'removeFormat'); handleCommand(e, 'formatBlock', 'div'); }} className="rich-text-btn"><Type size={16} /></button>
                                            <button type="button" onMouseDown={(e) => handleCommand(e, 'fontSize', '1')} className={`rich-text-btn ${activeFormats.includes('small') ? 'active' : ''}`}><CaseLower size={16} /></button>
                                            <div style={{ flex: 1 }}></div>
                                            <button type="button" onMouseDown={(e) => handleCommand(e, 'removeFormat')} className="rich-text-btn danger"><Eraser size={16} /></button>
                                        </div>

                                        <div
                                            className="input-field"
                                            contentEditable
                                            ref={editorRef}
                                            suppressContentEditableWarning
                                            onInput={(e) => setNewsData({ ...newsData, body: e.currentTarget.innerHTML })}
                                            onKeyUp={checkFormats}
                                            onMouseUp={checkFormats}
                                            style={{
                                                flex: 1,
                                                resize: 'none',
                                                padding: '12px',
                                                overflowY: 'auto',
                                                minHeight: '200px',
                                                fontFamily: 'inherit',
                                                lineHeight: 1.6,
                                                outline: 'none',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: 16, padding: 14 }}>Post Announcement</button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: EDIT PLAYER */}
                    {!activeView && selectedPlayer && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <User size={24} color="var(--primary-color)" style={{ marginRight: 12 }} />
                                    <h2 style={{ margin: 0 }}>Edit Player Profile</h2>
                                </div>
                                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', color: '#666' }}>ID: {formData.id}</span>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
                                {/* Avatar & Title */}
                                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 24 }}>
                                    <div style={{
                                        width: '25%',
                                        aspectRatio: '1 / 1',
                                        background: 'var(--bg-color)',
                                        borderRadius: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #dee2e6',
                                        flexShrink: 0,
                                        minWidth: 120, // ensure it doesn't get too small on mobile
                                        maxWidth: 250
                                    }}>
                                        <User size={80} color="#6c757d" style={{ marginBottom: 12, opacity: 0.5 }} />
                                        <input
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleEditChange}
                                            placeholder="Title"
                                            style={{
                                                width: '60%',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                textAlign: 'center',
                                                border: '1px solid #ddd',
                                                background: 'white',
                                                borderRadius: 6,
                                                padding: '4px 2px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <label className="input-label">FIRST NAME</label>
                                            <input
                                                className="input-field"
                                                name="firstName"
                                                value={formData.firstName || ''}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">LAST NAME</label>
                                            <input
                                                className="input-field"
                                                name="lastName"
                                                value={formData.lastName || ''}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                                    <div>
                                        <label className="input-label">RAPID RATING</label>
                                        <input
                                            className="input-field"
                                            type="number"
                                            name="rapid"
                                            value={formData.rapid || ''}
                                            onChange={handleEditChange}
                                            style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">BIRTH YEAR</label>
                                        <input
                                            className="input-field"
                                            type="number"
                                            name="bYear"
                                            value={formData.bYear || ''}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                <button
                                    onClick={() => setSelectedPlayer(null)}
                                    className="btn"
                                    style={{ flex: 1, background: '#e2e8f0', color: '#333' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={savePlayerChanges}
                                    className="btn-primary"
                                    style={{ flex: 2 }}
                                >
                                    <Save size={18} style={{ marginRight: 8 }} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIEW: EMPTY STATE */}
                    {!activeView && !selectedPlayer && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: 120, height: 120, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                                <SearchIcon size={48} color="#94a3b8" />
                            </div>
                            <h2 style={{ color: '#64748b', marginBottom: 8 }}>Ready to Edit</h2>
                            <p style={{ maxWidth: 300, color: '#94a3b8' }}>Select an action from the sidebar or search for a player to modify their details.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .rich-text-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
            
                .rich-text-btn:hover {
                    background: #f1f5f9;
                }
                
                .rich-text-btn.active {
                    background: #e2e8f0;
                    color: #333;
                    border-color: #cbd5e1;
                }
                
                .rich-text-btn.danger {
                    color: #ef4444;
                }
                .rich-text-btn.danger:hover {
                    background: #fef2f2;
                    border-color: #fecaca;
                }
            `}</style>
        </div>
    );
};
