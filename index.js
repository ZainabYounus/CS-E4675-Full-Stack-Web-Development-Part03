require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', function (req) { return JSON.stringify(req.body) })


// Root page
app.get('/', (request,response) => {
  response.send('<h1>Hello World </h1>')
})

// GET ALL
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => {
    response.json(person)
  })
    .catch(error => {next(error)})
})

// INFO Page
app.get('/info', (request, response, next) => {
  const date = new Date().toString()
  Person.find({}).then(person => {
    response.send(`<p>Phonebook has info for ${person.length} people</p> <p>${date}</p>`)
  })
    .catch(error => {next(error)})
})

// GET BY ID
app.get('/api/persons/:id', (request,response,next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }})
    .catch(error => {
      next(error)})
})

// DELETE
app.delete('/api/persons/:id', (request,response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// CREATE
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.post('/api/persons', (request, response, next) => {

  const newPerson = request.body

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
    .catch(error => {next(error)})

})

// UPDATE
app.put('/api/persons/:id', (request, response, next) => {
  const updatedPersonObj = request.body
  const person = {
    name: updatedPersonObj.name,
    number: updatedPersonObj.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})