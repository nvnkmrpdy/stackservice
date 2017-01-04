package com.fob.listener;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.fob.operations.StackOperations;

/**
 * Custom HTTPSessionListener for the Stack service app.
 */
public class StackHttpSessionListener implements HttpSessionListener {

	/**
	 * Call back on session creation.
	 */
	public void sessionCreated(HttpSessionEvent e) {

		// Initialize an empty stack for the new session created
		HttpSession session = e.getSession();
		StackOperations.initEmptyStackForNewSession(session.getId());
		
	}

	/**
	 * Call back on session destroyal.
	 */
	public void sessionDestroyed(HttpSessionEvent e) {
		// Delete the stack associated with the session on session invalidation
		HttpSession session = e.getSession();
		StackOperations.deleteStack(session.getId());
	}
}