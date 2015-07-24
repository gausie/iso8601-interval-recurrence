// Import and configure assertion framework
var chai = require('chai');
chai.use(require('chai-datetime'));
var assert = chai.assert;

// Import the library to test.
var IntervalRecurrence = require('../dist/');

// Describe tests.
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

	it('should be able to return the range that a current date is in', function () {
		// This is only really useful for repetitions.

		// Matches every weekend.
		var weekend = new IntervalRecurrence({
			interval: '2015-W01-6T/P2D',
			recurrence: 'R/P1W'
		});

		var end_of_a_saturday_in_may = '2015-05-09T23:00:00.000Z';
		var end_of_a_saturday_in_june = '2015-06-06T23:00:00.000Z';
		var not_weekend = '2015-06-05T20:00:00.000Z';

		var weekend_in_may = weekend.currentRange(end_of_a_saturday_in_may);
		assert.equalTime(weekend_in_may.start, new Date('2015-05-09T00:00:00.000Z'));
		assert.equalTime(weekend_in_may.end,   new Date('2015-05-11T00:00:00.000Z'));

		var weekend_in_june = weekend.currentRange(end_of_a_saturday_in_june);
		assert.equalTime(weekend_in_june.start, new Date('2015-06-06T00:00:00.000Z'));
		assert.equalTime(weekend_in_june.end,   new Date('2015-06-08T00:00:00.000Z'));

		var fails = weekend.currentRange(not_weekend);
		assert.equal(fails, false);
	});

});