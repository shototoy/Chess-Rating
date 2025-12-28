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

    // Cache key for localStorage
    const CACHE_KEY = 'leaderboard_cache';
    const CACHE_LIMIT_BYTES = 4500000; // Safety margin for 5MB limit

    // Initial Load: Check Cache then Revalidate
    useEffect(() => {
        // 1. Try to load from cache immediately (Instant UI)
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('Using cached leaderboard:', parsed.length, 'items');
                    setPlayers(parsed);
                    // Assume if we have cache, we might have more. 
                    // But to be safe, we'll start Revalidation from Page 1 anyway.
                }
            }
        } catch (e) {
            console.error('Cache load failed:', e);
        }

        // 2. Revalidate (Fetch fresh data in background)
        loadPlayers(1, true);
    }, []);

    // Save to Cache whenever players update (ONLY if showing default view: no query, default sort)
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
                    // Avoid duplicates if any overlap
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = newData.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            }

            // If we got fewer than requested, we reached the end
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
        // If clearing search, revert to cache immediately if possible, or fetch
        if (!newQuery) {
            // Re-load default view
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    setPlayers(JSON.parse(cached));
                    // Revalidate silently? Or just trust cache for now? 
                    // Let's revalidate page 1 to be sure
                    loadPlayers(1, true);
                    return;
                }
            } catch (e) { }
        }

        // If searching or no cache, fetch fresh
        // For search, we replace list
        setPlayers([]);
        setLoading(true);
        try {
            // Search logic handled in loadPlayers via state, but we need to trigger it manually here effectively
            // because state updates are async.
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

        // Clear and Reload
        setPage(1);
        setPlayers([]);
        setHasMore(true);

        // Trigger fetch (params need to be passed explicitly because state won't update in this closure yet)
        setLoading(true);
        (async () => {
            try {
                let sortBy = 'rapid_rating';
                if (key === 'name') sortBy = 'name'; // Matches backend expectation validation logic
                else if (key === 'rapid') sortBy = 'rapid_rating';

                let data = [];
                if (query) {
                    // If searching, use searchPlayers with sort params
                    data = await searchPlayers(query, 1, 50, sortBy, direction);
                } else {
                    // Default list
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
