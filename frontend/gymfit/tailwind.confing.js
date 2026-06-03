// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gym-dark-bg': '#0A0E17',
                'gym-dark-card': '#161B28',
                'gym-cyan-accent': '#2DE8DA',
                'gym-gray-text': '#818FA2',
                'gym-white-text': '#FFFFFF',
                'gym-pill-active': '#2DE8DA',
                'gym-pill-inactive': '#161B28',
            },
            borderRadius: {
                'gym-card': '2rem',
            }
        },
    },
    plugins: [],
}

