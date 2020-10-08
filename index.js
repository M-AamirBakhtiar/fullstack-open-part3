require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/Person');

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static('build'));
app.use(cors());
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

app.get('/api/persons', async (req, res, next) => {
  const persons = await Person.find({});

  res.status(200).json(persons);
});

app.get('/api/persons/:id', async (req, res, next) => {
  const person = await Person.findById(req.params.id);

  res.status(200).json(person);
});

app.post('/api/persons', async (req, res, next) => {
  const body = req.body;

  const person = await Person.findOne({ name: body.name });

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  } else if (person) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();

    res.status(201).json(savedPerson);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  const result = await Person.findByIdAndDelete(req.params.id);
  console.log(result);
  res.status(204).end();
});

app.get('/info', (req, res, next) => {
  const message = `Phonebook has info for ${persons.length} people`;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  res.send(`
  <h3>${message}</h3>
  <p>${date} ${time}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
