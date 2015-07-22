var assert = require('assert');
var iso8601range = require('../dist/');

exports['does it work'] = function () {
	// Matches every Wednesday
	var range = {
		start: "R/2015-07-22T00:00:00.000Z/P1W",
		end: "R/2015-07-22T23:59:59.999Z/P1W"
	};

	var wednesday = '2015-07-29T13:00:00.000Z';
	var tuesday = '2015-07-23T11:12:13.000Z';

	assert.eql(iso8601range(range, wednesday), true);
	assert.eql(iso8601range(range, tuesday), false);
};