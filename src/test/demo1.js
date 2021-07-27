import MiniReact from '../MiniReact';

// 简单的JSX

// 1、define a React element.
/** @jsx MiniReact.createElement */
const element = <h1 title="foo">Hello World!</h1>;

// JSX => valid JS => vanilla JS

// MiniReact.createElement(
//   'h1', 
//   { title: 'foo' },
//   'Hello World!'
// );

// {
//   type: 'h1',
//   // props: it has all the keys and values from the JSX attributes
//   props: {
//     title: 'foo',
//     children: 'Hello world'
//   }
// }

// 2、get a node from the DOM.
const container = document.getElementById('root');

// 3、render the React element into the container.
MiniReact.render(element, container);
