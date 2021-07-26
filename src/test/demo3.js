import MiniReact from '../MiniReact';

// Reconciliation

const container = document.getElementById('root');

const updateValues = e => {
  renderer(e.target.value);
};

const renderer = (values) => {
  const element = (
    <div>
      <input onInput={updateValues} values={values} />
      <h1>Hello {values}</h1>
    </div>
  );
  MiniReact.render(element, container);
};

renderer('World');
