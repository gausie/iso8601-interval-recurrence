var assert = require('assert');
var IntervalRecurrence = require('../dist/');

describe('iso8601-interval-recurrence', function () {

	it('should be able to check a date against a start date and interval', function () {
		// Matches every Wednesday
		var every_wednesday = new IntervalRecurrence({
			interval: '2015-07-22T00:00:00.000Z/P1D',
			recurrence: 'R/P1W'
		});

		var wednesday = '2015-07-29T13:00:00.000Z';
		var tuesday = '2015-07-23T11:12:13.000Z';

		assert.equal(every_wednesday.containsDate(wednesday), true);
		assert.equal(every_wednesday.containsDate(tuesday),   false);
	});

	it('should be able to check a date against an interval and end date', function () {
		// Matches every wednesday
		var every_wednesday = new IntervalRecurrence({
			interval: 'P1D/2015-07-23T00:00:00.000Z',
			recurrence: 'R/P1W'
		});

		var wednesday = '2015-07-29T13:00:00.000Z';
		var tuesday = '2015-07-23T11:12:13.000Z';

		assert.equal(every_wednesday.containsDate(wednesday), true);
		assert.equal(every_wednesday.containsDate(tuesday),   false);
	});

	it('should be able to check only a specific limit of recurrences', function () {
		// Matches every Wednesday for two weeks
		var every_wednesday_for_two_weeks = new IntervalRecurrence({
			interval: '2015-07-22T00:00:00.000Z/P1D',
			recurrence: 'R2/P1W'
		});

		var two_weeks_after = '2015-08-05T00:00:00.000Z';
		var three_weeks_after = '2015-08-12T00:00:00.000Z';

		assert.equal(every_wednesday_for_two_weeks.containsDate(two_weeks_after),   true);
		assert.equal(every_wednesday_for_two_weeks.containsDate(three_weeks_after), false);
	});

	it('should be able to check between to absolute dates', function () {
		// Matches between midnight and midday on a specific day.
		var between_midnight_and_midday = new IntervalRecurrence({
			interval: '2015-07-22T00:00:00.000Z/2015-07-22T12:00:00.000Z',
		});

		var before_midday = '2015-07-22T09:00:00.000Z';
		var after_midday = '2015-07-22T17:00:00.000Z';

		assert.equal(between_midnight_and_midday.containsDate(before_midday), true);
		assert.equal(between_midnight_and_midday.containsDate(after_midday),  false);
	});

});