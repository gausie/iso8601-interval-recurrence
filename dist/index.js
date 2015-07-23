'use strict';

var moment = require('moment');

var parseISO8601 = function parseISO8601(date) {
	// Split the date string by slashes.
	date = date.split('/');

	// Begin the object that we will return with the constitutent parts.
	var dateObject = {};

	// First deal with number of repetitions, if any.
	if (date[0].substring(0, 1) === 'R') {
		var recurrence = date[0].substring(1);
		if (recurrence === '') {
			dateObject.recurrence = Infinity;
		} else {
			recurrence = Number.parseInt(recurrence);
			if (!Number.isNaN(recurrence)) {
				dateObject.recurrence = recurrence;
			} else {
				return false;
			}
		}
		// The number of repetitions are then removed from the array.
		date.shift();
	}

	// If we have a zero length array, it's only ok if there has been a
	// zero recurrence.
	if (date.length === 0) {
		if (dateObject.recurrence === 0) {
			return dateObject;
		} else {
			return false;
		}
	}

	// Make some prelimiary determinations about the first index of the array.
	// Here we build a moment Object ahead of time, and check the validity of the
	// first index as a date or interval.
	var date0 = moment(date[0], moment.ISO_8601, true);
	var isDate0 = date0.isValid();
	var isInterval0 = date[0].substring(0, 1) === 'P' && moment.duration(date[0]) > 0;

	if (date.length === 2) {
		// If the lenght of the array is two, there is more to do. We make the same
		// preliminary determinations about the second index.
		var date1 = moment(date[1], moment.ISO_8601, true);
		var isDate1 = date1.isValid();
		var isInterval1 = date[1].substring(0, 1) === 'P' && moment.duration(date[1]) > 0;

		if (isDate0 && isDate1) {
			// If they are both valid dates...
			if (date.recurrence) {
				// ... with a repetition that is invalid.
				return false;
			} else {
				// ... we can turn the second date into a period.
				var difference = date1.diff(date0);

				dateObject.date = date[0];
				dateObject.interval = moment.duration(difference).toJSON();
				return dateObject;
			}
		} else if (isDate0 && isInterval1) {
			// If the first is a date and the second an interval, we have a basic
			// ISO8601 interval with a start date.
			dateObject.date = date[0];
			dateObject.interval = date[1];
			return dateObject;
		} else if (isInterval0 && isDate1) {
			// If the first is an interval and the second is a date, we have a
			// more complicated interval with an end date. However, we can just
			// invert the sign on the interval and treat it like normal.
			date1.subtract(moment.duration(date[0]));

			dateObject.date = date1.toISOString();
			dateObject.interval = date[0];
			return dateObject;
		} else {
			// Any other form of a two-length array must be invalid.
			return false;
		}
	} else if (date.length === 1) {
		// If the length of the array is one, we may be looking at some trivial dates.
		if (isDate0) {
			// If the value is a valid date...
			if (dateObject.recurrence) {
				// ... it is invalid with a repetition.
				return false;
			} else {
				// ... we can just return it.
				dateObject.date = date0;
				return dateObject;
			}
		} else if (isInterval0) {
			// An interval on its own is valid, as is it with a repetition.
			dateObject.interval = date[0];
			return dateObject;
		} else {
			// All other formations are invalid.
			return false;
		}
	} else {
		// Any other array lenghts at this stage are invalid.
		return false;
	}
};

module.exports = function isDateWithinRange(range, date) {
	var interval = range.interval;
	var recurrence = range.recurrence;

	if (!recurrence) {
		// A falsy recurrence value just means no recurrence.
		recurrence = 'R0';
	}

	interval = parseISO8601(interval);
	recurrence = parseISO8601(recurrence);

	date = moment(date);

	// Deal with various invalid inputs...

	// Interval will return false if it is invalid.
	if (!interval) {
		throw Error('Invalid interval.');
	}

	// The interval must have a date, an interval and no recurrence.
	if (interval.recurrence !== undefined || interval.date === undefined || interval.interval === undefined) {
		throw Error('Interval must have a date, an interval and no recurrence.');
	}

	// Recurrence will return false if it is invalid.
	if (!recurrence) {
		throw Error('Invalid recurrence.');
	}

	// The recurrence must have a recurrence and no date.
	if (recurrence.recurrence === undefined || recurrence.date !== undefined) {
		throw Error('Recurrence must have a recurrence, an interval and no date.');
	}

	// Recurrence can only have no interval if the recurrence is 0.
	if (recurrence.interval === undefined && recurrence.recurrence !== 0) {
		throw Error('Recurrence can only have no interval if the recurrence is 0.');
	}

	// Calculate what recurrence we are in.
	var difference = date.diff(moment(interval.date));
	var recurring_period = moment.duration(recurrence.interval).asMilliseconds();

	if (recurring_period === 0) {
		recurring_period = Infinity;
	}

	var which_recurrence = Math.floor(difference / recurring_period);
	var remainder = difference % recurring_period;

	// Check we're within allowed recurrences.
	// An value of Infinity suggests that the recurrence interval is zero.
	if (which_recurrence > recurrence.recurrence) {
		return false;
	}

	// Finally check whether we are in the interval for this recurrence.
	if (remainder > moment.duration(interval.interval).asMilliseconds()) {
		return false;
	}

	// If we got here it must be true, right?
	return true;
};