import React from 'react';

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <h2>Total of {total} exercises</h2>
  );
}

export default Total;
