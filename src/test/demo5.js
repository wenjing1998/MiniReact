import MiniReact from "../MiniReact";

// Hooks

/** @jsx MiniReact.createElement */
const Counter = () => {
  const [state, setState] = MiniReact.useState(0);

  // increments 增量
  return (
    <h1 onClick={() => setState(count => count + 1)}>
      Count: {state}
    </h1>
  );
};

const element = <Counter />;

const container = document.getElementById('root');

MiniReact.render(element, container);
