import React from "react";
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import SwipeableViews from 'react-swipeable-views';
import TracksList from './TracksList';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import MUIRichTextEditor from "mui-rte";
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const PlaylistBody = React.memo(function PlaylistBody(props) {
  const theme = useTheme();
  if (isWidthUp('lg', props.width)) {
    return <Grid container spacing={5} display='flex' justify="center" direction='row'>
        <Box p={3} className={props.classes.review}>
          <TracksList
              key={uuidv4()}
              tracks={props.tracks}
              playlistId={props.playlistId}
              handleTracks={props.handleTracks}
              className={props.classes.tracks}
              toggleSwipeableViews={props.toggleSwipeableViews}
              editing={props.editing}
              currentTrack={props.currentTrack}
              handlePlay={props.handlePlay}
              creator={props.creator}
          />
       </Box>
      {(
          (['youtube', 'bandcamp'].includes(props.source) && props.loadedReview) || (['backtube', 'owned', 'followed'].includes(props.source))
      ) &&
        <Box p={3} className={props.classes.review}>
          <MUIRichTextEditor
               name="description"
               label={
                   ['youtube', 'bandcamp'].includes(props.source) ? '' :
                   "Let other backtubers know what you're thinking of this playlist."
               }
               defaultValue={props.loadedReview}
               controls={["bold", "italic", "underline", "strikethrough", "link", "media","numberList", "bulletList", "quote", "clear"]}
               inlineToolbar={true}
               toolbar={props.editing}
               maxLength={10000}
               onChange={props.handleRTEChange}
               readOnly={!props.editing}
          />
      </Box>}
    </Grid>
} else {
  return <React.Fragment>
          <Container className={props.classes.tabsContainer}>
              <Tabs
              value={props.tabIndex}
              onChange={props.handleTabClick}
              indicatorColor="secondary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Tracks" {...a11yProps(0)} />
              <Tab label="Info" {...a11yProps(1)} />
            </Tabs>
        </Container>
         <SwipeableViews
             axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
             index={props.tabIndex}
             onChangeIndex={props.handleTabClick}
             disabled={props.swipeable}
          >
              <TabPanel value={props.tabIndex} index={0} dir={theme.direction}>
                  <TracksList
                      key={uuidv4()}
                      tracks={props.tracks}
                      playlistId={props.playlistId}
                      handleTracks={props.handleTracks}
                      className={props.classes.tracks}
                      toggleSwipeableViews={props.toggleSwipeableViews}
                      editing={props.editing}
                      currentTrack={props.currentTrack}
                      handlePlay={props.handlePlay}
                      creator={props.creator}
                  />
              </TabPanel>
              <TabPanel value={props.tabIndex} index={1} dir={theme.direction}>
                  <Container className={props.classes.review}>
                      <MUIRichTextEditor
                           name="review"
                           label={
                               ['youtube', 'bandcamp'].includes(props.source) ? '' :
                               "Let other backtubers know what you're thinking of this playlist."
                           }
                           defaultValue={props.loadedReview}
                           controls={["bold", "italic", "underline", "strikethrough", "link", "media","numberList", "bulletList", "quote", "clear"]}
                           inlineToolbar={true}
                           toolbar={props.editing}
                           maxLength={10000}
                           onChange={props.handleRTEChange}
                           readOnly={!props.editing}
                      />
                  </Container>
            </TabPanel>
        </SwipeableViews>
    </React.Fragment>}
})


export default withWidth()(PlaylistBody);
