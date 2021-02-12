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

app.get('/nasaAPI', async (req, res) => {
    try {
        let roverName = req.get('roverName');
        console.log("API called in for:", roverName);
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=100&api_key=${api_key}`
        let data = await fetch(url)
            .then(res => res.json())
        res.send({ data });
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/', function (req, res) {
    res.send('GET request to the homepage')
  })

app.listen(port, () => console.log(`This app is listening on port ${port}!`))