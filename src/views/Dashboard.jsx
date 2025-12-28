import React, { useState } from 'react';
import { addPlayer } from '../services/data';
import { LogIn, PlusCircle, LogOut } from 'lucide-react';

export const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        lastName: '',
        firstName: '',
        title: '',
        rapid: 1200,
        bYear: 2000
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = () => {
        if (password === 'admin123') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid password (try admin123)');
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        try {
            if (!formData.id || !formData.lastName || !formData.firstName) {
                setError('Please fill in required fields');
                return;
            }
            addPlayer(formData);
            setSuccess('Player added successfully!');
            setFormData({
                id: '',
                lastName: '',
                firstName: '',
                title: '',
                rapid: 1200,
                bYear: 2000
            });
            setError('');
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ display: 'flex', height: '80vh', alignItems: 'center' }}>
                <div className="card" style={{ width: '100%', textAlign: 'center' }}>
                    <LogIn size={48} color="var(--primary-color)" style={{ marginBottom: 20 }} />
                    <h2 style={{ color: 'var(--primary-color)', margin: '0 0 20px' }}>Admin Login</h2>
                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: 10, fontSize: '0.9rem' }}>{error}</div>}
                    <button className="btn" onClick={handleLogin}>Log In</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <h2 style={{ marginTop: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <PlusCircle /> New Player Entry
                </h2>

                {success && <div style={{ background: '#d4edda', color: '#155724', padding: 10, borderRadius: 6, marginBottom: 10 }}>{success}</div>}
                {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: 10, borderRadius: 6, marginBottom: 10 }}>{error}</div>}

                <form onSubmit={handleCreate}>
                    <div className="input-group">
                        <label className="input-label">FIDE ID</label>
                        <input
                            className="input-field"
                            value={formData.id}
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div className="input-group">
                            <label className="input-label">First Name</label>
                            <input
                                className="input-field"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Last Name</label>
                            <input
                                className="input-field"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <div className="input-group">
                            <label className="input-label">Title</label>
                            <select
                                className="input-field"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            >
                                <option value="">-</option>
                                <option value="GM">GM</option>
                                <option value="IM">IM</option>
                                <option value="FM">FM</option>
                                <option value="CM">CM</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Rapid</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.rapid}
                                onChange={e => setFormData({ ...formData, rapid: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Born</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.bYear}
                                onChange={e => setFormData({ ...formData, bYear: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <button className="btn" type="submit">Create Entry</button>
                </form>
            </div>

            <button
                className="btn btn-secondary"
                onClick={() => setIsLoggedIn(false)}
                style={{ marginTop: 20 }}
            >
                <LogOut size={18} style={{ marginRight: 8 }} />
                Log Out
            </button>
        </div>
    );
};
