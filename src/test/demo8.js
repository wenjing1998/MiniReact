// import React, { useEffect } from 'react';
// import ReactDom from 'react-dom';
import MiniReact from '../MiniReact';

// Hooks

/** @jsx MiniReact.createElement */
const Counter = () => {
  const [state, setState] = MiniReact.useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setState(count => count + 1);
      console.log('state', state);  // 打印拿的是上一次的
    }, 1000);
  };

  return (
    <h1 onClick={handleClick}>
      Count: {state}
    </h1>
  );
};

const element = <Counter />;

const container = document.getElementById('root');

MiniReact.render(element, container);
