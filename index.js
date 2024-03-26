require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require("body-parser")
let dns = require("dns")
let url = require("url")

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let d = {}

function isValidUrl(string) {
  try {
    let newUrl = new URL(string);
    return newUrl.protocol === 'http:'
  } catch (err) {
    return false;
  }
}

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {

  let temp_url = req.body.url

  if (isValidUrl(temp_url)){
    //checks if url format is valid

    const idx = Object.keys(d).length + 1

    d[idx] = temp_url
  
    res.json({ 
      original_url: temp_url,
      short_url: idx
    });
    
  }
  else{
    res.json({
      error: 'invalid url'
    })
  }
});


app.get('/api/shorturl/:short', (req, res) => {

  let temp_idx = req.params.short

  res.redirect(d[temp_idx])

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
