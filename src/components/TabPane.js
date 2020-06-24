import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import GridPlaylists from "./GridPlaylists"
import CircularProgress from '@material-ui/core/CircularProgress';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  box: {
      marginLeft: theme.spacing(2),
      display: 'flex',
      justifyContent:'center',
      alignItems:'center'
  },
  label: {
      marginRight: theme.spacing(1)
  },
  appbar: {
      top: theme.spacing(7)
  },
  container: {
      marginTop: theme.spacing(2),
  },
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appbar}>
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            variant="scrollable"
            scrollButtons="on"
        >
            {Object.keys(props.data).map((item, i) => (
                <Tab label={
                    <Box className={classes.box}>
                      <Box display="inline" className={classes.label}>{props.labels[item] ? props.labels[item]: 'playlists'}</Box>
                        {props.loadingIndicators[item] && <CircularProgress display="inline" color='inherit' size={20}/>}
                    </Box>} key={item}   {...a11yProps({i})}
                />
            ))}
        </Tabs>
      </AppBar>
      <Container className={classes.container}>
          {Object.keys(props.data).map((item, i) => (
              <TabPanel value={value} index={i} key={item}>
                <GridPlaylists
                    playlistLists={props.data[item] instanceof Array? {playlists: props.data[item]}: props.data[item]}
                    loading={props.loadingIndicators[item]}
                    source={item}
                />
              </TabPanel>
          ))}
      </Container>
    </div>
  );
}
