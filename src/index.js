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
// const element = (
//   // Warning: Style prop value must be an object.  (by react/style-prop-object)
//   <div style="background-color: salmon">
//     <h1>Hello World!</h1>
//     <h2 style="text-align: right">from MiniReact</h2>
//   </div>
// );

// Babel 将上述 JSX 语句转义为以下语句：
// const element = React.createElement("div", {
//   style: "background-color: salmon"  // Warning: Style prop value must be an object.  (by react/style-prop-object)
// },
//   React.createElement("h1", null, "Hello World!"),
//   React.createElement("h2", {
//     style: "text-align: right"
//   }, "from MiniReact")
// );

/** @jsx MiniReact.createElement */
// function App(props) {
//   return <h1>Hi {props.name}</h1>
// };

// function App(props) {
//   return MiniReact.createElement(
//     'h1',
//     null,
//     'Hi',
//     props.name
//   );
// };

// const element = <App name="foo" />;

// MiniReact.createElement(
//   App, {
//     name: 'foo'
//   }
// );

/** @jsx MiniReact.createElement */
function Counter() {
  const [state, setState] = MiniReact.useState(1);

  // increments 增量
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  );
};

const element = <Counter />;

const container = document.getElementById('root');

// const updateValue = e => {
//   // console.log('updateValue e.target.value', e.target.value);
//   rerender(e.target.value);
// };

// step II: The render Function

// ReactDOM.render(element, container);
MiniReact.render(element, container);

// const rerender = value => {
//   /** @jsx MiniReact.createElement */
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   MiniReact.render(element, container);
// };

// 过程 createElement（input） -> createTextElement('Hello') -> createTextElement('world')
// -> createElement(h2) -> createElement(div)

// const element = MiniReact.createElement(
//   "div",
//   null,
//   MiniReact.createElement(
//     "input", {
//     onInput: updateValue,
//     value: value
//   }),
//   MiniReact.createElement(
//     "h2",
//     null,
//     "Hello ",
//     value
//   )
// );

// rerender('World');

