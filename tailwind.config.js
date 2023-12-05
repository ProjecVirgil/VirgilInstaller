/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react')
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      defaultTheme: 'dark',
      themes: {
        'virgil-theme': {
          extend: 'dark',
          colors: {
            background: '#282936',
            foreground: '#dddddf',
            primary: {
              DEFAULT: '#a58ef5',
              foreground: '#dddddf'
            },
            secondary: {
              DEFAULT: '#282936',
              foreground: '#dddddf'
            },
            focus: '#1d1e27'
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '4px',
              medium: '6px',
              large: '8px'
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px'
            }
          }
        }
      }
    })
  ]
}
