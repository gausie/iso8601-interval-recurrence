
iso8601-interval-recurrence
===========================

[![Build Status](https://travis-ci.org/gausie/iso8601-interval-recurrence.svg?branch=master)](https://travis-ci.org/gausie/iso8601-range)

This small library allows you tocheck if a date is within a range. Support includes repeating ranges using the ISO 8601 standards of Durations and Repeating Intervals.

This can be supplied a range with describes a duration at a repeating interval (for example between 9:15 and 4 every other Thursday) and can tell you if a date falls within one of those ranges.

Usage
-----

```
var IntervalRecurrence = require('iso8601-interval-recurrence');

var range = {
    interval: '2015-07-22T00:00:00.000Z/P1D',
    recurrence: 'R/P1W'
};

var every_wednesday = IntervalRecurrence(range);

var wednesday = '2015-07-29T13:00:00.000Z';
var tuesday = '2015-07-23T11:12:13.000Z';

every_wednesday.containsDate(wednesday); // true
every_wednesday.containsDate(tuesday);   // false
```

Although I will write some more documentation later, for now you can see the unit testing to determine how to use it.

See Also
--------

The guys over at cylc [seemed to have the same problem](https://github.com/cylc/cylc/wiki/ISO-8601) but came up with a complicated and extremely confusing solution.

I worked on this with [Joshua Finch](https://github.com/joshuafinch), who has published [an equivalent library for iOS](https://github.com/joshuafinch/ISO-8601-Interval-Recurrence).