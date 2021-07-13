// And that’s it. We now have a library that can render JSX to the DOM.
const render = (element, container) => {
  // element = {
  //   type: 'div',
  //   props: {
  //     name: 'foo',
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
    .forEach(name => {
      dom[name] = element.props[name];
    });

  // children
  element.props.children.forEach(child =>
    // recursively 递归地
    render(child, dom)
  );

  container.appendChild(dom);
};

export default render;
