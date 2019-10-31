"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.handleZoomChange = function (newZoom) {
	if (newZoom >= 4) {
		document.querySelector("nav.navbar.nav--main").classList.remove('is-fixed-top');
		document.querySelector("#main").classList.remove('nav-is-fixed-top');
	} else {
		document.querySelector("nav.navbar.nav--main").classList.add('is-fixed-top');
		document.querySelector("#main").classList.add('nav-is-fixed-top');
	}
};

function displaySearchResults(term, results, store) {
	console.log("Search Results");
	//console.log(results);
	var searchResults = document.getElementById('search-results');
	if (results && results.length) {
		var appendString = '';

		for (var i = 0; i < results.length; i++) {
			// Iterate over the results
			var item = store[results[i].ref];
			appendString += '<div class="search-item col-12 mb-2"><a class="h5 mb-1"  href="' + item.url + '">' + item.title + '</a>';
			appendString += '<p class="paragraph-small">' + item.content.substring(0, 150) + '...</p></div>';
		}

		searchResults.innerHTML = appendString;
	} else {
		searchResults.innerHTML = '<p class="h4 mb-2">No results found for "' + term + '"</p>';
	}
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');

		if (pair[0] === variable) {
			return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
		}
	}
}

document.ready(function () {
	var _this = this;

	var searchTerm = getQueryVariable('query');
	if (searchTerm) {
		if (document.getElementById('search')) {
			document.getElementById('search').setAttribute("value", searchTerm);
		}

		// Initalize lunr with the fields it will be searching on. I've given title
		// a boost of 10 to indicate matches on this field are more important.
		var store = window.lunrDocs;

		var idx = lunr(function () {
			this.field('id');
			this.field('title', { boost: 10 });
			this.field('content');

			for (var key in store) {
				// Add the data to lunr
				this.add({
					'id': key,
					'title': store[key].title,
					'content': store[key].content
				});
			}
		});

		// console.log("idx");
		// console.log(idx);
		//
		// console.log("window.store");
		// console.log(window.store);


		var results = idx.search(searchTerm); // Get lunr to perform a search
		displaySearchResults(searchTerm, results, store); // We'll write this in the next section
	}

	var modalPopUpKey = "MODAL_DISMISSED";
	var modalDismissalMemory = 1000 * 60 * 60 * 24 * 3; // 3 days

	ttwebHotel.ready(function () {
		var ad = document.querySelector("#modal-ad");
		var closeButtons = ad.querySelectorAll("[data-modal-action=dismiss]");
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			var _loop = function _loop() {
				var button = _step.value;

				button.addEventListener("click", function () {
					ttwebHotel.UserData.saveInStorage(modalPopUpKey, true, modalDismissalMemory);
					ad.classList.remove('show');
					ad.querySelector(".modal-pop-up__content").setAttribute("tabindex", "-1");
				}.bind(_this, ad));
				button.addEventListener("keydown", function (e) {
					if (e.keyCode == 32 || e.keyCode == 13) {
						//space or enter
						button.click();
						// ad.classList.remove('show');
						// ad.querySelector(".modal-pop-up__content").setAttribute("tabindex", "-1");
					}
				});
			};

			for (var _iterator = closeButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				_loop();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var shownModal = ttwebHotel.UserData.fetchFromStorage(modalPopUpKey);
		if (!shownModal) {
			ad.classList.add('show');
			var adElements = [].concat(_toConsumableArray(ad.querySelectorAll('[tabindex="0"]')));
			var startElement = ad.querySelector("#modal-ad-title");
			console.log(startElement, adElements);
			startElement.focus();
			window.modalTabIdx = adElements.indexOf(startElement);
			ad.addEventListener("keydown", function (event) {
				console.log(event.target, adElements);
				if (event.keyCode === 9 || event.shiftKey && event.keyCode == 9) {
					event.preventDefault();
					window.modalTabIdx = window.modalTabIdx + (event.shiftKey ? -1 : 1);
					if (window.modalTabIdx < 0) {
						window.modalTabIdx = adElements.length - 1;
					}
					if (window.modalTabIdx >= adElements.length) {
						window.modalTabIdx = 0;
					}
					adElements[window.modalTabIdx].focus();
				}
			});
		}
	});
});

// ADA Complaint Datepicker
//
// Instructions:
// 1. Replace jQuery('#wrapper') with your page wrapper ID (two instances)
// 2. Add applicable options to your datepicker init
//    showOn: 'button',
//    buttonImage: 'calendar.png',
//    buttonImageOnly: false,
//    buttonText: 'Calendar View',
//    showButtonPanel: true,
//    closeText: 'Close',
//    onClose: removeAria
// /////////////////////////////////////////////////////////////////////////

function dayTripper() {
	jQuery('.ui-datepicker-trigger').click(function () {
		setTimeout(function () {
			var today = jQuery('.ui-datepicker-today a')[0];
			if (!today) {
				today = jQuery('.ui-state-active')[0] || jQuery('.ui-state-default')[0];
			}
			// Hide the entire page (except the date picker)
			// from screen readers to prevent document navigation
			// (by headings, etc.) while the popup is open
			//jQuery("main").attr('id','dp-container');
			//jQuery("#wrapper").attr('aria-hidden','true');

			// Hide the "today" button because it doesn't do what
			// you think it supposed to do
			jQuery(".ui-datepicker-current").hide();

			today.focus();
			datePickHandler();
			jQuery(document).on('click', '#ui-datepicker-div .ui-datepicker-close', function () {
				closeCalendar();
			});
		}, 0);
		return false;
	});
}

function datePickHandler() {
	var activeDate;
	var container = document.getElementById('ui-datepicker-div');
	//var input = document.getElementById('check-in');
	var input = document.getElementsByClassName('datepicker');

	if (!container || !input) {
		return;
	}

	// jQuery(container).find('table').first().attr('role', 'grid');
	container.setAttribute('role', 'application');
	container.setAttribute('aria-label', 'Calendar view date-picker');

	// the top controls:
	var prev = jQuery('.ui-datepicker-prev', container)[0],
	    next = jQuery('.ui-datepicker-next', container)[0];

	// This is the line that needs to be fixed for use on pages with base URL set in head
	next.href = 'javascript:void(0)';
	prev.href = 'javascript:void(0)';

	next.setAttribute('role', 'button');
	next.removeAttribute('title');
	prev.setAttribute('role', 'button');
	prev.removeAttribute('title');

	appendOffscreenMonthText(next);
	appendOffscreenMonthText(prev);

	// delegation won't work here for whatever reason, so we are
	// forced to attach individual click listeners to the prev /
	// next month buttons each time they are added to the DOM
	jQuery(next).on('click', handleNextClicks);
	jQuery(prev).on('click', handlePrevClicks);

	monthDayYearText();

	jQuery(container).on('keydown', function calendarKeyboardListener(keyVent) {
		var which = keyVent.which;
		var target = keyVent.target;
		var dateCurrent = getCurrentDate(container);

		if (!dateCurrent) {
			dateCurrent = jQuery('a.ui-state-default')[0];
			setHighlightState(dateCurrent, container);
		}

		if (27 === which) {
			keyVent.stopPropagation();
			return closeCalendar();
		} else if (which === 9 && keyVent.shiftKey) {
			// SHIFT + TAB
			keyVent.preventDefault();
			if (jQuery(target).hasClass('ui-datepicker-close')) {
				// close button
				jQuery('.ui-datepicker-prev')[0].focus();
			} else if (jQuery(target).hasClass('ui-state-default')) {
				// a date link
				jQuery('.ui-datepicker-close')[0].focus();
			} else if (jQuery(target).hasClass('ui-datepicker-prev')) {
				// the prev link
				jQuery('.ui-datepicker-next')[0].focus();
			} else if (jQuery(target).hasClass('ui-datepicker-next')) {
				// the next link
				activeDate = jQuery('.ui-state-highlight') || jQuery('.ui-state-active')[0];
				if (activeDate) {
					activeDate.focus();
				}
			}
		} else if (which === 9) {
			// TAB
			keyVent.preventDefault();
			if (jQuery(target).hasClass('ui-datepicker-close')) {
				// close button
				activeDate = jQuery('.ui-state-highlight') || jQuery('.ui-state-active')[0];
				if (activeDate) {
					activeDate.focus();
				}
			} else if (jQuery(target).hasClass('ui-state-default')) {
				jQuery('.ui-datepicker-next')[0].focus();
			} else if (jQuery(target).hasClass('ui-datepicker-next')) {
				jQuery('.ui-datepicker-prev')[0].focus();
			} else if (jQuery(target).hasClass('ui-datepicker-prev')) {
				jQuery('.ui-datepicker-close')[0].focus();
			}
		} else if (which === 37) {
			// LEFT arrow key
			// if we're on a date link...
			if (!jQuery(target).hasClass('ui-datepicker-close') && jQuery(target).hasClass('ui-state-default')) {
				keyVent.preventDefault();
				previousDay(target);
			}
		} else if (which === 39) {
			// RIGHT arrow key
			// if we're on a date link...
			if (!jQuery(target).hasClass('ui-datepicker-close') && jQuery(target).hasClass('ui-state-default')) {
				keyVent.preventDefault();
				nextDay(target);
			}
		} else if (which === 38) {
			// UP arrow key
			if (!jQuery(target).hasClass('ui-datepicker-close') && jQuery(target).hasClass('ui-state-default')) {
				keyVent.preventDefault();
				upHandler(target, container, prev);
			}
		} else if (which === 40) {
			// DOWN arrow key
			if (!jQuery(target).hasClass('ui-datepicker-close') && jQuery(target).hasClass('ui-state-default')) {
				keyVent.preventDefault();
				downHandler(target, container, next);
			}
		} else if (which === 13) {
			// ENTER
			if (jQuery(target).hasClass('ui-state-default')) {
				setTimeout(function () {
					closeCalendar();
				}, 100);
			} else if (jQuery(target).hasClass('ui-datepicker-prev')) {
				handlePrevClicks();
			} else if (jQuery(target).hasClass('ui-datepicker-next')) {
				handleNextClicks();
			}
		} else if (32 === which) {
			if (jQuery(target).hasClass('ui-datepicker-prev') || jQuery(target).hasClass('ui-datepicker-next')) {
				target.click();
			}
		} else if (33 === which) {
			// PAGE UP
			moveOneMonth(target, 'prev');
		} else if (34 === which) {
			// PAGE DOWN
			moveOneMonth(target, 'next');
		} else if (36 === which) {
			// HOME
			var firstOfMonth = jQuery(target).closest('tbody').find('.ui-state-default')[0];
			if (firstOfMonth) {
				firstOfMonth.focus();
				setHighlightState(firstOfMonth, jQuery('#ui-datepicker-div')[0]);
			}
		} else if (35 === which) {
			// END
			var $daysOfMonth = jQuery(target).closest('tbody').find('.ui-state-default');
			var lastDay = $daysOfMonth[$daysOfMonth.length - 1];
			if (lastDay) {
				lastDay.focus();
				setHighlightState(lastDay, jQuery('#ui-datepicker-div')[0]);
			}
		}
		jQuery(".ui-datepicker-current").hide();
	});
}

function closeCalendar(input) {
	var input = input || jQuery('.datepicker');
	var container = jQuery('#ui-datepicker-div');
	container.off('keydown');
	input.datepicker('hide');
	//input.next('.ui-datepicker-trigger').attr('aria-expanded', 'false');
	input.focus();
}

function removeAria() {
	// make the rest of the page accessible again:
	//jQuery("#wrapper").removeAttr('aria-hidden');
	//jQuery("#dp-container").removeAttr('aria-hidden');
	jQuery('.datepicker').next('.ui-datepicker-trigger').attr('aria-expanded', 'false');
}

///////////////////////////////
//////////////////////////// //
///////////////////////// // //
// UTILITY-LIKE THINGS // // //
///////////////////////// // //
//////////////////////////// //
///////////////////////////////
function isOdd(num) {
	return num % 2;
}

function moveOneMonth(currentDate, dir) {
	var button = dir === 'next' ? jQuery('.ui-datepicker-next')[0] : jQuery('.ui-datepicker-prev')[0];

	if (!button) {
		return;
	}

	var ENABLED_SELECTOR = '#ui-datepicker-div tbody td:not(.ui-state-disabled)';
	var $currentCells = jQuery(ENABLED_SELECTOR);
	var currentIdx = jQuery.inArray(currentDate.parentNode, $currentCells);

	button.click();
	setTimeout(function () {
		updateHeaderElements();

		var $newCells = jQuery(ENABLED_SELECTOR);
		var newTd = $newCells[currentIdx];
		var newAnchor = newTd && jQuery(newTd).find('a')[0];

		while (!newAnchor) {
			currentIdx--;
			newTd = $newCells[currentIdx];
			newAnchor = newTd && jQuery(newTd).find('a')[0];
		}

		setHighlightState(newAnchor, jQuery('#ui-datepicker-div')[0]);
		newAnchor.focus();
	}, 0);
}

function handleNextClicks() {
	setTimeout(function () {
		updateHeaderElements();
		prepHighlightState();
		jQuery('.ui-datepicker-next').focus();
		jQuery(".ui-datepicker-current").hide();
	}, 0);
}

function handlePrevClicks() {
	setTimeout(function () {
		updateHeaderElements();
		prepHighlightState();
		jQuery('.ui-datepicker-prev').focus();
		jQuery(".ui-datepicker-current").hide();
	}, 0);
}

function previousDay(dateLink) {
	var container = document.getElementById('ui-datepicker-div');
	if (!dateLink) {
		return;
	}
	var td = jQuery(dateLink).closest('td');
	if (!td) {
		return;
	}

	var prevTd = jQuery(td).prev(),
	    prevDateLink = jQuery('a.ui-state-default', prevTd)[0];

	if (prevTd && prevDateLink) {
		setHighlightState(prevDateLink, container);
		prevDateLink.focus();
	} else {
		handlePrevious(dateLink);
	}
}

function handlePrevious(target) {
	var container = document.getElementById('ui-datepicker-div');
	if (!target) {
		return;
	}
	var currentRow = jQuery(target).closest('tr');
	if (!currentRow) {
		return;
	}
	var previousRow = jQuery(currentRow).prev();

	if (!previousRow || previousRow.length === 0) {
		// there is not previous row, so we go to previous month...
		previousMonth();
	} else {
		var prevRowDates = jQuery('td a.ui-state-default', previousRow);
		var prevRowDate = prevRowDates[prevRowDates.length - 1];

		if (prevRowDate) {
			setTimeout(function () {
				setHighlightState(prevRowDate, container);
				prevRowDate.focus();
			}, 0);
		}
	}
}

function previousMonth() {
	var prevLink = jQuery('.ui-datepicker-prev')[0];
	var container = document.getElementById('ui-datepicker-div');
	prevLink.click();
	// focus last day of new month
	setTimeout(function () {
		var trs = jQuery('tr', container),
		    lastRowTdLinks = jQuery('td a.ui-state-default', trs[trs.length - 1]),
		    lastDate = lastRowTdLinks[lastRowTdLinks.length - 1];

		// updating the cached header elements
		updateHeaderElements();

		setHighlightState(lastDate, container);
		lastDate.focus();
	}, 0);
}

///////////////// NEXT /////////////////
/**
 * Handles right arrow key navigation
 * @param  {HTMLElement} dateLink The target of the keyboard event
 */
function nextDay(dateLink) {
	var container = document.getElementById('ui-datepicker-div');
	if (!dateLink) {
		return;
	}
	var td = jQuery(dateLink).closest('td');
	if (!td) {
		return;
	}
	var nextTd = jQuery(td).next(),
	    nextDateLink = jQuery('a.ui-state-default', nextTd)[0];

	if (nextTd && nextDateLink) {
		setHighlightState(nextDateLink, container);
		nextDateLink.focus(); // the next day (same row)
	} else {
		handleNext(dateLink);
	}
}

function handleNext(target) {
	var container = document.getElementById('ui-datepicker-div');
	if (!target) {
		return;
	}
	var currentRow = jQuery(target).closest('tr'),
	    nextRow = jQuery(currentRow).next();

	if (!nextRow || nextRow.length === 0) {
		nextMonth();
	} else {
		var nextRowFirstDate = jQuery('a.ui-state-default', nextRow)[0];
		if (nextRowFirstDate) {
			setHighlightState(nextRowFirstDate, container);
			nextRowFirstDate.focus();
		}
	}
}

function nextMonth() {
	nextMon = jQuery('.ui-datepicker-next')[0];
	var container = document.getElementById('ui-datepicker-div');
	nextMon.click();
	// focus the first day of the new month
	setTimeout(function () {
		// updating the cached header elements
		updateHeaderElements();

		var firstDate = jQuery('a.ui-state-default', container)[0];
		setHighlightState(firstDate, container);
		firstDate.focus();
	}, 0);
}

/////////// UP ///////////
/**
 * Handle the up arrow navigation through dates
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} prevLink Link to navigate to previous month
 */
function upHandler(target, cont, prevLink) {
	prevLink = jQuery('.ui-datepicker-prev')[0];
	var rowContext = jQuery(target).closest('tr');
	if (!rowContext) {
		return;
	}
	var rowTds = jQuery('td', rowContext),
	    rowLinks = jQuery('a.ui-state-default', rowContext),
	    targetIndex = jQuery.inArray(target, rowLinks),
	    prevRow = jQuery(rowContext).prev(),
	    prevRowTds = jQuery('td', prevRow),
	    parallel = prevRowTds[targetIndex],
	    linkCheck = jQuery('a.ui-state-default', parallel)[0];

	if (prevRow && parallel && linkCheck) {
		// there is a previous row, a td at the same index
		// of the target AND theres a link in that td
		setHighlightState(linkCheck, cont);
		linkCheck.focus();
	} else {
		// we're either on the first row of a month, or we're on the
		// second and there is not a date link directly above the target
		prevLink.click();
		setTimeout(function () {
			// updating the cached header elements
			updateHeaderElements();
			var newRows = jQuery('tr', cont),
			    lastRow = newRows[newRows.length - 1],
			    lastRowTds = jQuery('td', lastRow),
			    tdParallelIndex = jQuery.inArray(target.parentNode, rowTds),
			    newParallel = lastRowTds[tdParallelIndex],
			    newCheck = jQuery('a.ui-state-default', newParallel)[0];

			if (lastRow && newParallel && newCheck) {
				setHighlightState(newCheck, cont);
				newCheck.focus();
			} else {
				// theres no date link on the last week (row) of the new month
				// meaning its an empty cell, so we'll try the 2nd to last week
				var secondLastRow = newRows[newRows.length - 2],
				    secondTds = jQuery('td', secondLastRow),
				    targetTd = secondTds[tdParallelIndex],
				    linkCheck = jQuery('a.ui-state-default', targetTd)[0];

				if (linkCheck) {
					setHighlightState(linkCheck, cont);
					linkCheck.focus();
				}
			}
		}, 0);
	}
}

//////////////// DOWN ////////////////
/**
 * Handles down arrow navigation through dates in calendar
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} nextLink Link to navigate to next month
 */
function downHandler(target, cont, nextLink) {
	nextLink = jQuery('.ui-datepicker-next')[0];
	var targetRow = jQuery(target).closest('tr');
	if (!targetRow) {
		return;
	}
	var targetCells = jQuery('td', targetRow),
	    cellIndex = jQuery.inArray(target.parentNode, targetCells),
	    // the td (parent of target) index
	nextRow = jQuery(targetRow).next(),
	    nextRowCells = jQuery('td', nextRow),
	    nextWeekTd = nextRowCells[cellIndex],
	    nextWeekCheck = jQuery('a.ui-state-default', nextWeekTd)[0];

	if (nextRow && nextWeekTd && nextWeekCheck) {
		// theres a next row, a TD at the same index of `target`,
		// and theres an anchor within that td
		setHighlightState(nextWeekCheck, cont);
		nextWeekCheck.focus();
	} else {
		nextLink.click();

		setTimeout(function () {
			// updating the cached header elements
			updateHeaderElements();

			var nextMonthTrs = jQuery('tbody tr', cont),
			    firstTds = jQuery('td', nextMonthTrs[0]),
			    firstParallel = firstTds[cellIndex],
			    firstCheck = jQuery('a.ui-state-default', firstParallel)[0];

			if (firstParallel && firstCheck) {
				setHighlightState(firstCheck, cont);
				firstCheck.focus();
			} else {
				// lets try the second row b/c we didnt find a
				// date link in the first row at the target's index
				var secondRow = nextMonthTrs[1],
				    secondTds = jQuery('td', secondRow),
				    secondRowTd = secondTds[cellIndex],
				    secondCheck = jQuery('a.ui-state-default', secondRowTd)[0];

				if (secondRow && secondCheck) {
					setHighlightState(secondCheck, cont);
					secondCheck.focus();
				}
			}
		}, 0);
	}
}

function onCalendarHide() {
	closeCalendar();
}

// add an aria-label to the date link indicating the currently focused date
// (formatted identically to the required format: mm/dd/yyyy)
function monthDayYearText() {
	var cleanUps = jQuery('.amaze-date');

	jQuery(cleanUps).each(function (clean) {
		// each(cleanUps, function (clean) {
		clean.parentNode.removeChild(clean);
	});

	var datePickDiv = document.getElementById('ui-datepicker-div');
	// in case we find no datepick div
	if (!datePickDiv) {
		return;
	}

	var dates = jQuery('a.ui-state-default', datePickDiv);
	jQuery(dates).attr('role', 'button').on('keydown', function (e) {
		if (e.which === 32) {
			e.preventDefault();
			e.target.click();
			setTimeout(function () {
				closeCalendar();
			}, 100);
		}
	});
	jQuery(dates).each(function (index, date) {
		var currentRow = jQuery(date).closest('tr'),
		    currentTds = jQuery('td', currentRow),
		    currentIndex = jQuery.inArray(date.parentNode, currentTds),
		    headThs = jQuery('thead tr th', datePickDiv),
		    dayIndex = headThs[currentIndex],
		    daySpan = jQuery('span', dayIndex)[0],
		    monthName = jQuery('.ui-datepicker-month', datePickDiv)[0].innerHTML,
		    year = jQuery('.ui-datepicker-year', datePickDiv)[0].innerHTML,
		    number = date.innerHTML;

		if (!daySpan || !monthName || !number || !year) {
			return;
		}

		// AT Reads: {month} {date} {year} {day}
		// "December 18 2014 Thursday"
		var dateText = date.innerHTML + ' ' + monthName + ' ' + year + ' ' + daySpan.title;
		// AT Reads: {date(number)} {name of day} {name of month} {year(number)}
		// var dateText = date.innerHTML + ' ' + daySpan.title + ' ' + monthName + ' ' + year;
		// add an aria-label to the date link reading out the currently focused date
		date.setAttribute('aria-label', dateText);
	});
}

// update the cached header elements because we're in a new month or year
function updateHeaderElements() {
	var context = document.getElementById('ui-datepicker-div');
	if (!context) {
		return;
	}

	//  jQuery(context).find('table').first().attr('role', 'grid');
	prev = jQuery('.ui-datepicker-prev', context)[0];
	next = jQuery('.ui-datepicker-next', context)[0];

	//make them click/focus - able
	next.href = 'javascript:void(0)';
	prev.href = 'javascript:void(0)';

	next.setAttribute('role', 'button');
	prev.setAttribute('role', 'button');
	appendOffscreenMonthText(next);
	appendOffscreenMonthText(prev);

	jQuery(next).on('click', handleNextClicks);
	jQuery(prev).on('click', handlePrevClicks);

	// add month day year text
	monthDayYearText();
}

function prepHighlightState() {
	var highlight;
	var cage = document.getElementById('ui-datepicker-div');
	highlight = jQuery('.ui-state-highlight', cage)[0] || jQuery('.ui-state-default', cage)[0];
	if (highlight && cage) {
		setHighlightState(highlight, cage);
	}
}

// Set the highlighted class to date elements, when focus is recieved
function setHighlightState(newHighlight, container) {
	var prevHighlight = getCurrentDate(container);
	// remove the highlight state from previously
	// highlighted date and add it to our newly active date
	jQuery(prevHighlight).removeClass('ui-state-highlight');
	jQuery(newHighlight).addClass('ui-state-highlight');
}

// grabs the current date based on the hightlight class
function getCurrentDate(container) {
	var currentDate = jQuery('.ui-state-highlight', container)[0];
	return currentDate;
}

/**
* Appends logical next/prev month text to the buttons
* - ex: Next Month, January 2015
*       Previous Month, November 2014
*/
function appendOffscreenMonthText(button) {
	var buttonText;
	var isNext = jQuery(button).hasClass('ui-datepicker-next');
	var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	var currentMonth = jQuery('.ui-datepicker-title .ui-datepicker-month').text().toLowerCase();
	var monthIndex = jQuery.inArray(currentMonth.toLowerCase(), months);
	var currentYear = jQuery('.ui-datepicker-title .ui-datepicker-year').text().toLowerCase();
	var adjacentIndex = isNext ? monthIndex + 1 : monthIndex - 1;

	if (isNext && currentMonth === 'december') {
		currentYear = parseInt(currentYear, 10) + 1;
		adjacentIndex = 0;
	} else if (!isNext && currentMonth === 'january') {
		currentYear = parseInt(currentYear, 10) - 1;
		adjacentIndex = months.length - 1;
	}

	buttonText = isNext ? 'Next Month, ' + firstToCap(months[adjacentIndex]) + ' ' + currentYear : 'Previous Month, ' + firstToCap(months[adjacentIndex]) + ' ' + currentYear;

	jQuery(button).find('.ui-icon').html(buttonText);
}

// Returns the string with the first letter capitalized
function firstToCap(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// END ADA Complaint Datepicker
// /////////////////////////////////////////////////////////////////

// auto scroll for error message (ADA)
function autoScroll(name, animated, distance) {
	var scrollDistance = 300;
	var scrollTarget = jQuery("*[name='" + name + "']");

	console.log('name:', name);
	console.log('scrollTarget.offset().top:', scrollTarget.offset().top);

	if (jQuery("*[name='" + name + "']").length > 0) {
		if (animated) {
			jQuery('html, body').animate({ scrollTop: scrollTarget.offset().top - scrollDistance }, 500);
		} else {
			jQuery('html, body').scrollTop(scrollTarget.offset().top - scrollDistance);
		}
	}
}
// Form Validation
function validateForm() {
	var errorSummary = jQuery('#error-summary ul');
	errorSummary.empty();
	jQuery('#error-summary').hide();
	jQuery('.error-message').remove();

	jQuery('[aria-required="true"]').each(function (index) {
		if (jQuery(this).closest('.form-check')) {
			if (!jQuery(this).find('input:checked').length > 0) {
				jQuery(this).attr('aria-invalid', true);
				var errortxt = jQuery(this).closest('label').text();
				errorSummary.append('<li><a href="javascript:document.getElementById(\'' + jQuery(this).attr('id') + '\').focus()" name="index' + index + '">' + errortxt + '</a></li>');
				jQuery(this).closest('fieldset').addClass('errors').append('<span role="alert" class="error-message">Please choose an option</span>');
			} else {
				jQuery(this).closest('fieldset').removeClass('errors');
				jQuery(this).attr('aria-invalid', false);
			}
		}
		if (jQuery(this).is('input[type="text"], input[type="email"], textarea')) {
			if (jQuery(this).val() == '') {
				jQuery(this).attr('aria-invalid', true);
				var errortxt = jQuery(this).is('.datepicker') ? jQuery(this).closest('.form-group').find('label').text() : jQuery(this).prev('label').text();
				errorSummary.append('<li><a href="javascript:document.getElementById(\'' + jQuery(this).attr('id') + '\').focus()" name="index' + index + '">' + errortxt + '</a></li>');
				if (jQuery(this).is('.datepicker')) jQuery(this).closest('.form-group').append('<span role="alert" class="error-message">Please enter text</span>');else jQuery(this).parent().append('<span role="alert" class="error-message">Please enter text</span>');
			} else {
				jQuery(this).attr('aria-invalid', false);
			}
		}
		if (jQuery(this).is('select')) {
			if (jQuery(this).val() < 0) {
				jQuery(this).attr('aria-invalid', true);
				var errortxt = jQuery(this).parents('.select-wrapper').prev('label').text();
				errorSummary.append('<li>' + errortxt + '</li>');
				jQuery(this).parent().append('<span role="alert" class="error-message">Please select an option</span>');
			} else {
				jQuery(this).attr('aria-invalid', false);
			}
		}
	});

	// -- Accesssible foucs on error message when page loads
	//console.log(errorSummary.find('li:first-child a').text());
	//errorSummary.find('li:first-child a').focus();

	if (jQuery('[aria-invalid="true"]').length > 0) {
		console.log('Errors!');
		// show the Error Summary now
		jQuery('#error-summary').fadeIn();
		// -- Accesssible foucs on error message when page loads
		console.log(errorSummary.find('li:first-child a').text());
		var firstFocusLink = errorSummary.find('li:first-child a').focus();
		var getHash = firstFocusLink.attr('name');
		autoScroll(getHash, true, 0);
		//window.scrollTo(0,0);
		return false;
	} else {
		console.log('Send form!');
		// ajax post data
		jQuery('form[name^="form_"]').submit();
		/*jQuery('form[name^="form_"]').submit(function(){
  	var fields = jQuery("input", this).serializeArray();
  	var saveData = jQuery.ajax({
  		type: 'POST',
  		url: jQuery('form[name^="form_"]').attr('action') + "?action=saveData",
  		data: fields,
  		//dataType: "text",
  		success: function(resultData) { alert("Save Complete") }
  	});
  	saveData.error(function() { alert("Something went wrong"); });
  });*/
		return true;
	}
}

jQuery(function () {
	// Initialize DatePicker for ANY FORM with a .datepicker
	var contentDatePicker = jQuery('.datepicker').wrap('<div class="form-group_datepicker"></div>');
	contentDatePicker.datepicker({
		minDate: '+0D',
		onSelect: function onSelect() {
			var checkInDate = jQuery('.datepicker').datepicker('getDate'),

			//var checkInDate = contentDatePicker.datepicker('getDate'),
			_console = console.log('checkInDate:', checkInDate),
			    day = checkInDate.getDate(),
			    month = jQuery.datepicker.formatDate("M", checkInDate),
			    year = checkInDate.getFullYear();

			jQuery(".hasDatepicker").datepicker("hide");
			checkInDate.setDate(checkInDate.getDate() + 2);
		},
		showOn: 'button',
		//buttonImage: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
		buttonImageOnly: false,
		buttonText: '<em class="fa fa-th" aria-hidden="true"></em>', //'Calendar View',
		showButtonPanel: true,
		closeText: 'Close',
		onClose: removeAria
		//onClose: function(dateText, inst) {
		//console.log(inst);
		//jQuery('button').attr('aria-expanded','false');
		//jQuery('main').attr('aria-hidden','false');
		//},
	});
	contentDatePicker.datepicker({});
	contentDatePicker.focus(function () {
		//console.log('focus: ' + Date.now());
		jQuery(this).addClass('view').datepicker("show");
	});
	contentDatePicker.addClass('ada-datepicker');

	// prevent the enter from submitting the form when the BUTTON tag is hit
	jQuery(".hasDatepicker, .ui-datepicker, .FormPanel .ui-datepicker-trigger").on('keydown', function (keyVent) {
		var which = keyVent.which;
		//console.log(which);
		if (which === 13) {
			// ENTER
			keyVent.stopPropagation();
		}
	});

	// prevent the datepicker BUTTON tag from submitted
	jQuery(".hasDatepicker, .ui-datepicker, .ui-datepicker-trigger").click(function (event) {
		event.stopPropagation();
	});

	// Hide datepicker if mouse clicked outside of the calendar
	jQuery("body").on("click touchstart", function (e) {
		if (jQuery(window).width() > 767) {
			if (jQuery(e.target).closest('div#ui-datepicker-div').length == 1) {} else {
				if (jQuery(window).width() > 767) {
					jQuery('.datepicker').each(function () {
						if (!jQuery(this).hasClass('view')) {
							jQuery('.datepicker').datepicker("hide");
							jQuery('.datepicker').removeClass('view').blur();
							//$('.selectbox').parent().focus();
						}
					});
				}
			}
		}
	});

	// Add aria-describedby to the button referring to the label
	jQuery('.ui-datepicker-trigger').each(function (index) {
		if (jQuery(this).closest('.bookingMask').find('[id*="datepickerLabel"]').length == 0) {
			jQuery(this).closest('div').prepend('<div id="datepickerLabel' + index + '" class="sr-only">Datepicker Calendar' + index + '</div>');
		} else if (jQuery(this).closest('.EditingFormControlNestedControl').find('[id*="datepickerLabel"]').length == 0) {
			jQuery(this).closest('div').prepend('<div id="datepickerLabel' + index + '" class="sr-only">Datepicker Calendar' + index + '</div>');
		}
		jQuery(this).attr('aria-describedby', 'datepickerLabel' + index);
		//jQuery(this).attr('aria-describedby', 'datepickerLabel');
	});

	// Toggle aria-expanded on the BUTTON tag on the Datepicker ADA
	jQuery('.ui-datepicker-trigger').attr('aria-expanded', 'false').on('click', function (e) {
		var btnItem = jQuery(e.currentTarget);
		if (btnItem.attr('aria-expanded') === 'true') {
			jQuery(this).attr('aria-expanded', 'false');
		} else {
			jQuery(this).attr('aria-expanded', 'true');
		}
	});

	// call dayTripper();
	dayTripper();

	// set autocomplete on all INPUT text type
	jQuery('input[type="text"]').attr('autocomplete');
	// add .required class to elements with [aria-required="true"]
	jQuery('[aria-required="true"]').each(function () {
		jQuery(this).parents('.form-group').addClass('required');
	});
	// validate form
	jQuery('form[name^="form_"]').find('input[type="submit"]').click(function (e) {
		e.preventDefault();
		validateForm();
	});
	// To manage the interaction with the mouse, simply change the value of the aria-checked attribute when a checkbox is clicked.
	jQuery("[type=checkbox], [type=radio]").on("click", function () {
		if (jQuery(this).prop("checked")) {
			jQuery(this).parent().attr("aria-checked", "true");
		} else {
			jQuery(this).parent().attr("aria-checked", "false");
		}
	});
});
