import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import ForumIcon from '@material-ui/icons/Forum';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { setSubTab } from '../actions/nav';
import Badge from '@material-ui/core/Badge';
import RootRef from '@material-ui/core/RootRef';

const styles = theme => ({
    root: {
          padding: theme.spacing(2),
    },
    rootRow: {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflowY: 'hidden',
          overflowX: 'scroll',
    },
    gridList: {
        marginRight: theme.spacing(1),
    },
    gridListRow: {
        flexWrap: 'nowrap',
    },
    paper: {
        background: '#e6e6e6',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 10px',
        boxShadow: '0 3px 5px 2px rgba(230, 230, 230, .3)',
    },
    cardClass: {
        height: "100%",
        width: "100%"
    },
    cardClassRow: {
        height: "100%",
        width: 240,
    },
    box: {
        height: '25vh',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    gridInfo: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(1)
    },
    themeIcon: {
        color: "white"
    },
    themeCardIcon: {
      height: 240,
      fontSize: 60
    },
    title: {
        fontWeight: 'bold',
        color: 'white'
    },
    titleSection: {
        fontWeight: 'bold',
    },
    badge: {
        color: "white"
    },
    media: {
      height: 240,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonScroll: {
        [theme.breakpoints.only('xs')]: {
            paddingLeft: 0,
            paddingRight: 0
        },
    },
    content: {
         overflow: "hidden",
         textOverflow: "ellipsis",
         width: "100%",
         height: "100%",
         backgroundColor: theme.palette.primary.main,
    },
    cardFocus: {
        opacity: 0.1
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        "&:hover": {
            textDecoration: 'underline',
            textDecorationColor: 'white',
        }
    },
});

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
        <Box width="100%">
          {children}
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


class GridThemes extends Component {
  constructor(props){
      super(props);
      this.state = {
          open: false,
          tracks: [],
          album: null,
          cover: null,
          disabled: false,
      };
      // React Ref is created here
      this.gridRef = React.createRef();
  }

  handleChange = (event, newValue) => {
      this.props.setSubTab(newValue)
  }

  handleScroll = (direction) => {
    if (direction === 'left' && this.gridRef) {
      this.gridRef.current.scrollLeft -= 360;
    }
    if (direction === 'right' && this.gridRef) {
      this.gridRef.current.scrollLeft += 360;
    }
  }

  render(){
      const { classes } = this.props;
      return (
          <React.Fragment>
                {!this.props.row ? <Paper square className={classes.paper}>
                  <Tabs
                    value={this.props.subTab}
                    onChange={this.handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon label tabs example"
                  >
                    {Object.keys(this.props.themeLists).map((item, i) => (
                    <Tab key={item}
                        label={this.props.themeLists[item] === undefined ? item + ' (0)' : item + ' (' + this.props.themeLists[item].length + ')'}
                             {...a11yProps({i})} />
                     ))}
                  </Tabs>
              </Paper> :
              <Typography
                  variant={Object.keys(this.props.themeLists)[0] === 'Themes' ? 'h5' : 'h4'}
                  color="primary"
                  component="h1"
                  align="left"
                  className={classes.titleSection}
              >
                {Object.keys(this.props.themeLists)[0]}
                {Object.keys(this.props.themeLists)[0] === 'Themes' ? ('(' + this.props.themeLists[Object.keys(this.props.themeLists)[0]].length + ')') : ''}
            </Typography>}
                {this.props.loading && <Container className={classes.box}>
                <CircularProgress color="secondary" />
            </Container>}
            {!this.props.loading && Object.keys(this.props.themeLists).map((item, i) => (
                <div key={item} className={classes.rowContainer}>
                    {this.props.row && <div>
                        <IconButton title="Scroll left" onClick={() => this.handleScroll('left')} className={classes.buttonScroll}>
                            <ArrowBackIosIcon color="secondary"/>
                        </IconButton>
                    </div>}
                    <RootRef rootRef={this.gridRef}>
                        <TabPanel value={this.props.subTab} className={this.props.row ? classes.rootRow : classes.root} index={i} key={item}>
                            <Grid container direction="row" className={this.props.row ? classes.gridListRow : classes.gridList} spacing={2}>
                               {item in this.props.themeLists && this.props.themeLists[item] && this.props.themeLists[item].map(elem => (
                                         <Grid item xs={12} sm={6} md={6} key={elem._id} className={classes.gridItem}>
                                             <Card className={this.props.row ? classes.cardClassRow : classes.cardClass}>
                                                 <CardActionArea
                                                     component={Link}
                                                     to={{
                                                        pathname: `/theme/${elem._id}`,
                                                        theme: this.props.loadThemeOnClick ? null : elem,
                                                    }}
                                                    disableRipple={this.state.disabled}
                                                    classes={{
                                                      root: classes.cardActionArea,
                                                      focusHighlight: classes.cardFocus
                                                    }}
                                                 >
                                                  {'thumbnail' in elem && elem.thumbnail ?
                                                   <CardMedia
                                                        className={classes.media}
                                                        image={elem.thumbnail}
                                                        title={elem.title}
                                                    />
                                                    : <ForumIcon color="primary" className={classes.themeCardIcon}/>}
                                                   </CardActionArea>
                                                   <CardContent className={classes.content}>
                                                       <Link
                                                           to={{
                                                               pathname: `/theme/${elem._id}`,
                                                               theme: elem,
                                                           }}
                                                           className={classes.link}>
                                                           <Typography variant="subtitle1" component="h1" align="left" className={classes.title}>
                                                             {elem.title}
                                                           </Typography>
                                                       </Link>
                                                        <Grid container justify="flex-end" alignItems="center" direction="row" className={classes.gridInfo}>
                                                           <Badge color="secondary" badgeContent={elem.playlists.length} showZero classes={{ badge: classes.badge}} >
                                                               <QueueMusicIcon fontSize="large" className={classes.themeIcon}/>
                                                           </Badge>
                                                       </Grid>
                                                   </CardContent>

                                             </Card>
                                          </Grid>
                                     ))}
                           </Grid>
                       </TabPanel>
                 </RootRef>
                 {this.props.row && <div>
                     <IconButton title="Scroll right" onClick={() => this.handleScroll('right')} className={classes.buttonScroll}>
                         <ArrowForwardIosIcon color="secondary"/>
                     </IconButton>
                 </div>}
             </div>)
             )}
    </React.Fragment>
      );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    setSubTab: (value) => dispatch(setSubTab(value))
  };
}

function mapStateToProps(state, props) {
  return {
    addLoading: state.player.addLoading,
    itemAddedId: state.player.itemAddedId,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.session ? state.auth.session.accessToken.jwtToken: null,
    userid: state.auth.session ? state.auth.session.accessToken.payload.sub: null,
    currentTrack: state.player.currentTrack ? state.player.currentTrack : '',
    subTab: state.nav.subTab ? state.nav.subTab : 0,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(GridThemes)));
