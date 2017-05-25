const cors = require('cors')
const r = require('rethinkdb')
const Express = require('express')
const bodyparser = require('body-parser')

require('rethinkdb-init')(r)
const app = new Express()

const cfg = {
  server: {
    host: 'localhost',
    port: 28015,
    db: 'students'
  },
  tables: [
    { name: 'list', indexes: ['name'] }
  ]
}

r
  .init(cfg.server, cfg.tables)
  .then(conn => {
    r.conn = conn
  })

app.use(bodyparser.json())
app.use(cors())

app.get('/', function (req, res) {
  res
    .status(404)
    .send(`Send GET request to <pre>/list</pre> for a List of records <br />
Send a POST request to <pre>/add</pre> to add a record to the Database.`)
})

app.post('/add', function (req, res) {
  if (!req.body.name) return res.status(400).send('name is required')
  r
    .db('students')
    .table('list')
    .insert(req.body)
    .run(r.conn)
    .then(result => res.send(`inserted ${result.inserted} rows.`))
    .error(err => res.status(400).json(err))
})

app.get('/list', function (req, res) {
  r
    .db('students')
    .table('list')
    .run(r.conn)
    .then(cur => cur.toArray())
    .then(data => res.json({data}))
})

app.listen(8000, function () {
  console.log('Server is listening on http://localhost:8000/')
})
