mooFormElements
===============

mooFormElements is a MooTools port of [Ryan Fait's work](http://ryanfait.com/resources/custom-checkboxes-and-radio-buttons/); a nice, unobtrusive way of creating custom styled form inputs.

Current only supports:

 - ``input[type=checkbox]``
 - ``input[type=radio]``
 - ``select:not([multiple])``
 
Definitely alpha for now!

Usage
-----

Make sure you're using MooTools 1.4 (may work on earlier versions, may not) - does not require any of Core.

Firstly, you need to define what your custom form inputs will look like, refer to [example.htm](https://github.com/HollerLondon/mooFormElements/blob/master/example.htm#L4-28), and give all inputs you'd like to target the 'styled' class.

Next, include mooFormElements.js (after MooTools, obviously).

Lastly, instantiate the ``mooFormElements`` class, either in a domready, or at the end of the page.

