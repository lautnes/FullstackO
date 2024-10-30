import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './components/personService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const displayNotification = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            displayNotification(`Updated ${returnedPerson.name}'s number`);
          })
          .catch(error => {
            displayNotification(`Information of ${existingPerson.name} has already been removed from the server`, true);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber
    };

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        displayNotification(`Added ${returnedPerson.name}`);
      })
      .catch(error => {
        displayNotification(`Failed to add ${newName}. Please try again.`, true);
      });
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          displayNotification(`Deleted ${person.name}`);
        })
        .catch(error => {
          displayNotification(`Information of ${person.name} has already been removed from the server`, true);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const personsToShow = search
    ? persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} isError={isError} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
