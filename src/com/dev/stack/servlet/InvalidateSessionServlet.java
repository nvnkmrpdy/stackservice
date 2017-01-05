package com.dev.stack.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet to invalidate the current session.
 */
@WebServlet("/invalidate_session")
public class InvalidateSessionServlet extends HttpServlet {

	private static final long serialVersionUID = -4304894600103256406L;
	
	/**
	 * Services the GET type calls.
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// Invalidate the current session.
		request.getSession().invalidate();
	}

}