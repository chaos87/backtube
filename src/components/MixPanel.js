import mixpanel from 'mixpanel-browser';
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);

export let MixPanel = mixpanel;
