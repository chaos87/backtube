import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import RootRef from "@material-ui/core/RootRef";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { msToTime } from '../services/utils';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: "auto",
    display: 'flex',
    justifyContent:'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    direction: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cover: {
    width: 90,
  },
  text: {
    maxWidth: '40vh',
    [theme.breakpoints.between(340, 365)]: {
      maxWidth: '12vh'
    },
    [theme.breakpoints.between(365, 400)]: {
      maxWidth: '15vh'
    },
    [theme.breakpoints.between(400, 425)]: {
      maxWidth: '18vh'
    },
    [theme.breakpoints.between(425, 450)]: {
      maxWidth: '20vh'
    },
    [theme.breakpoints.between(450, 500)]: {
      maxWidth: '25vh'
    },
    [theme.breakpoints.between(500, 550)]: {
      maxWidth: '30vh'
    },
    [theme.breakpoints.between(550, 600)]: {
      maxWidth: '35vh'
    },
  },
  textPlaying: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
    maxWidth: '40vh',
    [theme.breakpoints.between(340, 365)]: {
      maxWidth: '12vh'
    },
    [theme.breakpoints.between(365, 400)]: {
      maxWidth: '15vh'
    },
    [theme.breakpoints.between(400, 425)]: {
      maxWidth: '18vh'
    },
    [theme.breakpoints.between(425, 450)]: {
      maxWidth: '20vh'
    },
    [theme.breakpoints.between(450, 500)]: {
      maxWidth: '25vh'
    },
    [theme.breakpoints.between(500, 550)]: {
      maxWidth: '30vh'
    },
    [theme.breakpoints.between(550, 600)]: {
      maxWidth: '35vh'
    },
  },
  cardClass: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      height: "100%",
      width: "100%",
  },
  iconContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
  },
  listItem: {
       paddingRight: 0,
       paddingLeft: 0,
       paddingBottom: 2,
       paddingTop: 2,
  },
  list:{
      width: "100%",
      maxWidth: 700,
      [theme.breakpoints.up('lg')]: {
        width: "90%",
      },
  },
  duration: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
      marginRight: theme.spacing(2)
  },
  unavailable: {
      color: 'red',
      marginRight: theme.spacing(2)
  },
  albumIcon: {
      fontSize: 30,
  },
  coverContainer: {
      height: 90,
      width: 90,
      display: 'flex',
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  },
  link: {},
  disableLink: {
      pointerEvents: 'none'
  }
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});


class TracksList extends Component {

