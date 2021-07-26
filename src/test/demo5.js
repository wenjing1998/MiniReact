import MiniReact from "../MiniReact";

// Hooks

const Counter = () => {
  const [state, setState] = MiniReact.useState(0);

  return (
    <h1 onClick={() => setState(count => count + 1)}>
      Count: {state}
    </h1>
  );
};

const element = <Counter />;

const container = document.getElementById('root');

MiniReact.render(element, container);
