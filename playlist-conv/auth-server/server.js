let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')
let app = express() 

let spotify_redirect_uri_login = 'http://localhost:8888/spotify-callback'
let spotify_client_id = 'd82c830182324e1e995a4203196c110b'
let spotify_client_secret = '159e2917e7f8497585de232385fdb67f'
let sc_redirect_uri_login = 'http://localhost:8888/spotify-callback'
let sc_client_id = 'd82c830182324e1e995a4203196c110b'
let sc_client_secret = '159e2917e7f8497585de232385fdb67f'

app.use(cors())

// Spotify Login
app.get('/spotify-login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotify_client_id,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: spotify_redirect_uri_login
    }))
})


app.get('/spotify-callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify_redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            spotify_client_id + ':' + spotify_client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

      res.redirect(uri + '?access_token=' + access_token)
    })
  })

  // Soundcloud Login
  app.get('/soundcloud-login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: sc_client_id,
        scope: 'user-read-private user-read-email user-library-read',
        redirect_uri: sc_redirect_uri_login
      }))
  })

  app.get('/soundcloud-callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: sc_redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            sc_client_id + ':' + sc_client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

      res.redirect(uri + '?access_token=' + access_token)
    })
  })


  // listen port
let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /spotify-login to initiate authentication flow.`)
app.listen(port)
