import * as React from "react";
import Home from "../content/home.md";
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { darkTheme, lightTheme } from '../theme/theme';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import { Typography } from "@mui/material";
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { SiMisskey } from "react-icons/si";
import { SiZenn } from "react-icons/si";

const IndexPage = () => {
  const [darkMode, setDarkMode] = React.useState(true);
  // ダークモード切り替え
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Ubuntu:regular,bold&subset=Latin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap" rel="stylesheet" />

      <Container maxWidth="md">
        <Grid container spacing={2} alignItems="center">          
          <Grid item xs={6}>
            <IconButton onClick={toggleDarkMode} aria-label="Toggle dark mode" style={{position: "fixed", bottom: 20, right: 20}}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Grid>
          <Grid item>            
            <IconButton component="a" href="https://github.com/fog-zs/" aria-label="GitHub link" target="_blank" rel="noopener noreferrer" style={{position: "fixed", bottom: 20, right: 70}}>
              <FaGithub />
            </IconButton>            
          </Grid>
          <Grid item>            
            <IconButton component="a" href="https://x.com/zs_fog/" aria-label="X link" target="_blank" rel="noopener noreferrer" style={{position: "fixed", bottom: 20, right: 120}}>
              <FaXTwitter />
            </IconButton>            
          </Grid>
          <Grid item>            
            <IconButton component="a" href="https://misskey.io/@fog8360" aria-label="Misskey link" target="_blank" rel="noopener noreferrer" style={{position: "fixed", bottom: 20, right: 170}}>
              <SiMisskey />
            </IconButton>            
          </Grid>
          <Grid item>            
            <IconButton component="a" href="https://zenn.dev/fog" aria-label="Zenn link" target="_blank" rel="noopener noreferrer" style={{position: "fixed", bottom: 20, right: 220}}>
              <SiZenn />
            </IconButton>            
          </Grid>
          <Grid item xs={12}>
            <Home />            
          </Grid>
          <Grid item xs={12}>
            {/* Copyright */}
            <Typography variant="body2" color="text.secondary" align="center">
              {'© '}
              {new Date().getFullYear()}
              {' '}
              {'fog'}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default IndexPage;

export const Head = () => <title>fog</title>
