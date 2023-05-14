const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
);

let people = [
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

app.get('/api/persons', (req, res) => {
  res.json(people);
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      people.length
    } people</p><br /><p>${new Date().toString()}</p>`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = people.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons/', (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  if (people.filter((n) => n.name === person.name)) {
    return res.json({
      error: 'Name must be unique',
    });
  }
  const randomId = Math.random() * 1000;

  let newPerson = {
    name: person.name,
    number: person.number,
    id: randomId,
  };
  people = people.concat(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  people = people.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
