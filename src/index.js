import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.css';
import App from './components/App';

const theme = createMuiTheme({
  palette: {
    secondary: {
        main: '#4252B3'
      }
    }
});


ReactDOM.render(
	<BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
	</BrowserRouter>, document.getElementById('root'));