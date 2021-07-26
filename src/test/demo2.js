import MiniReact from '../MiniReact';

// 较复杂的JSX

const element = (
  <div style="background-color: salmon">
    <h1>Hello World!</h1>
    <h2 style="text-align: right">from MiniReact</h2>
  </div>
);

const container = document.getElementById('root');

MiniReact.render(element, container);
