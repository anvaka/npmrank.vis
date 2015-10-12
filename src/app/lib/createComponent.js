import React, { Component } from 'react';

module.exports = createComponent;

function createComponent(factory) {
  class CustomComponent extends Component {
    constructor(props) {
      super(props);
      var self = this;
      var model = this.props.model;
      if (!model || !typeof model.on === 'function') return;

      this.componentWillUnmount = function() {
        model.off('change', onChange);
      };

      this.componentWillMount = function() {
        model.on('change', onChange);
      };

      function onChange() {
        self.forceUpdate();
      }
    }

    render() {
      return this.props.model ? factory(this.props.model) : null;
    }
  }

  return CustomComponent;
}
