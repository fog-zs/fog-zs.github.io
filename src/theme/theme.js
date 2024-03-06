// theme.jsファイル内
import { createTheme } from '@mui/material/styles';

// ベースのテーマ設定（オプションで定義）
const baseTheme = createTheme({
    typography: {
        fontFamily: [
        //   '-apple-system',
        //   'BlinkMacSystemFont',
        //   '"Segoe UI"',
        //   'Roboto',
        //   '"Helvetica Neue"',
        //   'Arial',
        //   'sans-serif',
        //   '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
    components: {
        // ここでフォントファミリーを指定                
        MuiCssBaseline: {
            styleOverrides: `
            body {
                font-family: "Ubuntu", "Noto Sans TC", "Yu Gothic", "Meiryo", "sans-serif";
            }
              h1 {
                font-size: 2.5rem;
                font-weight: normal;                
                margin-bottom: 0.5rem;                
              }
              p {
                margin-bottom: 1rem;
                line-height: 1.5;                
              }
            `,
          },
    },    
});

// Light用のテーマ
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#556cd6',
      // 他のカラー設定
    },
    // その他のテーマ設定...
  },
});

// Dark用のテーマ
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    // その他のダークモード特有の設定...
  },
});
