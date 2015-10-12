// Native objects are created separately.
import './styles/main.less';

require('./native/createNativeObjects.js')();

// React components too:
var React = require('react');
var ReactDOM = require('react-dom');

var MainView = require('./app/MainView.js');
var appViewModel = require('./app/mainViewModel.js');

ReactDOM.render(
  <MainView model={appViewModel} />,
  document.getElementById('react-root')
);
