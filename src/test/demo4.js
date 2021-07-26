import MiniReact from "../MiniReact";

// Function Component

const App = props => {
  return <h1>Hi {props.name}</h1>
};

const element = <App name="foo" />;

const container = document.getElementById('root');

MiniReact.render(element, container);
