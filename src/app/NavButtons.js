import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import App from '../events/App.js';

class NavButtons extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
      return (
        <div className='navigation-buttons'>
          <ButtonGroup justified>
            <Button href="#" onClick={ e => this.advance(e, -1)}>Back</Button>
            <Button href="#" onClick={ e => this.advance(e, 1)}>Forward</Button>
          </ButtonGroup>
        </div>
      );
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
  advance(e, delta) {
    e.preventDefault();
    App.fire('advance', delta);
  }
}

export default NavButtons;
