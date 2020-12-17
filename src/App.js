import React from 'react';
import AppLayout from "./components/AppLayout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Home from "./components/Home";
import ConfirmRegistration from "./components/ConfirmRegistration";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserPlaylists from "./components/UserPlaylists";
import SavePlaylist from "./components/SavePlaylist";
import DeletePlaylist from "./components/DeletePlaylist";
import MuiModal from "./components/MuiModal";
import {Route, withRouter, Redirect} from 'react-router-dom';
import { ModalSwitch, ModalRoute } from "react-router-modal-gallery";
import { connect } from 'react-redux';
import PrivateRoute from "./components/PrivateRoute";

const routes = [
  {
    exact: true,
    path: '/',
    component: Home
  },
  {
    exact: true,
    path: '/profile',
    component: Profile,
    private: true
  },
  {
    exact: true,
    path: '/playlists',
    component: UserPlaylists,
    private: true
  },
  {
    defaultParentPath: '/playlists',
    modal: true,
    path: '/savePlaylist',
    component: SavePlaylist
  },
  {
    defaultParentPath: '/playlists',
    modal: true,
    path: '/deletePlaylist/:id',
    component: DeletePlaylist
  },
  {
    defaultParentPath: '/',
    modal: true,
    path: '/login',
    component: SignIn
  },
  {
    exact: false,
    path: '/results',
    component: Search
  },
  {
    defaultParentPath: '/',
    modal: true,
    path: '/register',
    component: SignUp
  },
  {
    defaultParentPath: '/',
    modal: true,
    path: '/confirm',
    component: ConfirmRegistration
  },
  {
    defaultParentPath: '/',
    modal: true,
    path: '/forgotPassword',
    component: ForgotPassword
  },
  {
    defaultParentPath: '/',
    modal: true,
    path: '/resetPassword',
    component: ResetPassword
  },
  {
    path: '*',
    // eslint-disable-next-line
    render: () => <Redirect to="/" />
  }
];

const modalRoutes = routes
  .filter(route => route.modal)
  .map(route => <ModalRoute key={route.path} {...route} />);

class App extends React.Component {
    render() {
      return (
        <AppLayout>
            <ModalSwitch
                renderModal={({ open, redirectToBack }) => (
                  <MuiModal open={open} scroll="body" onExited={redirectToBack}>
                    {modalRoutes}
                  </MuiModal>
                )}
              >
                {routes.map(route =>
                    route.modal ? (
                    <ModalRoute key={route.path} {...route} />
                ) : route.private ? (
                    <PrivateRoute key={route.path} {...route} />
                ) : (
                    <Route key={route.path} {...route} />
                )
                )}
            </ModalSwitch>
        </AppLayout>
      );
    }
}


export default withRouter(connect()(App));
