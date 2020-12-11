import { baseURL, streamingURL, ytURL } from '../config/urls';
import { pad } from '../services/utils';
import { addMosaicToObject } from '../services/utils';

export const makeYoutubeSearchApiCall = async searchInput => {
  const searchUrl = ytURL + `/search/yt`;
  let response = await fetch(searchUrl, {method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"query": searchInput})})
    .then(response => {
      return response.json();
    })
    .catch(error => {
        return error;
    })
    return response;
};

export const makeBandcampSearchApiCall = async searchInput => {
  const searchUrl = streamingURL + `/bandcamp/search`;
  let response = await fetch(searchUrl, {method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"query": searchInput})}
      ).then(res => {
          return res.json();
      }).catch(error => {
          return error
      });
  const tmpArtistAlbums = await searchBCartistAlbums(streamingURL, response.filter(x => x.type === "artist").map(x => x.url));
  const artistAlbums = tmpArtistAlbums.flat().filter(x => !x.includes('?action=download'));
  const nearlyAllAlbums = artistAlbums.concat(response.filter(x => x.type === "album").map(x => x.url));
  const trackAlbums = await searchBCtrack4Album(streamingURL, nearlyAllAlbums.filter(x => x.includes('/track/')));
  const allAlbumsDuplicated = nearlyAllAlbums.filter(x => !x.includes('/track/')).concat(trackAlbums.filter(x => x));
  const allAlbums = [...new Set(allAlbumsDuplicated)];
  const results = await searchBCalbumDetails(streamingURL, allAlbums);
  return {
          albums: results.filter(x => x).filter(x => x.tracks.length > 0)
      };
};

const searchBCalbumDetails = (streamingURL, url) => {
  const fetches = [];
  for (let i = 0; i < url.length; i++) {
    fetches.push(
      fetch(streamingURL + '/bandcamp/songs', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"url": url[i]})
      })
      .then(res => {return res.json(); })
      .then(res => {
          let tracks = res["raw"]["trackinfo"].filter(x => x.file);
          let tracks_updated = tracks.map(function(o) {
                                      o.artist = res["artist"];
                                      o.thumbnail = res["imageUrl"];
                                      o._id = o.track_id;
                                      o.url = url[i].split("/album/")[0] + o.title_link;
                                      return o;
                                    })
          let releaseDate = new Date(Date.parse(res["raw"]["current"]["release_date"]));
          releaseDate = releaseDate.getFullYear() + "-" + pad((releaseDate.getMonth() + 1), 2) + "-" + pad(releaseDate.getDate(), 2);
          const result = {
              "url": res["url"],
              "_id": res["url"],
              "artist": res["artist"],
              "title": res["title"],
              "thumbnail": res["imageUrl"],
              "releaseDate": releaseDate,
              "tracks": tracks_updated,
          }
          return result
      })
      .catch(err => {return console.log(err);})
    );
  }
 return Promise.all(fetches)
}

const searchBCtrack4Album = (streamingURL, url) => {
  const fetches = [];
  for (let i = 0; i < url.length; i++) {
    fetches.push(
      fetch(streamingURL + '/bandcamp/songs', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"url": url[i]})
      })
      .then(res => {return res.json(); })
      .then(res => {
          return res["raw"]["packages"] ? res["raw"]["packages"][0]["album_url"] : null
      })
      .catch(err => {return console.log(err);})
    );
  }
 return Promise.all(fetches)
}

const searchBCartistAlbums = async (streamingURL, artists) => {
  const fetches = [];
  for (let i = 0; i < artists.length; i++) {
    fetches.push(
      fetch(streamingURL + '/bandcamp/albums', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"url": artists[i]})
      })
      .then(res => {return res.json(); })
      .catch(err => {return console.log(err);})
    );
  }
 return Promise.all(fetches)
}

export const searchPlaylistsApi = async (userInfo) => {
    const accessToken = userInfo.accessToken;
    const query = userInfo.searchString
    const postUrl = baseURL + `/api/playlist/search`;
    let playlists = await fetch(postUrl, { method: 'POST',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"searchString": query})

    })
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if (res) {
            return res.map(el => addMosaicToObject(el))
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return playlists;
}
