const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny')); // Logging middleware using the "tiny" configuration

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

// Helper function to generate a random ID
const generateId = () => {
  return Math.floor(Math.random() * 1000000); // Generates a random ID between 0 and 999,999
};

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// GET a single person by ID
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// GET info about phonebook
app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();

  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
  `);
});

// DELETE a person by ID
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end(); // 204 No Content
});

// POST a new person
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Check for missing name or number
  if (!body.name) {
    return res.status(400).json({ error: 'Name is missing' });
  }
  if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' });
  }

  // Check for duplicate name
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

// Middleware for handling unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

// Register unknownEndpoint middleware after all routes
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
