import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgba(0,0,0,0.75)',
    },
    secondary: {
      main: '#31c27c',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

Object.assign(theme, {
    overrides: {
        MUIRichTextEditor: {
            anchorLink: {
                color: '#31c27c',
            },

        }
    }
})

export default theme;
