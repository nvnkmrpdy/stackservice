// HTTP status codes
var STATUS_CODE = {
		POP_ON_EMPTY_STACK: 600,
		STACK_DOES_NOT_EXIST: 601
};

var MAX_SESSION_INACTIVITY_TIME_IN_MINUTES = 5;
var sessionTimeoutTimer, idleTimer, timerCountdownTriggered = false;

$(document).ready(function() {
	$('#content').hide().fadeIn(1000);
	
	bindEvents();
	
	// Retrieve the contents of the stack.
	viewStack(true);
});

function bindEvents() {
	// Reset/initialize the idleTimer after ajax calls
	// Only server interactions are considered as valid inactivity. Just key press and mouse movement aren't considered valid activity.
	$(document).ajaxStop(function() {
		startIdleTimer();
	});
	
	// Keyup event on the text box
	$('#txtElement').on('keyup change', function(e) {
		// Disable the push button if the textbox is empty, enable otherwise
		$('#btnPush').prop('disabled', $(this).val() == '');
		// Empty the infoMessage
		$('#infoMessage').empty();
	});
}

// Viewing the contents of the stack
function viewStack(clearInfoMessage) {
	if(clearInfoMessage) {
		// Empty the info message if present
		$('#infoMessage').empty();		
	}
	
	$.ajax({
		url: 'rest/stack/view',
		method: 'GET',
		dataType : 'json',
		success: function(data) {
			// First request from the session - server returns -1
			if(data == -1) {
				animateMessage($('#stackContent'), 'An empty stack has been created for this session. Add elements to populate the stack.');
				return;
			}
			
			if(data.length == 0) {
				// Stack is empty
				animateMessage($('#stackContent'), 'Stack is empty.');
			} else {
				// Display the contents of the stack
				var $title = $('<h4>Your Stack:</h4>');
				var $ulParent = $('<ul id="stackContentUl">');
				
				var i = 0;
				// Display most recently pushed items first.
				for(i=data.length-1; i>=0; i--) {
					$ulParent.append('<li>' + data[i] + '</li>');
				}
				$('#stackContent').hide().html($title).append($ulParent).fadeIn(500);
			}
			
		}, 
		error: function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status == STATUS_CODE.STACK_DOES_NOT_EXIST) {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. We lost the stack associated with this session.');
			} else {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. Failed to retrieve the stack contents.');				
			}
		}
	});
}

// Pushing an element to the stack
function push() {
	
	// Empty the info message if present
	$('#infoMessage').empty();
	
	var valueToPush = $('#txtElement').val();
	
	// Invalid input
	if(valueToPush == '' || isNaN(valueToPush)) {
		animateMessage($('#infoMessage'), 'Invalid input.');
		return false;
	}
	
	// Value out of integer range
	if(valueToPush > 2147483647 || valueToPush < -2147483648) {
		animateMessage($('#infoMessage'), 'Input is out of integer range. Please enter a value between -2147483648 and 2147483647.');
		return false;
	}
	
	$.ajax({
		url: 'rest/stack/push',
		method: 'POST',
		data: valueToPush,
		contentType : 'application/json; charset=utf-8',
		success: function(data) {
			// Reset the text input
			$('#txtElement').val('');
			// Disable the push button
			$('#btnPush').prop('disabled', true);
			// Display a message to the user
			animateMessage($('#infoMessage'), valueToPush + ' is pushed to the stack.', true);
			// Refresh the stack contents on display after successful push operation.
			viewStack(false);
		}, 
		error: function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status == STATUS_CODE.STACK_DOES_NOT_EXIST) {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. We lost the stack associated with this session.');
			} else {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. Failed to push to the stack.');				
			}
		}
	});
}

