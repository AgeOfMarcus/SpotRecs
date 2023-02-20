// Initialize the Spotify Web API
window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Spotify Playlist Extractor',
      getOAuthToken: cb => {
        // Replace with your own client ID and secret
        const CLIENT_ID = '13bbc4d460b944fa83ed8b3ac5cdec76';
        const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
        fetch('https://accounts.spotify.com/api/token', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
          },
          body: 'grant_type=client_credentials',
        })
        .then(response => response.json())
        .then(data => {
          cb(data.access_token);
        });
      },
    });
  
    // Connect to the Spotify Web Player
    player.connect();
  };
  
  // Log in to Spotify
  const loginButton = document.getElementById('login-button');
  loginButton.addEventListener('click', () => {
    // Replace with your own client ID and redirect URI
    const CLIENT_ID = '13bbc4d460b944fa83ed8b3ac5cdec76';
    const REDIRECT_URI = 'YOUR_REDIRECT_URI';
    const scopes = ['playlist-read-private'];
    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}`;
    window.location = url;
  });
  
  // Extract songs from a playlist
  const extractButton = document.getElementById('extract-button');
  extractButton.addEventListener('click', () => {
    // Replace with your own access token
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const playlistId = document.getElementById('playlist-dropdown').value;
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      const songList = document.getElementById('song-list');
      songList.innerHTML = '';
      data.items.forEach(item => {
        const songTitle = item.track.name;
        const artistName = item.track.artists[0].name;
        const listItem = document.createElement('div');
        listItem.innerText = `${songTitle} - ${artistName}`;
        songList.appendChild(listItem);
      });
    });
  });
  
  // Populate the playlist dropdown with the user's playlists
  window.onload = () => {
    // Replace with your own access token
    const accessToken = 'YOUR_ACCESS_TOKEN';
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      const playlistDropdown = document.getElementById('playlist-dropdown');
      data.items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.innerText = item.name;
        playlistDropdown.appendChild(option);
      });
      document.getElementById('playlist-selection').style.display = 'block';
    });
  };
  