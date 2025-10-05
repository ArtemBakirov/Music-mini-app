/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // false or 'media' or 'class'
  theme: {
    colors: {
      jelly_bean: "#4F7690",
      transparent: "transparent",
      current: "currentColor",
      midnight: "#2A343E",
      white: "#FFFFFF",
      licorice: "#2E3945",
      catalina_blue: "#243B56",
      blue_charcoal: "#1F2933",
      nepal: "#8EA5BA",
      slate_grey: "#72808C",
      dark_slate_grey: "#2C4F4F",
      light_cyan: "#E6F7F7",
      fringy_flower: "#B1E7C4",
      french_pass: "#B3CED5",
      oyster_bay: "#CDEFEF",
      allports: "#1b6e81",
      pattens_blue: "#E6EEF0",
      pattens_blue_two: "#D9F0FA",
      primary: {
        common: "#025E73",
        gray: "#CFD8D8",
      },
      primary_dark: {
        common: "#347E8F",
        gray: "#38424D",
      },
      signal: {
        green: "#37B062",
        orange: "#FF9100",
        red: "#E21A1A",
      },
      signal_dark: {
        red: "#FF5C5C",
      },
      chargestation: {
        selected: "#09B2B2",
        selected_disabled: "#7EB0B0",
        fast: "#532C80",
        fast_second: "#291640",
        normal: "#9573BD",
        slow: "#C2AFD9",
        tariff: "#EFEBF5",
        tariff_dark: "#474649",
        activePlugsPrimary: "#394E66",
        activePlugsSecondary: "#BCC3C4",
        inactivePlugsPrimary: "#C6C6C6",
        inactivePlugsSecondary: "#EDEDED",
      },
      morning_glory: "#94DEDE",
      summer_sky: "#329FCF",
      blue_whale: "#063349",
      morning_glory_disabled: "#A7BDBD",
    },
    textColor: (theme) => ({
      white: theme("colors").white,
      primary: theme("colors").catalina_blue,
      primary_dark: "#DDDDDD",
      secondary: theme("colors").jelly_bean,
      secondary_dark: "#AFC0D0",
      summer_sky: theme("colors").summer_sky,
      tertiary: theme("colors").nepal,
      tertiary_dark: theme("colors").slate_grey,
      signal: theme("colors").signal,
      signal_dark: theme("colors").signal_dark,
      button: theme("colors").primary,
      button_dark: theme("colors").primary_dark,
      icon: {
        primary: theme("colors").white,
        secondary: theme("colors").nepal,
      },
      icon_dark: {
        primary: theme("colors").midnight,
        secondary: theme("colors").slate_grey,
      },
      section: theme("colors").primary,
      section_dark: theme("colors").primary_dark,
      chargestation: theme("colors").chargestation,
      gray: theme("colors").primary.gray,
      gray_dark: theme("colors").primary_dark.gray,
      dark_slate_grey: theme("colors").dark_slate_grey,
      light_cyan: theme("colors").light_cyan,
      allports: theme("colors").allports,
      pattens_blue: theme("colors").pattens_blue,
      current: theme("colors").current,
    }),
    backgroundColor: (theme) => ({
      transparent: theme("colors").transparent,
      current: theme("colors").current,
      primary: theme("colors").primary,
      primary_dark: theme("colors").primary_dark,
      tertiary: theme("colors").nepal,
      tertiary_dark: theme("colors").slate_grey,
      signal: theme("colors").signal,
      signal_dark: theme("colors").signal_dark,
      common: "#FCFBFC",
      fringy_flower: "#AFDFC0",
      common_dark: theme("colors").blue_charcoal,
      card: {
        primary: theme("colors").white,
        secondary: "#FCFCFC",
      },
      card_dark: {
        primary: theme("colors").midnight,
        secondary: theme("colors").licorice,
      },
      search_input: theme("colors").white,
      search_input_dark: theme("colors").licorice,
      overlay: theme("colors").catalina_blue,
      overlay_dark: "#0C1014",
      search_section: { common: "#B3CED5" },
      search_section_dark: { common: "#00252E" },
      footer: "#F1F8F6",
      footer_dark: theme("colors").blue_charcoal,
      icon: theme("textColor").icon,
      icon_dark: theme("textColor").icon_dark,
      chargestation: theme("colors").chargestation,
      morning_glory: theme("colors").morning_glory,
      fringy_flowers: theme("colors").fringy_flower,
      deep_fir: "#133B1E",
      french_pass: "#B3CED5",
      oyster_bay: "#CDEFEF",
      dark_slate_grey: theme("colors").dark_slate_grey,
      pattens_blue_two: theme("colors").pattens_blue_two,
      jelly_bean: theme("colors").catalina_blue,
      summer_sky: theme("colors").summer_sky,
      blue_whale: theme("colors").blue_whale,
    }),
    placeholderColor: (theme) => ({
      ...theme("textColor"),
    }),
    extend: {
      fontFamily: {
        body: ["Nunito"],
        chargestation: ["Oswald"],
      },
      borderRadius: {
        small: "0.625rem", // 10px
        medium: "0.9375rem", // 15px
        large: "1.25rem", // 20px
      },
      width: {
        container: "23.4375rem",
        dialog: "21.4375rem",
      },
      maxWidth: {
        container: "23.4375rem",
        dialog: "21.4375rem",
      },
      zIndex: {},
      scale: {
        65: ".65",
        70: ".70",
        80: ".80",
        85: ".85",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        8.5: "2.125rem",
        10.5: "2.625rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.4375rem",
        18: "4.5rem",
        18.5: "4.625rem",
      },
      strokeWidth: {
        3: "3",
        4: "4",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("textColor.tertiary"),
          },
        },
      }),
    },

    screens: {
      portrait: { raw: "(orientation: portrait)" },
      phonelandscape: {
        raw: "(max-height: 600px) and (orientation: landscape)",
      },
      bigphone: { raw: "(min-height: 641px) and (orientation: portrait)" },
      small: { raw: "(min-width: 480px) and (min-height: 638px)" }, //Tablet Small
      big: "834px", // Tablet Big
      // => @media (min-width: 834px) { ... }
      desk: "1024px", // Desktop
      // => @media (min-width: 1024px) { ... }

      sm: "640px",
      md: "768px", // tablet
      lg: "1024px", // small laptop / desktop
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  variants: {
    extend: {
      display: ["odd", "even", "last"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
