let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')
let app = express() 

let redirect_uri_login = 'http://localhost:8888/spotify-callback'
let client_id = 'd82c830182324e1e995a4203196c110b'
let client_secret = 'd82c830182324e1e995a4203196c110b'

app.use(cors())


// spotify login
app.get('/spotify-login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'user-read-private user-read-email user-library-read',
        redirect_uri: redirect_uri_login
      }))
  })

  app.get('/spotify-callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            client_id + ':' + client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      // var access_token = body.access_token
      // let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

      // res.redirect(uri + '?access_token=' + access_token)
    })
  })

  

app.get('/soundcloud-login', function(req, res) {
    res.redirect('https://api.soundcloud.com/connect?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri_login
      }))
  })

app.get('/soundcloud-callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://api.soundcloud.com/oauth2/token',
    form: {
      code: code,
      redirect_uri: redirect_uri_login,
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
    },
    headers: {
      'accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)