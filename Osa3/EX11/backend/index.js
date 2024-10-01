const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // Lisää cors
const app = express();

// Ota cors käyttöön **kaikille** reiteille
app.use(cors());

app.use(express.json());
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();

  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
  `);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    });
  }

  const newId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) + 1 : 1;

  const person = {
    id: newId,
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

// Tuntemattomien endpointien käsittely
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

