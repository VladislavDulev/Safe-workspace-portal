import React, { useContext } from 'react';
import { withRouter, Link } from "react-router-dom";
import { Nav, NavDropdown } from 'react-bootstrap';
import './Navigation.css';
import AuthContext from '../../providers/AuthContext';

const Navigation = () => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  return (
        <Nav activeKey="/home" className={'menu'}>
          <Nav.Item>
            <Nav.Link as={Link} to="/home" className={"menu-item"}>Home</Nav.Link>
          </Nav.Item>
          <NavDropdown title="Users" id="collasible-nav-dropdown">
            {isLoggedIn &&
            <NavDropdown.Item as={Link} to="/users/me">My Profile</NavDropdown.Item>
            }
            <NavDropdown.Item as={Link} to="/users/now">Location Now</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/users/later">Location Next Week</NavDropdown.Item>
          </NavDropdown>
          {!isAdmin &&  
            <Nav.Item>
              <Nav.Link as={Link} to='/offices' className={"menu-item"}>Offices</Nav.Link>
            </Nav.Item>
          }
          { !isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/login' className={"menu-item"}>Login</Nav.Link>
            </Nav.Item>
          }
          { !isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/register' className={"menu-item"}>Register</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn &&  
          <Nav.Item>
            <Nav.Link as={Link} to='/projects' className={"menu-item"}>Projects</Nav.Link>
          </Nav.Item>
          }
          { isLoggedIn && isAdmin &&  
            <NavDropdown title="Offices" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/office/create">Create Office</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/offices">Offices</NavDropdown.Item>
            </NavDropdown>
          }

          { isLoggedIn && isAdmin &&  
            <Nav.Item>
            <Nav.Link as={Link} to='/covid' className={"menu-item"}>Covid Data  </Nav.Link>
          </Nav.Item>          }
          { isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/logout' className={"menu-item"}>Logout</Nav.Link>
            </Nav.Item>
          }
        </Nav>
    )
};
    
export default withRouter(Navigation);