  onDragEnd = (result) => {
  // dropped outside the list
  if (!result.destination) {
    return;
  }

  const items = reorder(
    this.props.tracks,
    result.source.index,
    result.destination.index
  );
  this.props.handleTracks(items);

  // this.props.toggleSwipeableViews()
}

onDragStart = () => {
    this.props.toggleSwipeableViews()
}

render(){
  console.log(this.props.track)
  const { classes } = this.props;
  return (
    <div className={classes.root}>
      {this.props.tracks.length > 0 ?
          <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable
                  droppableId="droppable"
                  renderClone={(provided, snapshot, rubric) => (
                        <ListItem
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={classes.listItem}
                        >
                            <Card className={classes.cardClass}>
                                <CardActionArea
                                    className={classes.cardClass}
                                >
                                {this.props.tracks[rubric.source.index].thumbnail ?
                                    <img
                                      className={classes.cover}
                                      src={this.props.tracks[rubric.source.index].thumbnail}
                                      alt={this.props.tracks[rubric.source.index].album}
                                    />
                                : <Box style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}} className={classes.coverContainer}>
                                      <QueueMusicIcon color="primary" className={classes.albumIcon}/>
                                  </Box>}

                                <CardContent className={classes.content}>
                                    <div>
                                      <Typography
                                          noWrap
                                          component="h1"
                                          className={
                                              this.props.currentTrack._id === this.props.tracks[rubric.source.index]._id
                                              && this.props.currentTrack.playlistId === this.props.playlistId ?
                                               classes.textPlaying: classes.text
                                           }
                                          variant="subtitle1"
                                       >
                                        {this.props.tracks[rubric.source.index].title}
                                      </Typography>
                                      <Typography noWrap className={classes.text} variant="subtitle1" color="textSecondary">
                                        {this.props.tracks[rubric.source.index].artist}
                                      </Typography>
                                    </div>
                                      <Typography noWrap className={classes.duration} variant="subtitle1" color="textSecondary">
                                         {msToTime(this.props.tracks[rubric.source.index].duration * 1000)}
                                      </Typography>
                              </CardContent>
                            {!this.props.editing &&
                              <div className={classes.iconContainer}>
                                      <IconButton>
                                        <MoreVertIcon />
                                      </IconButton>
                              </div>}
                              </CardActionArea>
                            </Card>
                          <ListItemSecondaryAction/>
                        </ListItem>
                    )}
                >
                {(provided, snapshot) => (
                  <RootRef rootRef={provided.innerRef}>
                    <List className={classes.list}>
                      {this.props.tracks.map((item, index) => (
                        <React.Fragment  key={item._id}>
                        <Draggable key={item._id} draggableId={item._id.toString()} index={index} isDragDisabled={!this.props.editing}>
                          {(provided, snapshot) => (
                            <ListItem
                              ContainerComponent="li"
                              ContainerProps={{ ref: provided.innerRef }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                              className={classes.listItem}
                            >
                            <Card className={classes.cardClass}>
                                <CardActionArea
                                    className={classes.cardClass}
                                    onClick={() => this.props.handlePlay(item)}
                                    disabled={this.props.editing || item._id === 'da7a8f2c4db5582b80b7f0109daab672'}
                                >
                                {item.thumbnail ?
                                    <img
                                      className={classes.cover}
                                      src={item.thumbnail}
                                      alt={item.album}
                                    />
                                    : <Box style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}} className={classes.coverContainer}>
                                          <QueueMusicIcon color="primary" className={classes.albumIcon}/>
                                      </Box>
                                }

                                <CardContent className={classes.content}>
                                    <div>
                                      <Typography
                                          noWrap
                                          component="h1"
                                          className={
                                              this.props.currentTrack._id === item._id
                                              && this.props.currentTrack.playlistId === this.props.playlistId ? classes.textPlaying: classes.text
                                          }
                                          variant="subtitle1"
                                       >
                                        {item.title}
                                      </Typography>
                                      <Typography noWrap className={classes.text} variant="subtitle1" color="textSecondary">
                                        {item.artist}
                                      </Typography>
                                    </div>
                                    <div>
                                      <Typography noWrap className={classes.duration} variant="subtitle1" color="textSecondary">
                                         {msToTime(item.duration * 1000)}
                                      </Typography>
                                      {item._id === 'da7a8f2c4db5582b80b7f0109daab672' &&
                                      <Typography noWrap className={classes.unavailable} variant="caption">
                                         Unavailable
                                     </Typography>}
                                  </div>
                              </CardContent>
                              </CardActionArea>
                              {!this.props.editing && <div className={classes.iconContainer}>
                                  <Link to={{
                                        pathname: `/track/cannotShareUrl`,
                                        track: item,
                                        creator: this.props.creator
                                    }}
                                    className={item._id === 'da7a8f2c4db5582b80b7f0109daab672' ? classes.disableLink : classes.link}
                                  >

                                      <IconButton className={classes.icon} disabled={item._id === 'da7a8f2c4db5582b80b7f0109daab672'}>
                                        <MoreVertIcon />
                                      </IconButton>
                                  </Link>
                              </div>}
                            </Card>
                          <ListItemSecondaryAction/>
                          </ListItem>
                          )}
                        </Draggable>
                        </React.Fragment>
                      ))}
                      {provided.placeholder}
                    </List>
                  </RootRef>
                )}
              </Droppable>
          </DragDropContext>
        : <Typography align="left" variant="body1" color="textSecondary">
            Search for tracks and add them to this playlist
       </Typography>}
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TracksList);
