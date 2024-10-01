import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Lataa .env-tiedoston arvot
dotenv.config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {

  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Please provide the correct number of arguments: node mongo.js <password> <name> <number>');
  process.exit(1);
}
