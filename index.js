const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors());
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res, next) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  const personName = persons.find((person) => person.name.includes(body.name));

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  } else if (personName) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  } else {
    const newPerson = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(newPerson);

    res.status(201).json(newPerson);
  }
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.get('/info', (req, res, next) => {
  const message = `Phonebook has info for ${presons.length} people`;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  res.send(`
  <h3>${message}</h3>
  <p>${date} ${time}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
