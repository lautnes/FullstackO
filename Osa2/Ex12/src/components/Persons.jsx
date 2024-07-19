import Person from './Person';

const Persons = ({ personsToShow }) => (
  <div>
    {personsToShow.map(person => (
      <Person key={person.name} person={person} />
    ))}
  </div>
);

export default Persons;
