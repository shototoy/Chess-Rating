import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getPlayers, searchPlayers } from '../services/data';

const PlayerContext = createContext();

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'rapid', direction: 'desc' });

    const CACHE_KEY = 'leaderboard_cache';
    const CACHE_LIMIT_BYTES = 4500000;

    useEffect(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('Using cached leaderboard:', parsed.length, 'items');
                    setPlayers(parsed);
                    
                }
            }
        } catch (e) {
            console.error('Cache load failed:', e);
        }

        
        loadPlayers(1, true);
    }, []);

    
    useEffect(() => {
        if (!query && sortConfig.key === 'rapid' && sortConfig.direction === 'desc' && players.length > 0) {
            try {
                const json = JSON.stringify(players);
                if (json.length < CACHE_LIMIT_BYTES) {
                    localStorage.setItem(CACHE_KEY, json);
                } else {
                    console.warn('Cache quota exceeded, stopping cache updates');
                }
            } catch (e) {
                console.warn('LocalStorage error:', e);
            }
        }
    }, [players, query, sortConfig]);

    const loadPlayers = async (pageNum, replace = false) => {
        if (loading) return;
        setLoading(true);

        try {
            let newData = [];
            // Map sort key to backend expected columns
            let sortBy = 'rapid_rating';
            if (sortConfig.key === 'name') sortBy = 'last_name';
            else if (sortConfig.key === 'rapid') sortBy = 'rapid_rating';

            if (query) {
                // Search Mode (RAM only, Limit 15 enforced by UI or logic, here we fetch what is asked)
                newData = await searchPlayers(query, pageNum, 50, sortBy, sortConfig.direction);
            } else {
                // Default Mode
                newData = await getPlayers({
                    page: pageNum,
                    limit: 50,
                    sortBy,
                    order: sortConfig.direction
                });
            }

            if (replace) {
                setPlayers(newData);
            } else {
                setPlayers(prev => {
                    
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = newData.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            }

            
            setHasMore(newData.length === 50);
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to load players", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (newQuery) => {
        setQuery(newQuery);
        setPage(1);
        setHasMore(true);
        
        if (!newQuery) {
            
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    setPlayers(JSON.parse(cached));
                    
                    loadPlayers(1, true);
                    return;
                }
            } catch (e) { }
        }

        
        setPlayers([]);
        setLoading(true);
        try {
            
            let sortBy = 'rapid_rating';
            if (sortConfig.key === 'name') sortBy = 'name';

            const data = newQuery
                ? await searchPlayers(newQuery, 1, 50, sortBy, sortConfig.direction)
                : await getPlayers({ page: 1, limit: 50, sortBy, order: sortConfig.direction });

            setPlayers(data);
            setHasMore(data.length === 50);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        const newConfig = { key, direction };
        setSortConfig(newConfig);

        
        setPage(1);
        setPlayers([]);
        setHasMore(true);

        
        setLoading(true);
        (async () => {
            try {
                let sortBy = 'rapid_rating';
                if (key === 'name') sortBy = 'name';
                else if (key === 'rapid') sortBy = 'rapid_rating';

                let data = [];
                if (query) {
                    
                    data = await searchPlayers(query, 1, 50, sortBy, direction);
                } else {
                    
                    data = await getPlayers({
                        page: 1,
                        limit: 50,
                        sortBy,
                        order: direction
                    });
                }

                setPlayers(data);
                setHasMore(data.length === 50);
            } finally {
                setLoading(false);
            }
        })();
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            loadPlayers(page + 1);
        }
    };

    return (
        <PlayerContext.Provider value={{
            players,
            loading,
            hasMore,
            query,
            sortConfig,
            handleSearch,
            handleSort,
            loadMore
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
