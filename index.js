require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
  Person.find({}).then(person => {
    response.json(person)
  })
})

// INFO Page
app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

// GET BY ID
app.get('/api/persons/:id', (request,response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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

  const newPerson = request.body
  console.log(newPerson)

  if(newPerson === undefined){
    return response.status(400).json({ error: 'content missing' })
  }

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

  // let person = Person.find(person => person.name === newPerson.name)
  // console.log("99: ", person)
  // if(person){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  
  // persons = persons.concat(newPerson)
  // response.json(newPerson)
})


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})