import React from 'react';
import { Link } from 'react-router-dom';
import { ModalLink } from "react-router-modal-gallery";

export default function FlexiLink(props) {
  const { children, isLoggedIn, to, ...other } = props;

  return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
    {isLoggedIn ? (
        <Link
            to={to}
           {...other}
            >
          {children}
      </Link>) :
        (<ModalLink to={{pathname: '/login'}} {...other}>{children}</ModalLink>)
    }
    </div>
  );
}
