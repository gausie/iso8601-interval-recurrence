var assert = require('assert');
var iso8601range = require('../dist/');

exports['check with start date and interval'] = function () {
	// Matches every Wednesday
	var range = {
		interval: '2015-07-22T00:00:00.000Z/P1D',
		recurrence: 'R/P1W'
	};

	var wednesday = '2015-07-29T13:00:00.000Z';
	var tuesday = '2015-07-23T11:12:13.000Z';

	assert.eql(iso8601range(range, wednesday), true);
	assert.eql(iso8601range(range, tuesday), false);
};

exports['check with end date and interval'] = function () {
	// Matches every wednesday
	var range = {
		interval: 'P1D/2015-07-23T00:00:00.000Z',
		recurrence: 'R/P1W'
	};

	var wednesday = '2015-07-29T13:00:00.000Z';
	var tuesday = '2015-07-23T11:12:13.000Z';

	assert.eql(iso8601range(range, wednesday), true);
	assert.eql(iso8601range(range, tuesday), false);
};

exports['follow number of recurrences'] = function () {
	// Matches every Wednesday for two weeks
	var range = {
		interval: '2015-07-22T00:00:00.000Z/P1D',
		recurrence: 'R2/P1W'
	};

	var two_weeks_after = '2015-08-05T00:00:00.000Z';
	var three_weeks_after = '2015-08-12T00:00:00.000Z';

	assert.eql(iso8601range(range, two_weeks_after), true);
	assert.eql(iso8601range(range, three_weeks_after), false);
};

exports['check between two specific dates'] = function () {
	// Matches every Wednesday for two weeks
	var range = {
		interval: '2015-07-22T00:00:00.000Z/2015-07-22T12:00:00.000Z',
	};

	var before_midday = '2015-07-22T09:00:00.000Z';
	var after_midday = '2015-07-22T17:00:00.000Z';

	assert.eql(iso8601range(range, before_midday), true);
	assert.eql(iso8601range(range, after_midday), false);
};