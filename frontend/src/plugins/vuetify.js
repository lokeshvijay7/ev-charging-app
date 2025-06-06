import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
// Removed import of VDataTable from labs, use stable component from components
// import { VDataTable } from "vuetify/labs/VDataTable"
import { aliases, mdi } from "vuetify/iconsets/mdi"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

const lightTheme = {
  dark: false,
  colors: {
    primary: "#1976D2",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
    background: "#F5F5F5",
  },
}

const darkTheme = {
  dark: true,
  colors: {
    primary: "#2196F3",
    secondary: "#424242",
    accent: "#FF4081",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    background: "#121212",
  },
}

export default createVuetify({
  components: {
    ...components,
    // VDataTable, // removed to fix import error
  },
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
})
