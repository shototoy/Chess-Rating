import React, { useState, useRef, useEffect } from 'react';
import { Toast } from '../components/Toast';
import { LogIn, Plus, TrendingUp, Search as SearchIcon, Save, X, Megaphone, UserPlus, User, Bold, Italic, Heading, Type, Eraser, CaseLower } from 'lucide-react';
import { searchPlayers, updatePlayer, addPlayer, addNews, loginUser } from '../services/data';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const [toast, setToast] = useState({ show: false, message: '', color: undefined });
    const { user, login, isAuthenticated } = useAuth();

    const [password, setPassword] = useState('');


    const [activeModal, setActiveModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownResults, setDropdownResults] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);


    const [formData, setFormData] = useState({});
    const [focusedField, setFocusedField] = useState(null);
    const [newsData, setNewsData] = useState({ title: '', subtitle: '', category: 'Tournament', body: '' });
    const editorRef = useRef(null);


    useEffect(() => {
        if (editorRef.current && document.activeElement !== editorRef.current) {
            editorRef.current.innerHTML = newsData.body;
        }
    }, [newsData.body]);

    const [activeFormats, setActiveFormats] = useState([]);
    const [isBodyExpanded, setIsBodyExpanded] = useState(false);

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

            const results = await searchPlayers(val, 1, 15);
            setDropdownResults(results);
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

    const savePlayerChanges = async () => {
        if (!selectedPlayer) return;
        const updated = {
            ...formData,
            rapid: parseInt(formData.rapid),
            bYear: formData.bYear ? parseInt(formData.bYear) : null
        };
        await updatePlayer(updated);
        setSelectedPlayer(null); // Reset profile editor
        setFormData({});
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
        setActiveModal(null);
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
        setActiveModal(null);
        setNewsData({ title: '', subtitle: '', category: 'Tournament', body: '' });
        setToast({ show: true, message: 'Announcement posted!', color: '#6610f2' });
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                height: 'calc(100vh - 60px - 60px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
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


    if (activeModal === 'addUser') {
        return (
            <div style={{
                height: 'calc(100vh - 60px - 60px)',
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
                overflow: 'hidden'
            }}>
                <div className="card" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    margin: 0,
                    padding: 16
                }}>

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                        <button
                            onClick={() => setActiveModal(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 8,
                                marginRight: 8,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--primary-color)'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <h2 style={{ margin: 0, flex: 1, fontSize: '1.2rem' }}>Add New Player</h2>
                    </div>


                    <form onSubmit={submitNewPlayer} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 16 }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>FIRST NAME</label>
                                    <input className="input-field" placeholder="First" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required style={{ padding: '8px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>LAST NAME</label>
                                    <input className="input-field" placeholder="Last" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required style={{ padding: '8px' }} />
                                </div>
                            </div>


                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#999', fontWeight: 600, display: 'block', marginBottom: 4 }}>TITLE</label>
                                <select className="input-field" name="title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ padding: '8px' }}>
                                    <option value="">No Title</option>
                                    <option value="GM">GM</option>
                                    <option value="IM">IM</option>
                                    <option value="FM">FM</option>
                                    <option value="CM">CM</option>
                                </select>
                            </div>


                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>RAPID RATING</label>
                                    <input className="input-field" type="number" placeholder="Rating" name="rapid" onChange={(e) => setFormData({ ...formData, rapid: e.target.value })} required style={{ padding: '8px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>BORN (Optional)</label>
                                    <input className="input-field" type="number" placeholder="Year" name="bYear" onChange={(e) => setFormData({ ...formData, bYear: e.target.value })} style={{ padding: '8px' }} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: 16, padding: 14, fontSize: '1rem', flexShrink: 0 }}>Create Player</button>
                    </form>
                </div>
            </div>
        );
    }



    if (activeModal === 'addNews') {
        return (
            <div style={{
                height: 'calc(100vh - 60px - 60px)',
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
                overflow: 'hidden'
            }}>
                <div className="card" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    margin: 0,
                    padding: 16
                }}>

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                        <button
                            onClick={() => setActiveModal(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 8,
                                marginRight: 8,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--primary-color)'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <h2 style={{ margin: 0, flex: 1, fontSize: '1.2rem' }}>Post Announcement</h2>
                    </div>


                    <form onSubmit={submitNews} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 16 }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>HEADLINE</label>
                                <input className="input-field" placeholder="Enter headline" value={newsData.title} onChange={e => setNewsData({ ...newsData, title: e.target.value })} required style={{ padding: '8px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>SUBTITLE</label>
                                <input className="input-field" placeholder="Enter subtitle" value={newsData.subtitle} onChange={e => setNewsData({ ...newsData, subtitle: e.target.value })} required style={{ padding: '8px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>CATEGORY</label>
                                <select className="input-field" value={newsData.category} onChange={e => setNewsData({ ...newsData, category: e.target.value })} style={{ padding: '8px' }}>
                                    <option>Tournament</option>
                                    <option>App Changelog</option>
                                    <option>Community</option>
                                </select>
                            </div>


                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                                position: isBodyExpanded ? 'fixed' : 'relative',
                                top: isBodyExpanded ? 0 : 'auto',
                                left: isBodyExpanded ? 0 : 'auto',
                                right: isBodyExpanded ? 0 : 'auto',
                                bottom: isBodyExpanded ? 0 : 'auto',
                                zIndex: isBodyExpanded ? 1000 : 1,
                                background: 'white',
                                padding: isBodyExpanded ? 24 : 0,
                                margin: isBodyExpanded ? 0 : 0
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <label style={{ fontSize: '0.7rem', color: '#999', fontWeight: 600 }}>BODY TEXT</label>
                                    {isBodyExpanded && (
                                        <button
                                            type="button"
                                            onClick={() => setIsBodyExpanded(false)}
                                            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Done
                                        </button>
                                    )}
                                </div>


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
                                    <button
                                        type="button"
                                        onMouseDown={(e) => handleCommand(e, 'bold')}
                                        className={`rich-text-btn ${activeFormats.includes('bold') ? 'active' : ''}`}
                                        title="Bold"
                                    >
                                        <Bold size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => handleCommand(e, 'italic')}
                                        className={`rich-text-btn ${activeFormats.includes('italic') ? 'active' : ''}`}
                                        title="Italic"
                                    >
                                        <Italic size={16} />
                                    </button>


                                    <button
                                        type="button"
                                        onMouseDown={(e) => handleCommand(e, 'formatBlock', 'H3')}
                                        className={`rich-text-btn ${activeFormats.includes('H3') ? 'active' : ''}`}
                                        title="Header"
                                    >
                                        <Heading size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            handleCommand(e, 'removeFormat');
                                            handleCommand(e, 'formatBlock', 'div');
                                        }}
                                        className="rich-text-btn"
                                        title="Normal Text"
                                    >
                                        <Type size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => handleCommand(e, 'fontSize', '1')}
                                        className={`rich-text-btn ${activeFormats.includes('small') ? 'active' : ''}`}
                                        title="Small Text"
                                    >
                                        <CaseLower size={16} />
                                    </button>

                                    <div style={{ flex: 1 }}></div>
                                    <button type="button" onMouseDown={(e) => handleCommand(e, 'removeFormat')} className="rich-text-btn danger" title="Clear Formatting">
                                        <Eraser size={16} />
                                    </button>
                                </div>


                                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div
                                        className="input-field"
                                        contentEditable
                                        ref={editorRef}
                                        suppressContentEditableWarning
                                        onFocus={() => setIsBodyExpanded(true)}
                                        onInput={(e) => {
                                            setNewsData({ ...newsData, body: e.currentTarget.innerHTML });
                                            checkFormats();
                                        }}
                                        onKeyUp={checkFormats}
                                        onMouseUp={checkFormats}
                                        style={{
                                            flex: 1,
                                            resize: 'none',
                                            padding: '12px',
                                            overflowY: 'auto',
                                            minHeight: isBodyExpanded ? 'auto' : '100px',
                                            fontFamily: 'inherit',
                                            lineHeight: 1.6,
                                            outline: 'none'
                                        }}
                                    />
                                    {!newsData.body && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            padding: '12px',
                                            color: '#ccc',
                                            pointerEvents: 'none',
                                            fontStyle: 'italic'
                                        }}>
                                            Enter announcement details...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: 16, padding: 14, fontSize: '1rem', flexShrink: 0, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)' }}>Post Announcement</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toast
                message={toast.message}
                show={toast.show}
                color={toast.color}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />
            <div style={{
                height: 'calc(100vh - 60px - 60px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
                overflow: 'hidden'
            }}>


                <div style={{
                    height: '15%',
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
                            height: '100%',
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
                        <UserPlus size={28} style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Add User</span>
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
                            background: 'var(--primary-color)',
                            color: 'white',
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <Megaphone size={28} style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Add News</span>
                    </div>
                </div>


                <div style={{
                    height: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 20,
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
                                        style={{ padding: '6px 12px', borderBottom: '1px solid #eee', cursor: 'pointer', background: 'white', minHeight: '32px' }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.lastName}, {p.firstName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{p.title} • ID: {p.id}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className="card" style={{
                    flex: 1,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '12px',
                    opacity: selectedPlayer ? 1 : 0.6,
                    pointerEvents: selectedPlayer ? 'auto' : 'none',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    boxSizing: 'border-box'
                }}>
                    {!selectedPlayer ? (
                        <div style={{ textAlign: 'center', color: '#999' }}>
                            <SearchIcon size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                            <p style={{ fontSize: '0.9rem', margin: 0 }}>Select a player to edit</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'space-between',
                            padding: '8px'
                        }}>

                            {/* Header: Avatar + Names */}
                            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                <div style={{
                                    width: 110, height: 110,
                                    background: '#f8f9fa',
                                    borderRadius: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #dee2e6',
                                    flexShrink: 0,
                                    position: 'relative' // For absolute title positioning
                                }}>
                                    <User size={48} color="#6c757d" style={{ marginBottom: 16 }} />

                                    {/* Title Input inside Avatar Box */}
                                    <input
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleEditChange}
                                        placeholder="Title"
                                        style={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 80,
                                            height: 24,
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            border: 'none',
                                            background: '#e9ecef',
                                            borderRadius: 4,
                                            outline: 'none',
                                            color: '#495057'
                                        }}
                                    />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
                                    <input
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleEditChange}
                                        placeholder="First Name"
                                        style={{
                                            width: '100%',
                                            height: 48,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            border: '1px solid #ccc',
                                            borderRadius: 8,
                                            padding: '0 12px',
                                            outline: 'none',
                                            color: '#333'
                                        }}
                                    />
                                    <input
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleEditChange}
                                        placeholder="Last Name"
                                        style={{
                                            width: '100%',
                                            height: 48,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            border: '1px solid #ccc',
                                            borderRadius: 8,
                                            padding: '0 12px',
                                            outline: 'none',
                                            color: '#333'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Details: ID & Born */}
                            <div style={{ display: 'flex', gap: 24 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600, display: 'block', marginBottom: 6 }}>FIDE ID</label>
                                    <div style={{
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: '#f8f9fa',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        padding: '0 12px',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        color: '#333'
                                    }}>
                                        {formData.id}
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600, display: 'block', marginBottom: 6 }}>BORN</label>
                                    <input
                                        type="number"
                                        name="bYear"
                                        value={formData.bYear || ''}
                                        onChange={handleEditChange}
                                        placeholder="Year"
                                        style={{
                                            width: '100%',
                                            height: 48,
                                            border: '1px solid #ccc',
                                            borderRadius: 8,
                                            padding: '0 12px',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            outline: 'none',
                                            color: '#333'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600, display: 'block', marginBottom: 6 }}>RAPID RATING</label>
                                <input
                                    type="number"
                                    name="rapid"
                                    value={formData.rapid || ''}
                                    onChange={handleEditChange}
                                    style={{
                                        width: '100%',
                                        height: 56,
                                        border: '1px solid #ccc',
                                        borderRadius: 8,
                                        padding: '0 12px',
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        outline: 'none',
                                        color: 'var(--primary-color)'
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 16 }}>
                                <button
                                    onClick={() => setSelectedPlayer(null)}
                                    style={{
                                        flex: 1,
                                        height: 48,
                                        border: 'none',
                                        background: '#e9ecef',
                                        borderRadius: 8,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#555',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={savePlayerChanges}
                                    className="btn-primary"
                                    style={{
                                        flex: 2,
                                        height: 48,
                                        borderRadius: 8,
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};


const style = document.createElement('style');
style.textContent = `
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
        border-color: #cbd5e1;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        color: var(--primary-color);
    }

    .rich-text-btn.active {
        background: #eff6ff;
        border-color: var(--primary-color);
        color: var(--primary-color);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        transform: translateY(0);
    }

    .rich-text-btn:active {
        transform: translateY(0);
        box-shadow: none;
        background: #e2e8f0;
    }

    .rich-text-btn.danger {
        width: auto;
        width: 32px;
        padding: 0;
        color: #ef4444;
        border-color: #fecaca;
        background: #fef2f2;
    }

    .rich-text-btn.danger:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #dc2626;
    }
`;
document.head.appendChild(style);
