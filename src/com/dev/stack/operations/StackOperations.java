package com.dev.stack.operations;

import java.util.EmptyStackException;
import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

import com.dev.stack.exception.StackNotFoundException;

/**
 * Operations on the stack.
 *
 */
public class StackOperations {
	
	// Stores the stack for different sessions. Uses sessionId as key and the stack for the session as value.
	// Not going to reinvent the wheel. Using java.util.Stack here.
	private static final Map<String, Stack<Integer>> stacks = new HashMap<String, Stack<Integer>>();

	/**
	 * Initializes an empty stack for a new session.
	 * @param sessionId		Id of the new session created
	 */
	public static void initEmptyStackForNewSession(String sessionId) {
		stacks.put(sessionId, new Stack<Integer>());
	}
	
	/**
	 * Retrieves the stack associated with a session.
	 * @param sessionId		Id of the session
	 * @return
	 */
	public static Stack<Integer> retrieveStack(String sessionId) {
		return stacks.get(sessionId);
	}
	
	/**
	 * Deletes the stack associated with a session.
	 * @param sessionId		Id of the session	
	 */
	public static void deleteStack(String sessionId) {
		stacks.remove(sessionId);
	}
	
	/**
	 * Pushes an element to the stack associated with the session.
	 * @param element	Element to push to stack
	 * @param sessionId		Id of the session
	 * @throws StackNotFoundException
	 */
	public static void push(int element, String sessionId) throws StackNotFoundException {
		Stack<Integer> stack = retrieveStack(sessionId);
		
		// Stack does not exist for this session.
		if(stack == null) {
			throw new StackNotFoundException();
		}
		
		stack.push(element);
	}
	
	/**
	 * Pops the element at the top of the stack.
	 * @param sessionId		Id of the session
	 * @return	int	Element popped from the stack
	 * @throws StackNotFoundException
	 * @throws EmptyStackException
	 */
	public static int pop(String sessionId) throws StackNotFoundException, EmptyStackException {
		Stack<Integer> stack = retrieveStack(sessionId);
		
		// Stack does not exist for this session.
		if(stack == null) {
			throw new StackNotFoundException();
		}
		
		return stack.pop();
	}

}