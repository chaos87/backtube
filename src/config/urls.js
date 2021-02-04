export const CALLBACK_PATH = '/lastfm/callback';

export const baseURL = 'https://api-backtube.herokuapp.com'
// export const streamingURL = 'https://backtube-stream-api-msxgd.ondigitalocean.app'
export const streamingURL = new Date().getDate() % 2 === 0 ? 'https://backtube-stream-api-msxgd.ondigitalocean.app' : 'https://agile-basin-09060.herokuapp.com'

export const ytURL = 'https://chaos87.pythonanywhere.com'
export const bandcampURL = 'https://api-backtube-bandcamp.herokuapp.com'
export const cognitoURL = 'https://backtube.auth.us-east-2.amazoncognito.com'
// export const baseURL = 'http://localhost:5000'
// export const streamingURL = 'http://localhost:5000'
