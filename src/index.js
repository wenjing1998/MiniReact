// import React from 'react';
// import ReactDOM from 'react-dom';
import MiniReact from './MiniReact';

// step 0: review

// 1、define a React element.
// const element = <h1 title="foo">Hello World!</h1>;

// JSX => valid JS => vanilla JS

// const element = React.createElement(
//   'h1',
//   { title: 'foo' },
//   'hello'
// );

// const element = {
//   type: 'h1',
//   // props: it has all the keys and values from the JSX attributes
//   props: {
//     title: 'foo',
//     children: 'hello'
//   }
// };

// 2、get a node from the DOM.
// const container = document.getElementById('root');


// 3、render the React element into the container.
// ReactDOM.render(element, container);

// const node = document.createElement(element.type);
// node['title'] = element.props.title;

// Using textNode instead of setting innerText will allow us to treat all elements in the same way later.
// const text = document.createTextNode('');
// Note also how we set the nodeValue like we did it with the h1 title, it’s almost as if the string had
// text['nodeValue'] = element.props.children;

// node.appendChild(text);
// container.appendChild(node);




// step I: The createElement Function


// 'React' must be in scope when using JSX  react/react-in-jsx-scope
/** @jsx MiniReact.createElement */
const element = (
  // Warning: Style prop value must be an object.  (by react/style-prop-object)
  <div style="background-color: salmon">
    <h1>Hello World!</h1>
    <h2 style="text-align: right">from MiniReact</h2>
  </div>
);

// Babel 将上述 JSX 语句转义为以下语句：
// const element = React.createElement("div", {
//   style: "background-color: salmon"  // Warning: Style prop value must be an object.  (by react/style-prop-object)
// },
//   React.createElement("h1", null, "Hello World!"),
//   React.createElement("h2", {
//     style: "text-align: right"
//   }, "from MiniReact")
// );

const container = document.getElementById('root');


// step II: The render Function


// ReactDOM.render(element, container);
MiniReact.render(element, container);

