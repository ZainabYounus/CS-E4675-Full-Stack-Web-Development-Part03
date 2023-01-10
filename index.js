const express = require('express')
const app = express()
app.use(express.json())

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

app.get('/', (request,response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

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

app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person=> person.id !== id) //filter() returns array.
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let newId = getRandomInt(100000);
  const newNote = request.body
  newNote.id = newId
  persons = persons.concat(newNote)
  response.json(persons)
})


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})