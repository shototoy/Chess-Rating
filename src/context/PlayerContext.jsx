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

    const abortControllerRef = useRef(null);
    const debounceTimeoutRef = useRef(null);
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

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (!query && sortConfig.key === 'rapid' && sortConfig.direction === 'desc' && players.length > 0) {
            try {
                const json = JSON.stringify(players);
                if (json.length < CACHE_LIMIT_BYTES) {
                    localStorage.setItem(CACHE_KEY, json);
                }
            } catch (e) {
                console.warn('LocalStorage error:', e);
            }
        }
    }, [players, query, sortConfig]);

    const loadPlayers = async (pageNum, replace = false, options = {}) => {
        const fetchQuery = options.query !== undefined ? options.query : query;
        const fetchSortKey = options.sortKey || sortConfig.key;
        const fetchSortDir = options.sortDir || sortConfig.direction;

        // If appending (loadMore) and currently loading, ignore.
        if (!replace && loading) return;

        // If replacing, abort previous request.
        if (replace) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
        } else if (!abortControllerRef.current) {
            abortControllerRef.current = new AbortController();
        }

        const signal = abortControllerRef.current.signal;
        setLoading(true);

        try {
            let newData = [];
            let sortBy = 'rapid_rating';
            if (fetchSortKey === 'name') sortBy = 'last_name';
            else if (fetchSortKey === 'rapid') sortBy = 'rapid_rating';

            // Backend search supports 'name' (multicolumn) and 'last_name'
            if (fetchSortKey === 'name') sortBy = 'name';

            if (fetchQuery) {
                newData = await searchPlayers(fetchQuery, pageNum, 150, sortBy, fetchSortDir, signal);
            } else {
                newData = await getPlayers({
                    page: pageNum,
                    limit: 150,
                    sortBy,
                    order: fetchSortDir,
                    signal
                });
            }

            if (signal.aborted) return;

            if (replace) {
                setPlayers(newData);
            } else {
                setPlayers(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = newData.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            }

            setHasMore(newData.length === 150);
            setPage(pageNum);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Failed to load players", error);
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    };

    const handleSearch = (newQuery) => {
        setQuery(newQuery);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (!newQuery) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    setPlayers(JSON.parse(cached));
                }
            } catch (e) { }
            // Run fetch immediately for empty query
            loadPlayers(1, true, { query: newQuery });
            return;
        }

        // Debounce search requests
        debounceTimeoutRef.current = setTimeout(() => {
            loadPlayers(1, true, { query: newQuery });
        }, 300);
    };

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        const newConfig = { key, direction };
        setSortConfig(newConfig);

        // Pass new config explicitly
        loadPlayers(1, true, { sortKey: key, sortDir: direction });
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            loadPlayers(page + 1, false); // Uses current state query/sort
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
