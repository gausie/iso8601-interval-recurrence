'use strict';

var moment = require('moment');

module.exports = function isInRange(range, date) {
	var start = range.start;
	var end = range.end;

	start = start.split('/');
	end = end.split('/');
	date = moment(date);

	var whichRepetition = function whichRepetition(isoDateRange, date) {
		var startDate = isoDateRange[1];
		var difference = date.diff(moment(isoDateRange[1]));

		var period = moment.duration(isoDateRange[2]).asMilliseconds();

		return Math.floor(difference / period);
	};

	if (start[0] === 'R' && end[0] === 'R') {
		var Rs = whichRepetition(start, date);
		var Re = whichRepetition(end, date);

		return Rs > Re;
	} else if (start[0] === 'R' || end[0] === 'R') {
		throw Error('Cannot mix recurring interval with absolute time.');
	} else if (start.length > 1 || end.length > 1) {
		// Ideally if we do not use start and end intervals we would use startDate/endDate,
		// but then we would have to have a different object layout.
		throw Error('Either use recurring interval ISO8601 timestamps or standard ISO8601 timestamps.');
	} else {
		return date.isBetween(start, end);
	}
};