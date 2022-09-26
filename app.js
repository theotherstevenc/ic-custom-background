const express = require('express')
const _ = require('lodash')
const app = express()

app.use('/', express.static('dist'))
app.listen(process.env.PORT || 3000, () => {
  console.log(`localhost//:3000`)
})
