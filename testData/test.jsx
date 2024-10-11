import React from 'react';

const Greeting = () => {
  const name = "John";
  const isMorning = true;

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Good {isMorning ? 'morning' : 'evening'}!</p>
      <button onClick={() => alert('Welcome to React!')}>Click Me</button>
    </div>
  );
};

export default Greeting;
