import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00008F',
    },
    secondary: {
      main: '#FF1721',
    },
    warning: {
      main: '#F5B301',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
})
