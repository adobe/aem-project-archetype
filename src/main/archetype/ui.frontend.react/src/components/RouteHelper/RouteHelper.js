import React, { Component } from 'react';
import { Route } from 'react-router-dom';

/**
 * Helper that facilitate the use of the {@link Route} component
 */

/**
 * Returns a composite component where a {@link Route} component wraps the provided component
 *
 * @param {React.Component} WrappedComponent    - React component to be wrapped
 * @param {string} [extension=html]             - extension used to identify a route amongst the tree of resource URLs
 * @returns {CompositeRoute}
 */
export const withRoute = (WrappedComponent, extension) => {
  return class CompositeRoute extends Component {
    render() {
      let routePath = this.props.cqPath;
      if (!routePath) {
        return <WrappedComponent {...this.props} />;
      }

      extension = extension || 'html';

      // Context path + route path + extension
      return (
        <Route
          key={routePath}
          exact
          path={'(.*)' + routePath + '(.' + extension + ')?'}
          render={routeProps => {
            return <WrappedComponent {...this.props} {...routeProps} />;
          }}
        />
      );
    }
  };
};
