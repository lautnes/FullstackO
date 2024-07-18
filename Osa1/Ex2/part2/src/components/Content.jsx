import React from 'react';
import Part from './Part';
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
        <Part key={part.name} part={part} />
      ))}
      <Total parts={parts} />
    </div>
  );
}

export default Content;
