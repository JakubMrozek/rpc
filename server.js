const express = require('express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()

const PORT = process.env.PORT || 8000
const DB_URL = process.env.DB_URL

const db = pgp(DB_URL)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
  extended: true 
}))
app.all('*', processRequst)
app.listen(PORT)


function processRequst(req, res, next) {
  insertRow(req.headers, req.query, req.body)
  .then(() => {
    res.status(204)
    res.end()
  })
  .catch(next)
}

function insertRow(headers, query, body) {
  const sql = 'INSERT INTO requests (headers, query, body) VALUES ($1, $2, $3)'
  const values = [headers, query, body].map(value => JSON.stringify(value))
  return db.none(sql, values)
}