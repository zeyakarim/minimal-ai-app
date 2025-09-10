/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
    theme: {
        extend: {
            screens: {

            },
        },

        extend: {
            animation: {
                "spin-slow": "spin 4s linear infinite",
                "bounce-slow": "bounce 2.5s infinite",
                typing: "typing 3s steps(30, end) infinite",
                fadeIn: "fadeIn 1s ease-in-out both",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                typing: {
                    "0%": { width: "0" },
                    "100%": { width: "100%" },
                },
            },
        },
    },
};
