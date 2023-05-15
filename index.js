require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./modules/people');

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

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

// let people = [
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

app.get('/api/persons', (req, res) => {
  // res.json(people);
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get('/info', (req, res) => {
  Person.find({}).then((people) => {
    res.send(
      `<p>Phonebook has info for ${
        people.length
      } people</p><br /><p>${new Date().toString()}</p>`
    );
  });
});

app.get('/api/persons/:id', (req, res) => {
  // const id = Number(req.params.id);

  // const person = people.find((person) => person.id === id);

  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).end();
  // }
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.post('/api/persons/', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id);
  // people = people.filter((person) => person.id !== id);

  // res.status(204).end();
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.use(unknownEndpoint);
app.use(errorHandler);
