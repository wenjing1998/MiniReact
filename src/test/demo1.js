import MiniReact from '../MiniReact';

// 简单的JSX

const element = <h1 title="foo">Hello World!</h1>;
// MiniReact.createElement('h1', {
//   title: 'foo',
// }, 'Hello World!');

// {
//   type: 'h1',
//   props: {
//     title: 'foo',
//     children: 'Hello world'
//   }
// }

const container = document.getElementById('root');

MiniReact.render(element, container);
