import React from 'react';
import { Route, Redirect } from  'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({
  component: Component,
  auth,
  path,
  ...rest
}) => {
  return (
  <Route 
    render={props => 
      auth.isAuth === true  ? (
        <Component {...props} />
      ) : (
        <Redirect 
          to={{
            pathname: '/login',
            state: { from: path }
          }}
          from={path}
        />
      )
    }
    {...rest}
  />
)}

PrivateRoute.proptypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)
