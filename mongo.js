// PM3Gwl8njfZA7Gbl

const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

mongoose.set('strictQuery', false);
mongoose.connect(url);

personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: `${process.argv[3]}`,
  number: `${process.argv[4]}`,
});

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log(
      persons.forEach((x) => console.log(`${x.name} ${x.number}`))
    );
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log(
      `Added ${result.name}, Number: ${result.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
