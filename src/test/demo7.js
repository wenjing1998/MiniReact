import React from 'react';
import ReactDom from 'react-dom';


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    const h1 = document.getElementById('h1');
    if (h1) {
      h1.addEventListener('click', () => {
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 }); // 最新的
        console.log('this.state.count', this.state.count); // 最新的
      });
    }
  }

  render() {
    return (
      <h1 id="h1">
        Counter: {this.state.count}
      </h1>
    );
  }
};

const element = <Counter />;

const container = document.getElementById('root');

ReactDom.render(element, container);
