// Import and configure assertion framework
var chai = require('chai');
chai.use(require('chai-datetime'));
var assert = chai.assert;
var moment = require('moment');

// Import the library to test.
var IntervalRecurrence = require('../src/');

// Describe tests.
describe('IntervalRecurrence', function () {

	describe('#constructor', function () {

		it('should only allow intervals with dates, intervals and no recurrence', function () {
			var exception = 'Interval must have a date, an interval and no recurrence.';
			// No date.
			assert.throw(function() {
				var invalid_interval = new IntervalRecurrence({
					interval: 'P1W',
					recurrence: 'R/P1W'
				});
			}, exception);

			// No interval
			assert.throw(function() {
				var invalid_interval = new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z',
					recurrence: 'R/P1W'
				});
			}, exception);

			// A recurrence
			assert.throw(function() {
				var invalid_interval = new IntervalRecurrence({
					interval: 'R/2015-01-01T10:00:00.000Z/P1W',
					recurrence: 'R/P1W'
				});
			}, exception);
		});

		it('should only allow recurrences with a recurrence and no date.', function () {
			var exception = 'Recurrence must have a recurrence, an interval and no date.';
			// No recurrence.
			assert.throw(function() {
				var invalid_recurrence = new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z/P1W',
					recurrence: 'P1W'
				});
			}, exception);

			// A date
			assert.throw(function() {
				var invalid_recurrence = new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z/P1W',
					recurrence: 'R/2015-01-01T20:23:33.101Z/P1W'
				});
			}, exception);
		});

		it('should only allow a recurrence with no interval if the recurrence is 0.', function () {
			var exception = 'Recurrence can only have no interval if the recurrence is 0.';
			// No interval, recurrence != 0.
			assert.throw(function () {
				new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z/P1W',
					recurrence: 'R1'
				});
			}, exception);

			// No interval, recurrence = 0
			assert.doesNotThrow(function() {
				var invalid_recurrence = new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z/P1W',
					recurrence: 'R0'
				});
			});
		});

		it('should reject an invalid interval', function () {
			var exception = 'Invalid interval.';
			assert.throw(function () {
				new IntervalRecurrence({
					interval: '💩',
					recurrence: 'R/P1W'
				});
			}, exception);
		});

		it('should reject an invalid recurrence', function () {
			var exception = 'Invalid recurrence.';
			assert.throw(function () {
				new IntervalRecurrence({
					interval: '2015-01-01T10:00:00.000Z/P1D',
					recurrence: '💩'
				});
			}, exception);
		});

		it('should allow more lenient ISO8601 strings when strict is false', function () {
			var exception = 'Invalid recurrence.';
			assert.doesNotThrow(function () {
				new IntervalRecurrence({
					interval: '2015-01-01T/P1D',
					recurrence: 'R/P1W',
					strict: false
				});
			});
		});

	});

	describe('#_parseISO8601', function () {

		// Because private functions are not a thing, we can get
		// access to this function by addressing it from a dummy
		// instance of IntervalRecurrence.
		var _parseISO8601 = new IntervalRecurrence({
			interval: '2015-01-01T00:00:00.000Z/P1D',
			recurrence: 'R/P1D'
		})._parseISO8601;

		it('should not parse a non-numeric recurrence value', function () {
			assert.equal(_parseISO8601('RAB/P1W'), false);
		});

		it('should not parse an undefined input', function () {
			assert.equal(_parseISO8601(), false);
		});

		it('should not parse an input with an invalid section', function () {
			assert.equal(_parseISO8601('2015-01-01T00:00:00.000Z/💩'), false);
			assert.equal(_parseISO8601('💩/P1W'), false);
			assert.equal(_parseISO8601('R/2015-01-01T00:00:00.000Z/💩'), false);
			assert.equal(_parseISO8601('R/💩/P1W'), false);
		});

		it('should not parse a recurrence of two absolute dates because that makes no sense', function () {
			assert.equal(_parseISO8601('R/2015-01-01T00:00:00.000Z/2015-01-02T00:00:00.000Z'), false);
		});

		it('should not parse a date with a repetition and no interval because that makes no sense', function () {
			assert.equal(_parseISO8601('R/2015-01-01T00:00:00.000Z'), false);
		});

		it('should not parse an input with too many sections', function () {
			assert.equal(_parseISO8601('R/2015-01-01T00:00:00.000Z/2015-01-02T00:00:00.000Z/P1W'), false);
		});

	});

	describe('#containsDate()', function () {

		it('should choose the current date if no date is supplied', function () {
			var surrounding_day = new IntervalRecurrence({
				interval: moment().subtract(12, 'hours').toISOString() + '/P1D',
				recurrence: 'R0'
			});

			var last_week = new IntervalRecurrence({
				interval: moment().subtract(1, 'weeks').toISOString() + '/P1D',
				recurrence: 'R0'
			});

			assert.equal(surrounding_day.containsDate(), true);
			assert.equal(last_week.containsDate(), false);
		});

		it('should be able to check a date against a start date and interval', function () {
			// Matches every Wednesday
			var every_wednesday = new IntervalRecurrence({
				interval: '2015-W01-3/P1D',
				recurrence: 'R/P1W'
			});

			var wednesday = new Date('2015-07-29T13:00:00.000Z');
			var tuesday = new Date('2015-07-23T11:12:13.000Z');

			assert.equal(every_wednesday.containsDate(wednesday), true);
			assert.equal(every_wednesday.containsDate(tuesday),   false);
		});

		it('should be able to check a date against an interval and end date', function () {
			// Matches every wednesday
			var every_wednesday = new IntervalRecurrence({
				interval: 'P1D/2015-W01-4',
				recurrence: 'R/P1W'
			});

			var wednesday = new Date('2015-07-29T13:00:00.000Z');
			var tuesday = new Date('2015-07-23T11:12:13.000Z');

			assert.equal(every_wednesday.containsDate(wednesday), true);
			assert.equal(every_wednesday.containsDate(tuesday),   false);
		});

		it('should be able to check only a specific limit of recurrences', function () {
			// Matches every Wednesday for two weeks
			var every_wednesday_for_two_weeks = new IntervalRecurrence({
				interval: '2015-07-22T00:00:00.000Z/P1D',
				recurrence: 'R2/P1W'
			});

			var two_weeks_after = new Date('2015-08-05T00:00:00.000Z');
			var three_weeks_after = new Date('2015-08-12T00:00:00.000Z');

			assert.equal(every_wednesday_for_two_weeks.containsDate(two_weeks_after),   true);
			assert.equal(every_wednesday_for_two_weeks.containsDate(three_weeks_after), false);
		});

		it('should be able to check between to absolute dates', function () {
			// Matches between midnight and midday on a specific day.
			var between_midnight_and_midday = new IntervalRecurrence({
				interval: '2015-07-22T00:00:00.000Z/2015-07-22T12:00:00.000Z',
			});

			var before_midday = new Date('2015-07-22T09:00:00.000Z');
			var after_midday = new Date('2015-07-22T17:00:00.000Z');

			assert.equal(between_midnight_and_midday.containsDate(before_midday), true);
			assert.equal(between_midnight_and_midday.containsDate(after_midday),  false);
		});

	});

	describe('#currentRange()', function () {
		it('should be able to return the range that a current date is in', function () {
			// This is only really useful for repetitions.

			// Matches every weekend.
			var weekend = new IntervalRecurrence({
				interval: '2015-W01-6/P2D',
				recurrence: 'R/P1W'
			});

			var end_of_a_saturday_in_may = new Date('2015-05-09T23:00:00.000Z');
			var end_of_a_saturday_in_june = new Date('2015-06-06T23:00:00.000Z');
			var not_weekend = new Date('2015-06-05T20:00:00.000Z');

			var weekend_in_may = weekend.currentRange(end_of_a_saturday_in_may);
			assert.equalTime(weekend_in_may.start, new Date('2015-05-09T00:00:00.000Z'));
			assert.equalTime(weekend_in_may.end,   new Date('2015-05-11T00:00:00.000Z'));

			var weekend_in_june = weekend.currentRange(end_of_a_saturday_in_june);
			assert.equalTime(weekend_in_june.start, new Date('2015-06-06T00:00:00.000Z'));
			assert.equalTime(weekend_in_june.end,   new Date('2015-06-08T00:00:00.000Z'));

			var fails = weekend.currentRange(not_weekend);
			assert.equal(fails, false);
		});

		it('should choose the current date if no date is supplied', function () {
			var twelve_hours_ago = moment().subtract(12, 'hours');
			var twelve_hours_hence = moment().add(12, 'hours');

			var this_day = new IntervalRecurrence({
				interval: twelve_hours_ago.toISOString() + '/P1D',
				recurrence: 'R0'
			});

			var range = this_day.currentRange();

			assert.equalTime(range.start, twelve_hours_ago.toDate());
			assert.equalTime(range.end, twelve_hours_hence.toDate());
		});
	});

});