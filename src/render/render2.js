let wipRoot = null;
let currentRoot = null; // 根节点在上次更新时的 fiber 节点
let deletions = null;
let nextUnitOfWork = null;

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
};

const isEvent = key => key.startsWith('on');
const isProperty = key =>
  key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key =>
  prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key => 
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.removeEventListener(
        eventType,
        prevProps[name]
      );
    });

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = '';
    });

  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.addEventListener(
        eventType,
        nextProps[name]
      );
    });
};

// commit 阶段开始
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
};

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;

  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;

  // 根据 effectTag 做相应的 DOM 操作（commit 阶段的 mutation 阶段，DOM渲染）
  if (
    fiber.effectTag === 'PLACEMENT' &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === 'UPDATE' &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    );
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
};

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }

  deletions = [];
  nextUnitOfWork = wipRoot;
};

function workLoop(deadline) {
  // console.log('workLoop');
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // nextUnitOfWork 记录着当前要操作的fiber，如果中断了，下次继续的话还是可以取到上次中断时候的fiber
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // instanceof 运算符用于检测构造函数的 prototype 属性（原型）是否出现在某个实例对象的原型链上。
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  
  // 同步的可以拿到fiber.child吗？
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      // “递”
      return nextFiber.sibling;
    }
    // “归”
    nextFiber = nextFiber.parent;
  }
  // 最后回到root上应该也是要有返回值的？
};

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 将hooks置空，重新push进去新的，state就会是新的值
  const children = [fiber.type(fiber.props)]; // 嗯？children怎么是这样的？[App(props)]此时的props是新的吗？
  reconcileChildren(fiber, children);
};

// const Counter = () => {
//   const [state, setState] = MiniReact.useState(0);
//   return (
//     <h1 onClick={() => setState(count => count + 1)}>
//       Count: {state}
//     </h1>
//   );
// };
// const element = <Counter />;

const useState = (initial) => {
  // console.log('useState 何时执行？');
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];

  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    // console.log('setState'); // 执行了三次
    hook.queue.push(action);
    // console.log('wipRoot before', wipRoot);//null
    // 考虑这中间是不是有其他方法在实现？
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props, // 从props中拿到了child
      alternate: currentRoot
    };
    // console.log('wipRoot after', wipRoot); // 此时为什么会存在child？
    // set a new work in progress root as the next unit of work so the work loop can start a new render phase.
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  // console.log('wipFiber.hooks', wipFiber.hooks); // 放置多个不同的setState
  return [hook.state, setState];
};

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
};

// diff 算法
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (
    index < elements.length ||
    oldFiber != null // 非全等，undefined == null （true）
  ) {
    // update
    const element = elements[index];
    let newFiber = null;

    const sameType =
      oldFiber &&
      element &&
      element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }

    // 首屏渲染时是否只会为 root fiber 节点设置 effectTag 为 placement？
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }

    if (oldFiber && !sameType) {
      // 如果两个 fiber 的 type 不一样，会直接删除这个 fiber 及其子孙 fiber，重新创建一个新的。
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
};

export { render, useState };
