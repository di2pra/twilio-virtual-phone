import { AuthState, IDToken } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import { useCallback, useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { PhoneContext } from "../../providers/PhoneProvider";
import { ITwilioPhoneNumber } from "../../Types";
import { TwilioLogo } from "../Icons";
import NavbarItem from "./NavbarItem";
import PhoneDropdown from "./PhoneDropdown";

function Header() {

  const { authState } = useOktaAuth();
  const { loggedInUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  let params = useParams();

  let navigate = useNavigate();
  const { selectedPhone, phoneList, setSelectedPhone } = useContext(PhoneContext);

  const updateSelectedPhone = useCallback((item: ITwilioPhoneNumber) => {

    const currentNavLinkPhone = params.phone_sid || '';

    if (setSelectedPhone) {
      setSelectedPhone(item);

      if (currentNavLinkPhone !== item.sid) {
        navigate(pathname.replace(`/${currentNavLinkPhone}/`, `/${item.sid}/`), { replace: false });
      }
    }

  }, [setSelectedPhone, pathname, navigate, params.phone_sid]);

  return (
    <Navbar bg="white" expand="md">
      <Container fluid>
        <Navbar.Brand>
          <div
            className="navbar-logo d-inline-block align-top">
            <TwilioLogo />
          </div>
          <Link className="navbar-brand" to='/'>Twilio Virtual Phone</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
          >
            <NavbarItem to="/" title="Home" />
            {selectedPhone ? <NavbarItem to={`${selectedPhone.sid}/message`} title="Message" /> : null}
            {selectedPhone ? <NavbarItem to={`${selectedPhone.sid}/voice`} title="Voice" /> : null}
            <NavbarItem to="settings" title="Settings" />
            <PhoneDropdown phoneList={phoneList} selectedPhone={selectedPhone} updateSelectedPhone={updateSelectedPhone} />
          </Nav>
          {(authState && authState.isAuthenticated && loggedInUser) ? <LoggedInUserDropdown authState={authState} loggedInUser={loggedInUser} /> : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

}

type Props = {
  authState: AuthState;
  loggedInUser: IDToken["claims"];
}

function LoggedInUserDropdown({ authState, loggedInUser }: Props) {
  return (
    <Nav>
      <NavDropdown title={loggedInUser.name} id="basic-nav-dropdown-user">
        <NavDropdown.Item href="/account">Account</NavDropdown.Item>
        <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default Header;