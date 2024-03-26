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

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {

  let temp_url = req.body.url

  try{
    //checks if url format is valid
    temp_url = new URL(temp_url)

    //checks if hostname is valid
    dns.lookup(temp_url.hostname, (err, add, fam)=>{
      if (err){
        res.json({
          error: temp_url
        })        
      }
    })

    const idx = Object.keys(d).length + 1

    d[idx] = temp_url
  
    res.json({ 
      original_url: temp_url,
      short_url: idx
    });
    
  }
  catch{
    res.json({
      error: temp_url
    })
  }
});


app.get('/api/shorturl/:short', (req, res) => {

  let temp_idx = req.params.short
  console.log(d)

  res.redirect(d[temp_idx])

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
