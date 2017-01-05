package com.dev.stack.exception;

/**
 * Custom Exception class for when the stack associated with current session is not found.
 */
public class StackNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1135868875987995377L;
	
	public StackNotFoundException() {
        super();
    }
	
	public StackNotFoundException(String message) {
        super(message);
    }
	
	public StackNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
	
	public StackNotFoundException(Throwable cause) {
        super(cause);
    }

}
