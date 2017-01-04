package com.fob.filter;

import static com.fob.constants.Constants.SESSION_INACTIVITY_TIMEOUT;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Filter applied on all rest calls.
 */
public class RestFilter implements javax.servlet.Filter {


    /**
     * Filters all the REST service invocations.
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filter) throws IOException, ServletException {

        HttpServletRequest httpServletRequest = null;
        if (request instanceof HttpServletRequest) {
            httpServletRequest = (HttpServletRequest) request;
        } else {
            return;
        }

        HttpSession session = httpServletRequest.getSession();
        
        // New session
        if(session.isNew()) {
        	// Set the max inactive interval to 10 min
            session.setMaxInactiveInterval(SESSION_INACTIVITY_TIMEOUT);
        }
        
        // Chain the request to next invocation
        filter.doFilter(request, response);
    }

    @Override
    public void destroy() {}

    @Override
    public void init(FilterConfig arg0) throws ServletException {}
}
