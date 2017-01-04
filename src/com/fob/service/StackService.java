package com.fob.service;

import static com.fob.constants.Constants.POP_ON_EMPTY_STACK;
import static com.fob.constants.Constants.STACK_DOES_NOT_EXIST;

import java.util.EmptyStackException;
import java.util.Stack;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fob.exception.StackNotFoundException;
import com.fob.operations.StackOperations;

/**
 * Service class exposing web services for stack operations.
 */
@Path("/stack")
public class StackService {

	// Inject ThreadLocal HttpServletRequest instance.
	@Context
	private HttpServletRequest servletRequest;
	
	/**
	 * Service to push an element to the stack.
	 * @param element	Element to push to stack
	 * @return {@link Response}
	 */
	@Path("/push")
	@POST
	public Response push(Integer element) {
		
		// If no data is posted, return bad request.
		if(element == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		
		Response response = null;
		
		try {
			StackOperations.push(element, servletRequest.getSession().getId());
			response = Response.ok().build();
		} catch(StackNotFoundException ex) {
			// The stack of the current session is not found
			response = Response.status(STACK_DOES_NOT_EXIST).build();
		}
		
		return response;
	}
	
	/**
	 * Service to pop an element from the stack.
	 * @return {@link Response}
	 */
	@Path("/pop")
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	public Response pop() {
		Response response = null;
		
		try {
			String sessionId = servletRequest.getSession().getId();
			
			response = Response.ok(StackOperations.pop(sessionId)).build();
		} catch(StackNotFoundException ex) {
			// The stack of the current session is not found
			response = Response.status(STACK_DOES_NOT_EXIST).build();
		} catch(EmptyStackException ex) {
			// The stack is empty
			response = Response.status(POP_ON_EMPTY_STACK).entity("Stack is empty").build();
		}
		
		return response;
	}
	
	/**
	 * Service to retrieve the stack.
	 * @return {@link Response}
	 */
	@Path("/view")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response viewStack() {
		
		// Return -1 as response for the first request from the new session.
		if(servletRequest.getSession().isNew()) {
			return Response.ok(-1).build();
		}
		
		Stack<Integer> stack = StackOperations.retrieveStack(servletRequest.getSession().getId());
		if(stack == null) {
			return Response.status(STACK_DOES_NOT_EXIST).build();
		}
		return Response.ok(stack).build();
	}
}