iso8601-range
=============

[![Build Status](https://travis-ci.org/gausie/iso8601-range.svg?branch=develop)](https://travis-ci.org/gausie/iso8601-range)

This small library allows you tocheck if a date is within a range. Support includes repeating ranges using the ISO 8601 standards of Durations and Repeating Intervals.

This can be supplied a range with describes a duration at a repeating interval (for example between 9:15 and 4 every other Thursday) and can tell you if a date falls within one of those ranges.

Although I will write some more documentation later, for now you can see the unit testing to determine how to use it.

See Also
--------

The guys over at cylc [seemed to have the same problem](https://github.com/cylc/cylc/wiki/ISO-8601) but came up with a complicated and extremely confusing solution.