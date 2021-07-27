import MiniReact from '../MiniReact';

// Reconciliation(The render Function)

// 2、get a node from the DOM.
const container = document.getElementById('root');

const updateValue = e => {
  renderer(e.target.value);
};

const renderer = (value) => {
  // 1、define a React element.
  /** @jsx MiniReact.createElement */
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );

  // 3、render the React element into the container.
  MiniReact.render(element, container);
};

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

renderer('World');
