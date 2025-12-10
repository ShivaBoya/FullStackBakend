const ThemeRegistry = {
    // --- NEW IMAGE-BASED THEMES ---
    classic_black: {
        id: "classic_black",
        label: "Classic Black",
        fontFamily: "'Times New Roman', Times, serif",
        vars: {
            '--primary': '#000000',
            '--secondary': '#000000',
            '--text': '#000000',
            '--divider-color': '#000000',
            '--bg': '#ffffff',
            '--heading-transform': 'uppercase',
            '--heading-font': "'Times New Roman', Times, serif",
            '--body-font': "'Times New Roman', Times, serif"
        }
    },
    modern_teal: {
        id: "modern_teal",
        label: "Modern Teal",
        fontFamily: "'Inter', sans-serif",
        vars: {
            '--primary': '#0F766E',
            '--secondary': '#1F2937',
            '--text': '#374151',
            '--divider-color': '#14B8A6',
            '--bg': '#ffffff',
            '--heading-transform': 'none',
            '--heading-font': "'Inter', sans-serif",
            '--body-font': "'Inter', sans-serif"
        }
    },

    // --- ORIGINAL THEMES (Restored) ---
    blue: {
        id: 'blue',
        label: 'Blue Standard',
        fontFamily: 'sans-serif',
        vars: {
            '--primary': '#2563eb',
            '--secondary': '#1e40af',
            '--text': '#0f172a',
            '--divider-color': '#2563eb', // Matches primary
            '--heading-transform': 'uppercase',
            '--heading-font': 'sans-serif'
        }
    },
    green: {
        id: 'green',
        label: 'Green Nature',
        fontFamily: 'sans-serif',
        vars: {
            '--primary': '#16a34a',
            '--secondary': '#15803d',
            '--text': '#0f172a',
            '--divider-color': '#16a34a',
            '--heading-transform': 'uppercase',
            '--heading-font': 'sans-serif'
        }
    },
    purple: {
        id: 'purple',
        label: 'Royal Purple',
        fontFamily: 'sans-serif',
        vars: {
            '--primary': '#9333ea',
            '--secondary': '#7e22ce',
            '--text': '#0f172a',
            '--divider-color': '#9333ea',
            '--heading-transform': 'uppercase',
            '--heading-font': 'sans-serif'
        }
    },
    black: {
        id: 'black',
        label: 'Minimal Black',
        fontFamily: 'sans-serif',
        vars: {
            '--primary': '#000000',
            '--secondary': '#333333',
            '--text': '#000000',
            '--divider-color': '#000000',
            '--heading-transform': 'uppercase',
            '--heading-font': 'sans-serif'
        }
    }
};

module.exports = ThemeRegistry;
