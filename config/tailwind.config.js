const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.html.erb',
    './config/initializers/*.rb',
    './app/components/**/*.rb',
    './app/components/**/**/*.rb',
    './app/components/**/**/**/*.rb',
    './app/components/**/*.html.erb',
    './app/components/**/**/*.html.erb',
    './app/components/**/**/**/*.html.erb',
    './node_modules/tailwindcss-stimulus-components/**/*.js',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          '50':  '#f8f9f9',
          '100': '#ecf1f5',
          '200': '#d5dee9',
          '300': '#acbccd',
          '400': '#7c95aa',
          '500': '#607388',
          '600': '#505762',
          '700': '#3c4250',
          '800': '#292c38',
          '900': '#191b23',
        },
        steel: {
          '50':  '#f9fafa',
          '100': '#f0f1f6',
          '200': '#dedcec',
          '300': '#bbb8d4',
          '400': '#958eb4',
          '500': '#786b96',
          '600': '#614f77',
          '700': '#493b59',
          '800': '#31283d',
          '900': '#1d1825',
        },
        denim: {
          '50':  '#f9fafa',
          '100': '#eff1f8',
          '200': '#dcdbef',
          '300': '#b8b7da',
          '400': '#938ebf',
          '500': '#776aa4',
          '600': '#604e86',
          '700': '#483a65',
          '800': '#312745',
          '900': '#1c1829',
        },
        wisteria: {
          '50':  '#f9fafa',
          '100': '#eff1f8',
          '200': '#dcdbf1',
          '300': '#bab6de',
          '400': '#988cc5',
          '500': '#7b68ad',
          '600': '#634c90',
          '700': '#4b396d',
          '800': '#33264a',
          '900': '#1d172c',
        },
        plum: {
          '50':  '#fafafa',
          '100': '#f0f1f8',
          '200': '#dfdaf1',
          '300': '#bfb5de',
          '400': '#a08ac4',
          '500': '#8466ac',
          '600': '#6b4a8f',
          '700': '#50376c',
          '800': '#362549',
          '900': '#1f172b',
        },
        orchid: {
          '50':  '#fafbfa',
          '100': '#f2f1f8',
          '200': '#e4d9f0',
          '300': '#c7b3db',
          '400': '#ac88c0',
          '500': '#9063a7',
          '600': '#754789',
          '700': '#573566',
          '800': '#3b2445',
          '900': '#221628',
        },
        blush: {
          '50':  '#fbfbfa',
          '100': '#f5f1f5',
          '200': '#ebd8eb',
          '300': '#d3b0d1',
          '400': '#bf83b1',
          '500': '#a55f93',
          '600': '#884373',
          '700': '#663254',
          '800': '#452238',
          '900': '#271520',
        },
        chestnut: {
          '50':  '#fbfbfa',
          '100': '#f7f1f3',
          '200': '#edd7e5',
          '300': '#d8b0c6',
          '400': '#c583a1',
          '500': '#ac5e80',
          '600': '#8f4360',
          '700': '#6b3246',
          '800': '#49222f',
          '900': '#2a151b',
        },
        sepia: {
          '50':  '#fbfbfa',
          '100': '#f7f1f1',
          '200': '#edd8e1',
          '300': '#d6b1c0',
          '400': '#c18598',
          '500': '#a76174',
          '600': '#894555',
          '700': '#67343f',
          '800': '#46232b',
          '900': '#291519',
        },
        beaver: {
          '50':  '#f5f5f5',
          '100': '#d9d9d9',
          '200': '#c4c4c4',
          '300': '#9d9d9d',
          '400': '#7b7b7b',
          '500': '#555555',
          '600': '#353535',
          '700': '#2d2d2d',
          '800': '#1d1d1d',
          '850': '#171717',
          '900': '#111111',
          '1000': '#010101',
        },
      }
    }
  },
  daisyui: {
    themes: [
      {
        black: {
          primary: "#343232",
          secondary: "#181616",
          accent: "#343232",
          "base-100": "#070707",
          "base-200": "#121212",
          "base-300": "#1A1919",
          neutral: "#272626",
          "neutral-focus": "#343232",
          info: "#604e86",
          success: "#15803d",
          warning: "#ffff00",
          error: "#7f1d1d",
          "--rounded-box": "0.75rem",
          "--rounded-btn": ".25rem",
          "--rounded-badge": ".25rem",
          "--animation-btn": "0",
          "--animation-input": "0",
          "--btn-text-case": "normal",
          "--btn-focus-scale": "1",
          "--tab-radius": "0",
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "black",
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  // daisyUI config (optional)
}
