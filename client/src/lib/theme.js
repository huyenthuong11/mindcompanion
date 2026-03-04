import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Đây là nơi bạn nhét font cho TOÀN BỘ App
    fontFamily: "'Quicksand', 'Be Vietnam Pro', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 400 },
    h5: { fontWeight: 300 },
  },
});

export default theme;