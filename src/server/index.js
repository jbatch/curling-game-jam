const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Super Mega Curling Game'))
app.get('/api/fire-event', (req, res) => {
    console.log('event receieved new')
    res.send('Event received!')
})

app.listen(port, () => {
    console.log(`Server started, listening on port ${port}!`)
})