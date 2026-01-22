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
            setSearchResults(result);
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
            standard: formData.standard ? parseInt(formData.standard) : 0,
            rapid: parseInt(formData.rapid),
            blitz: formData.blitz ? parseInt(formData.blitz) : 0,
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
            standard: formData.standard ? parseInt(formData.standard) : 0,
            rapid: parseInt(formData.rapid),
            blitz: formData.blitz ? parseInt(formData.blitz) : 0,
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
                height: 'calc(100vh - 13vh - 110px)',
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

        <div style={{
            height: 'calc(100vh - 13vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 16px',
            overflow: 'hidden'
        }}>
            <Toast
                message={toast.message}
                show={toast.show}
                color={toast.color}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />

            {/* Quick Actions */}
            <div className="card" style={{ padding: '10px', marginBottom: 10, flexShrink: 0 }}>
                <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className="btn"
                        onClick={() => { setActiveView('addUser'); setSelectedPlayer(null); setFormData({}); }}
                        style={{
                            flex: 1,
                            background: activeView === 'addUser' ? 'var(--primary-color)' : '#f1f5f9',
                            color: activeView === 'addUser' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <UserPlus size={16} /> Add Player
                    </button>
                    <button
                        className="btn"
                        onClick={() => { setActiveView('addNews'); setSelectedPlayer(null); setNewsData({ title: '', subtitle: '', category: 'Tournament', body: '' }); }}
                        style={{
                            flex: 1,
                            background: activeView === 'addNews' ? 'var(--primary-color)' : '#f1f5f9',
                            color: activeView === 'addNews' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <Megaphone size={16} /> Post News
                    </button>
                </div>
            </div>

            {/* Search Input with Dropdown Overlay */}
            <div className="card" style={{ padding: '10px', marginBottom: 10, flexShrink: 0, overflow: 'visible', zIndex: 50 }}>
                <div className="input-group" style={{ position: 'relative', marginBottom: 0 }}>
                    <SearchIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={16} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: 36, height: 36, fontSize: '0.9rem' }}
                        placeholder="Find player to edit..."
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => { if (searchQuery) handleSearch({ target: { value: searchQuery } }) }}
                    />
                    {/* Dropdown Results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '110%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 100
                        }}>
                            {searchResults.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        selectPlayer(p);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.85rem'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <span style={{ fontWeight: 600 }}>{p.lastName}, {p.firstName}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.id}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Workspace (Fills remaining space) */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, marginBottom: 0 }}>
                {!activeView && !selectedPlayer && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
                        <SearchIcon size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
                        <p style={{ maxWidth: 200, color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Select an action or search a player to begin.</p>
                    </div>
                )}

                {/* VIEW: ADD USER */}
                {activeView === 'addUser' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <UserPlus size={20} color="var(--primary-color)" style={{ marginRight: 10 }} />
                            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Add New Player</h2>
                        </div>
                        <form onSubmit={submitNewPlayer} style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <label className="input-label">FIRST NAME</label>
                                    <input className="input-field" placeholder="First" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required style={{ padding: '8px 12px' }} />
                                </div>
                                <div>
                                    <label className="input-label">LAST NAME</label>
                                    <input className="input-field" placeholder="Last" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required style={{ padding: '8px 12px' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label className="input-label">TITLE</label>
                                <select className="input-field" name="title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ padding: '8px 12px' }}>
                                    <option value="">No Title</option>
                                    <option value="GM">GM</option>
                                    <option value="IM">IM</option>
                                    <option value="FM">FM</option>
                                    <option value="CM">CM</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                                <div>
                                    <label className="input-label">STANDARD</label>
                                    <input className="input-field" type="number" placeholder="Rtng" name="standard" onChange={(e) => setFormData({ ...formData, standard: e.target.value })} style={{ padding: '8px' }} />
                                </div>
                                <div>
                                    <label className="input-label">RAPID</label>
                                    <input className="input-field" type="number" placeholder="Rtng" name="rapid" onChange={(e) => setFormData({ ...formData, rapid: e.target.value })} required style={{ padding: '8px' }} />
                                </div>
                                <div>
                                    <label className="input-label">BLITZ</label>
                                    <input className="input-field" type="number" placeholder="Rtng" name="blitz" onChange={(e) => setFormData({ ...formData, blitz: e.target.value })} style={{ padding: '8px' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label className="input-label">BIRTH YEAR</label>
                                <input className="input-field" type="number" placeholder="Year" name="bYear" onChange={(e) => setFormData({ ...formData, bYear: e.target.value })} style={{ padding: '8px 12px' }} />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '12px', width: '100%' }}>Create Player</button>
                        </form>
                    </div>
                )}

                {/* VIEW: ADD NEWS */}
                {activeView === 'addNews' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Megaphone size={20} color="var(--primary-color)" style={{ marginRight: 10 }} />
                            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Post News</h2>
                        </div>
                        <form onSubmit={submitNews} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                                <div style={{ marginBottom: 12 }}>
                                    <label className="input-label">HEADLINE</label>
                                    <input className="input-field" placeholder="Enter headline" value={newsData.title} onChange={e => setNewsData({ ...newsData, title: e.target.value })} required style={{ padding: '8px 12px' }} />
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <label className="input-label">SUBTITLE</label>
                                    <input className="input-field" placeholder="Enter subtitle" value={newsData.subtitle} onChange={e => setNewsData({ ...newsData, subtitle: e.target.value })} required style={{ padding: '8px 12px' }} />
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <label className="input-label">CATEGORY</label>
                                    <select className="input-field" value={newsData.category} onChange={e => setNewsData({ ...newsData, category: e.target.value })} style={{ padding: '8px 12px' }}>
                                        <option>Tournament</option>
                                        <option>App Changelog</option>
                                        <option>Community</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                                        <button type="button" onMouseDown={(e) => handleCommand(e, 'bold')} className={`rich-text-btn ${activeFormats.includes('bold') ? 'active' : ''}`}><Bold size={14} /></button>
                                        <button type="button" onMouseDown={(e) => handleCommand(e, 'italic')} className={`rich-text-btn ${activeFormats.includes('italic') ? 'active' : ''}`}><Italic size={14} /></button>
                                        <button type="button" onMouseDown={(e) => handleCommand(e, 'formatBlock', 'H3')} className={`rich-text-btn ${activeFormats.includes('H3') ? 'active' : ''}`}><Heading size={14} /></button>
                                        <button type="button" onMouseDown={(e) => { handleCommand(e, 'removeFormat'); handleCommand(e, 'formatBlock', 'div'); }} className="rich-text-btn"><Type size={14} /></button>
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
                                            minHeight: '150px',
                                            maxHeight: '300px',
                                            fontFamily: 'inherit',
                                            lineHeight: 1.5,
                                            outline: 'none',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: 12, padding: 12 }}>Post Announcement</button>
                        </form>
                    </div>
                )}

                {/* VIEW: EDIT PLAYER */}
                {!activeView && selectedPlayer && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <User size={20} color="var(--primary-color)" style={{ marginRight: 10 }} />
                                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Edit Player</h2>
                            </div>
                            <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', color: '#666' }}>ID: {formData.id}</span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                            {/* Avatar & Title */}
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    background: 'var(--bg-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #dee2e6',
                                    flexShrink: 0
                                }}>
                                    <User size={32} color="#6c757d" style={{ marginBottom: 4, opacity: 0.5 }} />
                                    <input
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleEditChange}
                                        placeholder="Title"
                                        style={{
                                            width: '80%',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            border: 'none',
                                            background: 'transparent',
                                            padding: 0
                                        }}
                                    />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>FIRST NAME</label>
                                        <input
                                            className="input-field"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleEditChange}
                                            style={{ padding: '8px' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>LAST NAME</label>
                                        <input
                                            className="input-field"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleEditChange}
                                            style={{ padding: '8px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                                <div>
                                    <label className="input-label">STANDARD</label>
                                    <input className="input-field" type="number" placeholder="-" name="standard" value={formData.standard || ''} onChange={handleEditChange} style={{ padding: '8px' }} />
                                </div>
                                <div>
                                    <label className="input-label">RAPID</label>
                                    <input
                                        className="input-field"
                                        type="number"
                                        name="rapid"
                                        value={formData.rapid || ''}
                                        onChange={handleEditChange}
                                        style={{ fontWeight: 'bold', color: 'var(--primary-color)', padding: '8px' }}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">BLITZ</label>
                                    <input className="input-field" type="number" placeholder="-" name="blitz" value={formData.blitz || ''} onChange={handleEditChange} style={{ padding: '8px' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <div>
                                    <label className="input-label">BIRTH YEAR</label>
                                    <input
                                        className="input-field"
                                        type="number"
                                        name="bYear"
                                        value={formData.bYear || ''}
                                        onChange={handleEditChange}
                                        style={{ padding: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
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
                                <Save size={16} style={{ marginRight: 8 }} /> Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
