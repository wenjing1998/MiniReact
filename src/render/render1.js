// To render a React element into a root DOM node

// 只实现了简单的向页面添加 dom 节点，未实现 Function Component、更新 等场景。

function render(element, container) {
  // element = {
  //   type: '',
  //   props: {
  //     children: []
  //   }
  // }

  // type
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  // props
  const isProperty = key => key !== 'children';

  Object.keys(element.props)
  .filter(isProperty)
  .forEach(key => {
    dom[key] = element.props[key];
  });

  // children
  element.props.children.forEach(child => {
    // a recursive call (recursively 递归地)
    render(child, dom);
  });

  console.log('dom', dom);

  container.appendChild(dom);
};

export default render;

// 优化： There’s a problem with this recursive call.

// Once we start rendering, we won’t stop until we have rendered the complete element tree. 
// If the element tree is big, it may block the main thread for too long. 
// And if the browser needs to do high priority stuff like handling user input or keeping an animation smooth, 
// it will have to wait until the render finishes.
