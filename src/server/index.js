require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

const api_key = 'mbhLMB38eAG1VCORnGfymBsxlHnridCeGhOryd4N'

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        console.log("API called image of day:");
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// NASA - MARS Rover API call
app.get('/nasaAPI', async (req, res) => {
    app.listen(()=> console.log('App get was called'))
    try {
        let roverName = req.get('roverName');
        console.log("API called in for:", roverName);
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=100&api_key=mbhLMB38eAG1VCORnGfymBsxlHnridCeGhOryd4N`
        let data = await fetch(url)
            .then(res => res.json())
            //.then(data => console.log('data din api:', data));
        res.send({ data });
    } catch (err) {
        console.log('error:', err);
    }
})

// app.get('/rovers', async (req, res) => {
//     try {
//         const url = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${api_key}`
//         let rovers = await fetch(url)
//         rovers = await rovers.json();
//         res.send(rovers)
//         console.log('rovers: ', rovers);
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

// app.get('/rovers/:name', async (req, res) => {
//     try {
//         const cDate = req.query.max_date
//         const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY`
//         let image = await fetch(url)
//         image = await image.json();
//         res.send(image)
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

app.get("/get-apod", async (req, res) => {
    const generateAPODUrl = utils.generateNasaApiUrl("planetary/apod");
    const jsonData = await utils.getData(generateAPODUrl).catch((e) => {
        console.log("get-apod error " + e);
        res.status(500).send()
    });

    if (jsonData) {
        const data = JSON.stringify(jsonData);
        res.status(200).send(data);
    } else {

        res.status(500).end();
    }

});
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
  })

app.listen(port, () => console.log(`This app is listening on port ${port}!`))