// Popping the top of the stack
function pop() {
	
	// Empty the info message if present
	$('#infoMessage').empty();
	
	$.ajax({
		url: 'rest/stack/pop',
		method: 'DELETE',
		success: function(data) {
			// Display a message with the popped data
			animateMessage($('#infoMessage'), data + ' has been popped from the stack.', true);
			// Refresh the stack contents on display after successful pop operation.
			viewStack(false);
		}, 
		error: function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status == STATUS_CODE.STACK_DOES_NOT_EXIST) {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. We lost the stack associated with this session.');
			} else if(jqXHR.status == STATUS_CODE.POP_ON_EMPTY_STACK) {
				animateMessage($('#infoMessage'), 'Pop operation not permitted on empty stack.');
			} else {
				animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. Failed to pop from the stack.');				
			}
		}
	});
}

function animateMessage($element, message, autoHide) {
	$element.hide().text(message).fadeIn(500);
	
	if(autoHide) {
		// Auto hide the message in 2 seconds
		setTimeout(function() {
			$element.empty();
		}, 2000);
	}
}

function startIdleTimer() {
	
	// Reset the idle time to 0 min.
	localStorage.setItem('idleTime', 0);
	// Clear the existing idleTimer if initialized.
	clearInterval(idleTimer);

	// Increment the idle time counter every minute.
	idleTimer = setInterval(incrementTimer, 60000);
}

function incrementTimer() {

	// If a count down is not already running
	if (!timerCountdownTriggered) {

		// 1 more minute has elapsed since last activity. Update the localStorage
		localStorage.setItem('idleTime', localStorage.getItem('idleTime') + 1);

		// The last minute of inactivity will be a count down from 1:00
		var triggerTime = MAX_SESSION_INACTIVITY_TIME_IN_MINUTES - 1;

		// 1 min left for the session inactivity timeout
		if (localStorage.getItem('idleTime') >= triggerTime) {
			// Last min count down timer is triggered
			timerCountdownTriggered = true;
			sessionAboutToTimeOut();
		}
	}
}

// Session timeout dialog
function sessionAboutToTimeOut() {
	// Trigger the last min of session inactivity count down timer
	startTimer(60, $('#sessionTimeoutTimer'));
	// Hide the main content and bring in the timer to view
	$('#content').hide();
	$('#sessionTimeoutConfirmation').fadeIn(500);
}

// Count-down timer, duration in seconds
function startTimer(durationInSec, $timerDisplayElement) {

	var timer = durationInSec, minutes, seconds;

	// Clear existing timers
	clearInterval(sessionTimeoutTimer);
	clearInterval(idleTimer);

	// Count down from 1 min.
	sessionTimeoutTimer = setInterval(function() {
		
		// If some session activity has happened in some other tab
		if(localStorage.getItem('idleTime') == 0) {
			clearInterval(sessionTimeoutTimer);
			continueSession();
			return;
		}

		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		// Set the timer in min:sec format
		$timerDisplayElement.text(minutes + ":" + seconds);

		// Count down reached 00:00
		if (--timer < 0) {
			clearInterval(sessionTimeoutTimer);
			resetSession(true);
		}

	}, 1000);
}

// To continue in the current session
function continueSession() {
	timerCountdownTriggered = false;
	clearInterval(sessionTimeoutTimer);
	// Hide the count down timer and bring in the main content
	$('#sessionTimeoutConfirmation').hide()
	$('#content').fadeIn(500);
	// Reset the timer part
	$('#sessionTimeoutTimer').text('01:00');
	viewStack(true);
}

// To reset in the current session and start a new one
function resetSession(autoReset) {
	timerCountdownTriggered = false;
	clearInterval(sessionTimeoutTimer);
	// Reset the timer part
	$('#sessionTimeoutTimer').text('01:00');
	
	$.ajax({
		url: 'invalidate_session',
		method: 'GET',
		success: function(data) {
			$('#sessionTimeoutConfirmation').hide()
			$('#content').fadeIn(500);
			// Display message to the user about the reset of the session
			if(autoReset) {
				animateMessage($('#infoMessage'), 'Your session has been reset due to inactivity.');	
			}
			
			viewStack(false);
		}, 
		error: function(jqXHR, textStatus, errorThrown) {
			animateMessage($('#infoMessage'), 'Oops! Looks like some of our gears need some fixing. Failed to reset the current session.');
		}
	});
}