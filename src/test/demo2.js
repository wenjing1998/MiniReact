import MiniReact from '../MiniReact';

// 较复杂的JSX(The createElement Function)

// 1、define a React element.
// 'React' must be in scope when using JSX  react/react-in-jsx-scope
/** @jsx MiniReact.createElement */
const element = (
  <div style="background-color: salmon">
    <h1>Hello World!</h1>
    <h2 style="text-align: right">from MiniReact</h2>
  </div>
);

// Babel 将上述 JSX 语句转义为以下语句：
// const element = MiniReact.createElement("div", {
//   style: "background-color: salmon"  // Warning: Style prop value must be an object.  (by react/style-prop-object)
// },
//   React.createElement("h1", null, "Hello World!"),
//   React.createElement("h2", {
//     style: "text-align: right"
//   }, "from MiniReact")
// );

const container = document.getElementById('root');

MiniReact.render(element, container);
