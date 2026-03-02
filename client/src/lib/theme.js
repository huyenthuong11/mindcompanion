import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Đây là nơi bạn nhét font cho TOÀN BỘ App
    fontFamily: "'Quicksand', 'Be Vietnam Pro', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
});

export default theme;