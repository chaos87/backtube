import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { msToTime } from '../services/utils';
import ModalVideo from 'react-modal-video';


const styles = theme => ({
  root: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
    },
  },
  media: {
    height: 180,
  },
  cardClass: {
      height: "100%",
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  actions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'center',
      alignItems: 'center',
  },
  fabProgress: {
      color: 'secondary',
      position: 'absolute',
      zIndex: 1,
  },
  fab: {
      backgroundColor: 'white',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1)
  }
});

class Playlist extends Component {

    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            modalVideoId: null
        };
    }

    handleWatchVideo = (event) => {
          this.setState({
              isModalOpen: true,
              modalVideoId: event.videoId
          })
    }

    render(){
      const { classes } = this.props;
      const body = (
          <React.Fragment>
            <Grid container direction="row" className={classes.root} spacing={2}>
               {this.props.tracks !== undefined && this.props.tracks.map((elem, i) => (
                         <Grid item xs={12} md={6} key={elem._id + i}>
                             <Card className={classes.cardClass}>
                                 <CardActionArea>
                                   <CardMedia
                                     className={classes.media}
                                     image={elem.thumbnail}
                                     title={elem.title}
                                   />
                                   <CardContent>
                                       <Typography gutterBottom variant="body1" component="h2">
                                         {elem.artist}
                                       </Typography>
                                       <Typography gutterBottom variant="body1" component="h2">
                                         {elem.album}
                                       </Typography>
                                     <Typography gutterBottom variant="h6" component="h2">
                                       {elem.title}
                                     </Typography>
                                     <Typography gutterBottom variant="subtitle1" component="h3">
                                       {"[" + msToTime(elem.duration * 1000) + "]"}
                                     </Typography>
                                   </CardContent>
                                 </CardActionArea>
                                 <CardActions className={classes.actions}>
                                     <Fab
                                         size="small"
                                         title="Add to player"
                                         disabled={this.props.addLoading && i === this.props.itemAddedId}
                                         onClick={() => this.props.addToPlaylist(elem, this.props.source, elem.thumbnail, elem.artist, elem.album ? elem.album : this.props.title, i)}
                                         className={classes.fab}
                                     >
                                         <PlaylistAddIcon/>
                                         {this.props.addLoading && i === this.props.itemAddedId &&
                                             <CircularProgress color="secondary" className={classes.fabProgress} />}
                                   </Fab>
                                   {this.props.source === "youtube" &&
                                   <Fab
                                       size="small"
                                       title="See tracks"
                                       onClick={() => this.handleWatchVideo(elem)}
                                       className={classes.fab}
                                   >
                                       <VisibilityIcon/>
                                 </Fab>}
                                 </CardActions>
                             </Card>
                          </Grid>
                     ))}
           </Grid>
           <ModalVideo
                  channel='youtube'
                  isOpen={this.state.isModalOpen}
                  videoId={this.state.modalVideoId}
                  onClose={() => this.setState({isModalOpen: false})}
              />
            </React.Fragment>
      );
      return (
            <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" open={this.props.open}>
            <IconButton aria-label="close" className={classes.closeButton} onClick={this.props.onClose}>
              <CloseIcon />
            </IconButton>
            <DialogTitle id="simple-dialog-title">{this.props.title}</DialogTitle>
            {body}
            <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
                Close
            </Button>
            </DialogActions>
          </Dialog>
      );
  }
}

export default withStyles(styles, { withTheme: true })(Playlist);
