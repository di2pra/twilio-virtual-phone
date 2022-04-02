import { AuthState } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import { useCallback, useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PhoneContext } from "../../providers/PhoneProvider";
import { UserContext } from "../../SecureLayout";
import { IPhoneNumber, IUser } from "../../Types";
import { TwilioLogo } from "../Icons";
import NavbarItem from "./NavbarItem";
import PhoneDropdown from "./PhoneDropdown";

function Header() {

  const { authState } = useOktaAuth();
  const { loggedInUser } = useContext(UserContext);
  const { pathname } = useLocation();
  let params = useParams();

  let navigate = useNavigate();
  const { selectedPhone, phoneList, setSelectedPhone } = useContext(PhoneContext);

  const updateSelectedPhone = useCallback((item: IPhoneNumber) => {

    const currentNavLinkPhone = parseInt(params.phone_id || '');

    if (setSelectedPhone) {
      setSelectedPhone(item);

      if (currentNavLinkPhone !== item.phone_id) {
        navigate(pathname.replace(`/${currentNavLinkPhone}/`, `/${item.phone_id}/`), { replace: false });
      }
    }

  }, [setSelectedPhone, pathname, navigate, params.phone_id]);



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
            <NavbarItem to="/app" title="Home" />
            {selectedPhone ? <NavbarItem to={`${selectedPhone.phone_id}/message`} title="Message" /> : null}
            {selectedPhone ? <NavbarItem to={`${selectedPhone.phone_id}/voice`} title="Voice" /> : null}
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
  loggedInUser: IUser;
}

function LoggedInUserDropdown({ authState, loggedInUser }: Props) {
  return (
    <Nav>
      <NavDropdown title={loggedInUser.name} id="basic-nav-dropdown-user">
        <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default Header;