require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))

// Schema and Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Person = mongoose.model('Person', personSchema)

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Serve static files from the 'dist' directory (frontend build)
app.use(express.static(path.join(__dirname, 'dist')))

// Routes

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST a new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// DELETE a person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

// PUT to update a person’s number
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = {
    name,
    number,
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

// GET phonebook info
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

// Middleware for handling unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


// Serve index.html for any unknown paths (client-side routing support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
