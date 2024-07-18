import React from 'react';
import Total from './Total';

const Content = () => {
  const parts = [
    { name: 'Fundamentals of React', exercises: 10 },
    { name: 'Using props to pass data', exercises: 7 },
    { name: 'State of a component', exercises: 14 }
  ];

  return (
    <div>
      {parts.map(part => (
        <p key={part.name}>
          {part.name} {part.exercises}
        </p>
      ))}
      <Total parts={parts} />
    </div>
  );
}

export default Content;
