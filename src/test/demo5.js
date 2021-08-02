import MiniReact from "../MiniReact";

// Hooks

/** @jsx MiniReact.createElement */
const Counter = () => {
  console.log('我怀疑触发了一次state更新，组件就会重新走一遍，useState方法也会重新执行一遍。');
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
