const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Root page
app.get('/', (request,response) => {
    response.send('<h1>Hello World </h1>')
})

// GET ALL
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// INFO Page
app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

// GET BY ID
app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  const person = persons.find(person=> person.id === id) //find() returns object.
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

// DELETE
app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person=> person.id !== id) //filter() returns array.
  response.status(204).end()
})

// CREATE
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.post('/api/persons', (request, response) => {
  let newId = getRandomInt(100000);
  const newPerson = request.body

  if(!newPerson.name){
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  else if(!newPerson.number){
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = persons.find(person => person.name === newPerson.name)
  if(person){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  newPerson.id = newId
  persons = persons.concat(newPerson)
  response.json(newPerson)
})


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})