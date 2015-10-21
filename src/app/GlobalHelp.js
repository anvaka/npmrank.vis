import React, { Component } from 'react';

class GlobalHelp extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
    if (!this.state.open) {
      return (
        <div className='navigation-help closed'>
          <h4><a onClick={e => this.handleToggleHelp(e)}>Help</a></h4>
        </div>
      );
    }
    return (
      <div className='navigation-help opened'>
      <table><tbody>
      <tr>
        <td colSpan="2"><code className='important-key'>spacebar</code></td>
        <td colSpan="2">Advance date forward</td>
      </tr>
      <tr className='spacer-row'>
        <td colSpan='2'><code className='important-key' >shift+spacebar</code></td>
        <td colSpan='2'>advance date backwards</td>
      </tr>
      <tr className='spacer-row'>
        <td colSpan='4'><h4>camera control</h4></td>
      </tr>
      <tr>
      <td><code>W</code></td>
      <td>Move forward</td>
      <td><code>Up</code></td>
      <td>Rotate up</td>
      </tr>
      <tr>
      <td><code>S</code></td>
      <td>Move backward</td>
      <td><code>Down</code></td>
      <td>Rotate down</td>
      </tr>
      <tr>
      <td><code>A</code></td>
      <td>Move left</td>
      <td><code>Left</code></td>
      <td>Rotate left</td>
      </tr>
      <tr>
      <td><code>D</code></td>
      <td>Move right</td>
      <td><code>Right</code></td>
      <td>Rotate right</td>
      </tr>
      <tr>
      <td><code>Q</code></td>
      <td>Roll right</td>
      <td><code>R</code></td>
      <td>Fly up</td>
      </tr>
      <tr>
      <td><code>E</code></td>
      <td>Roll left</td>
      <td><code>F</code></td>
      <td>Fly down</td>
      </tr>
      <tr>
      <td colSpan='4'>
        <a href='https://github.com/anvaka/npmrank.vis' target='_blank'>View Source Code</a>
      </td>
      </tr>
      <tr>
      <td colSpan='4'>
        <a onClick={e => this.handleCloseHelp(e)}>Close Help</a>
      </td>
      </tr>
      </tbody></table>
    </div>);
  }

  handleToggleHelp(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open
    });
  }

  handleCloseHelp(e) {
    e.preventDefault();
    this.setState({ open: false });
  }
}

export default GlobalHelp;
