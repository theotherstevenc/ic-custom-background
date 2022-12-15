require('dotenv').config()

const express = require('express')
const _ = require('lodash')
const fetch = require('node-fetch')
const cors = require('cors')
const app = express()

app.use(cors())

// app.use('/', express.static('dist'))

app.get('/', (req,res)=>{

  const limit = req.query.limit || 5
  const sortby = req.query.sort || 'popularity'

  fetch(`${process.env.API_BASE_URL}?key=${process.env.API_KEY}&sort=${sortby}`)
    .then(res => res.json())
    .then(data => {
      res.send(JSON.stringify(
        data.items.map(el => el.family)
        .slice(0,limit)
      ))
    });
  
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`localhost//:3000`)
})
