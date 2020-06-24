import React, { Component } from "react";
import {Route, withRouter, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { hitApi } from '../actions/helloWorld'

class PrivateRoute extends Component {
    componentDidMount() {
        if (this.props.isLoggedIn && this.props.accessToken !== null) {
            const token = this.props.accessToken;
            this.props.hitApi(token);
        }
    }

    render() {
       const { component: Component, ...rest } = this.props;
       return <Route {...rest} render={(props) => (
         this.props.isLoggedIn === true
           ? <Component {...props} />
           : <Redirect to='/login' />
       )}
    />
   }
}

const mapStateToProps = state => {
  return {
      isLoggedIn: state.auth.isLoggedIn,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null
   }
}

const mapDispatchToProps = dispatch => {
  return {
    hitApi: token => dispatch(hitApi(token))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
