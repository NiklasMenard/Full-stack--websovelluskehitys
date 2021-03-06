const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())


morgan.token('body', function(req, res) {
  if(req.method === 'POST'){
    const body = JSON.stringify(req.body)
    return body
  }
    return null
})

app.use(morgan(':method :url :response-time :body'))

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      },
      { 
        "name": "Bob", 
        "number": "12-33-433211",
        "id": 5
      }
]

app.get('/info', (req, res) => {
  const date = new Date()
  const length = persons.length
  
  res.send('Phonebook has info for ' + length + ' people ' + date)
    
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

const generatePNumber = () => {
  const pNumber = parseInt(Math.random()*1000000000, 10)
  return pNumber.toString()
}

app.post('/api/persons', (req, res) => {

  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = {
    name: body.name,
    number: generatePNumber(),
    id: generateId(),
  }

  if (persons.some(persons => persons.name === person.name
    ||persons.number === person.number) ) {
    return res.status(400).json({ 
      error: 'name must be unique or number must be unique' 
    })
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})