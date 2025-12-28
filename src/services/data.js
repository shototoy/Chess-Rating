
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
        title: "Grand Prix 2025: Round 1 Results",
        subtitle: "Unexpected upsets define the opening round as underdogs shine.",
        date: "Oct 24, 2025 • 2:30 PM",
        category: "Tournament Update",
        gradient: "linear-gradient(135deg, #007bff, #0056b3)",
        body: `The opening round of the 2025 Chess Grand Prix commenced with high tension and even higher stakes. Several top-seeded grandmasters found themselves in difficult positions against prepared challengers.

      Magnus Carlsen managed to secure a win in a grinding endgame, demonstrating his trademark precision. However, other favorites weren't as lucky. 
      
      The local favorite, Ding Liren, held a draw against a fierce attack, proving that his defensive skills remain top-tier. Expect more action as we head into Round 2 tomorrow.`
    },
    {
        id: 2,
        title: "New Rating Regulations",
        subtitle: "FIDE announces changes effective from next quarter.",
        date: "Oct 20, 2025 • 9:00 AM",
        category: "FIDE News",
        gradient: "linear-gradient(135deg, #6610f2, #4a00e0)",
        body: `FIDE has released an official statement regarding the calculation of Rapid and Blitz ratings. The new K-factor adjustments aim to combat rating inflation and provide a more accurate reflection of current form for active players.

      These changes will be implemented starting November 1st. Players are advised to review the official handbook for detailed mathematical breakdowns.`
    },
    {
        id: 3,
        title: "Local Club Championship",
        subtitle: "Registration is now open for the city-wide classic.",
        date: "Oct 18, 2025 • 4:15 PM",
        category: "Community",
        gradient: "linear-gradient(135deg, #198754, #146c43)",
        body: `The annual City Chess Club Championship is back! This year features a larger prize pool and three distinct categories: Open, U2000, and Junior.

      Venue: Community Hall
      Dates: Nov 15 - Nov 20
      Entry Fee: $50
      
      Sign up before the end of the month to receive an early-bird discount.`
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
