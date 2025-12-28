
// Initial Mock Data
const INITIAL_PLAYERS = [
    { id: '1001', lastName: 'Carlsen', firstName: 'Magnus', title: 'GM', rapid: 2830, bYear: 1990 },
    { id: '1002', lastName: 'Caruana', firstName: 'Fabiano', title: 'GM', rapid: 2750, bYear: 1992 },
    { id: '1003', lastName: 'Nakamura', firstName: 'Hikaru', title: 'GM', rapid: 2745, bYear: 1987 },
    { id: '1004', lastName: 'Ding', firstName: 'Liren', title: 'GM', rapid: 2780, bYear: 1992 },
    { id: '1005', lastName: 'Firouzja', firstName: 'Alireza', title: 'GM', rapid: 2760, bYear: 2003 },
    { id: '1006', lastName: 'So', firstName: 'Wesley', title: 'GM', rapid: 2740, bYear: 1993 },
    { id: '1007', lastName: 'Nepomniachtchi', firstName: 'Ian', title: 'GM', rapid: 2770, bYear: 1990 },
    { id: '1008', lastName: 'Gukesh', firstName: 'D', title: 'GM', rapid: 2730, bYear: 2006 },
    { id: '1009', lastName: 'Anand', firstName: 'Viswanathan', title: 'GM', rapid: 2750, bYear: 1969 },
    { id: '1010', lastName: 'Polgar', firstName: 'Judit', title: 'GM', rapid: 2680, bYear: 1976 },
];

const INITIAL_NEWS = [
    {
        id: 1,
        title: "Kape Probinsya Hosted Annual Isulan Tournament",
        subtitle: "Local coffee shop becomes the heart of competitive chess in Sultan Kudarat.",
        date: "Dec 15, 2024 • 10:00 AM",
        category: "Tournament",
        body: `Kape Probinsya, a beloved local coffee establishment in Isulan, Sultan Kudarat, proudly hosted the Annual Isulan Chess Tournament this year. The event brought together chess enthusiasts from across the region for an exciting day of strategic battles.

The tournament featured multiple categories including Open, Intermediate, and Junior divisions. Players enjoyed the cozy ambiance of Kape Probinsya while competing for prizes and recognition.

Special thanks to the owners and staff of Kape Probinsya for providing an excellent venue, complete with refreshments and a welcoming atmosphere that made this tournament truly memorable.

Winners will be announced at the closing ceremony. Stay tuned for more chess events at Kape Probinsya!`
    },
    {
        id: 2,
        title: "Biyaherong Arbiter Chess Clinic",
        subtitle: "Free chess training session held at Kape Probinsya Tacurong Branch.",
        date: "Dec 10, 2024 • 2:00 PM",
        category: "Community",
        body: `The Biyaherong Arbiter initiative brought a special chess clinic to Kape Probinsya's Tacurong Branch, offering free training to aspiring players of all skill levels.

Led by certified arbiters and experienced coaches, the clinic covered fundamental tactics, opening principles, and endgame techniques. Participants ranged from complete beginners to intermediate players looking to sharpen their skills.

The event was well-attended, with over 30 participants enjoying the interactive sessions. Kape Probinsya Tacurong provided the perfect setting with comfortable seating and complimentary refreshments.

This community outreach program aims to promote chess education and make the game more accessible to everyone. Watch for future clinics coming to your area!`
    },
    {
        id: 3,
        title: "App Version 1.0 Released",
        subtitle: "Chess Ratings app now available with player management and news features.",
        date: "Dec 28, 2024 • 11:30 PM",
        category: "App Changelog",
        body: `We're excited to announce the initial release of the Chess Ratings application!

Features in v1.0:
• Player database management with rapid ratings
• Search and filter functionality
• Admin dashboard for adding/editing players
• News and announcements system
• Responsive mobile-first design
• Local data persistence

This app was built to help chess communities track player ratings and stay updated with local chess news and events.

Future updates will include tournament management, advanced statistics, and more. Thank you for your support!`
    }
];

// Helpers to load/save from localStorage
const loadPlayers = () => {
    const saved = localStorage.getItem('chess_players');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('chess_players', JSON.stringify(INITIAL_PLAYERS));
    return INITIAL_PLAYERS;
};

const savePlayers = (players) => {
    localStorage.setItem('chess_players', JSON.stringify(players));
};

const loadNews = () => {
    const saved = localStorage.getItem('chess_news');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('chess_news', JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
};

const saveNews = (news) => {
    localStorage.setItem('chess_news', JSON.stringify(news));
};

// --- API ---

// Players
export const getPlayers = () => loadPlayers();

export const addPlayer = (player) => {
    const players = loadPlayers();
    players.push(player);
    savePlayers(players);
    return players;
};

export const updatePlayer = (updatedPlayer) => {
    const players = loadPlayers();
    const index = players.findIndex(p => p.id === updatedPlayer.id);
    if (index !== -1) {
        players[index] = updatedPlayer;
        savePlayers(players);
    }
    return players;
};

export const searchPlayers = (query) => {
    const players = loadPlayers();
    const lowerQ = query.toLowerCase();
    return players.filter(p =>
        p.lastName.toLowerCase().includes(lowerQ) ||
        p.firstName.toLowerCase().includes(lowerQ) ||
        p.id.toLowerCase().includes(lowerQ)
    );
};

// News
export const getNews = () => loadNews();

export const addNews = (newsItem) => {
    const news = loadNews();
    // Prepend to show newest first
    news.unshift(newsItem);
    saveNews(news);
    return news;
};

// Reset data (clears localStorage and reloads initial data)
export const resetData = () => {
    localStorage.removeItem('chess_players');
    localStorage.removeItem('chess_news');
    return {
        players: loadPlayers(),
        news: loadNews()
    };
};
