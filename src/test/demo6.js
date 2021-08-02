// import React, { useEffect } from 'react';
// import ReactDom from 'react-dom';
import MiniReact from '../MiniReact';

// Hooks

/** @jsx MiniReact.createElement */
const Counter = () => {
  const [state, setState] = MiniReact.useState(0);

  return (
    <h1 onClick={() => {
      // useState 是异步的，第三步setState还没有执行完，已经进行console，console拿到三次setState之前的state
      setState(count => count + 1);
      setState(count => count + 1);
      setState(count => count + 1); // 页面渲染的正确
      console.log('state', state);  // 打印拿的是上一次的
    }}>
      Count: {state}
    </h1>
  );
};

const element = <Counter />;

const container = document.getElementById('root');

MiniReact.render(element, container);
