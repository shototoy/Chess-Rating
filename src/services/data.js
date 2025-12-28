const STORAGE_KEY = 'chess_players_db';

const INITIAL_DATA = [
    { id: '1', lastName: 'Carlsen', firstName: 'Magnus', title: 'GM', rapid: 2830, bYear: 1990 },
    { id: '2', lastName: 'Caruana', firstName: 'Fabiano', title: 'GM', rapid: 2750, bYear: 1992 },
    { id: '3', lastName: 'Nakamura', firstName: 'Hikaru', title: 'GM', rapid: 2750, bYear: 1987 },
    { id: '4', lastName: 'Ding', firstName: 'Liren', title: 'GM', rapid: 2780, bYear: 1992 },
];

export const getPlayers = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    return JSON.parse(stored);
};

export const addPlayer = (player) => {
    const players = getPlayers();
    if (players.some(p => p.id === player.id)) {
        throw new Error('Player ID already exists');
    }
    players.push(player);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
};

export const searchPlayers = (query) => {
    const players = getPlayers();
    const lowerQuery = query.toLowerCase();
    return players.filter(p =>
        p.lastName.toLowerCase().includes(lowerQuery) ||
        p.firstName.toLowerCase().includes(lowerQuery) ||
        p.id.includes(lowerQuery)
    );
};
