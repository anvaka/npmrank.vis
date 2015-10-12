/**
 * defines mapping between App events and view model fields
 */
var App = require('../events/App.js');
var createViewModel = require('./lib/createViewModel.js');

module.exports = createViewModel({
  'hover': 'hovered',
  'dateChanged': 'date'
}, App);
