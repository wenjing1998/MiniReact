import MiniReact from "../MiniReact";

// Function Component

/** @jsx MiniReact.createElement */
const App = props => {
  return <h1>Hi {props.name}</h1>
};

// function App(props) {
//   return MiniReact.createElement(
//     'h1',
//     null,
//     'Hi',
//     props.name
//   );
// };

const element = <App name="foo" />;

// MiniReact.createElement(
//   App, {
//     name: 'foo'
//   }
// );

const container = document.getElementById('root');

MiniReact.render(element, container);
