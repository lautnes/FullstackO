import React from 'react';
import Header from './components/Header';
import Content from './components/Content';

const App = () => {
  const course = 'Half Stack application development';

  return (
    <div>
      <Header course={course} />
      <Content />
    </div>
  );
}

export default App;
