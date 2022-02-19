import { useCallback, useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PhoneContext } from "../../providers/PhoneProvider";
import { IPhoneTwilio } from "../../Types";
import { TwilioLogo } from "../Icons";
import NavbarItem from "./NavbarItem";
import PhoneDropdown from "./PhoneDropdown";

function Header() {

  const { pathname } = useLocation();
  let params = useParams();

  let navigate = useNavigate();
  const { selectedPhone, phoneList, setSelectedPhone } = useContext(PhoneContext);

  const updateSelectedPhone = useCallback((item: IPhoneTwilio) => {

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
            <NavbarItem to="/" title="Home" />
            {selectedPhone ? <NavbarItem to={`${selectedPhone.phone_id}/message`} title="Message" /> : null }
            {selectedPhone ? <NavbarItem to={`${selectedPhone.phone_id}/voice`} title="Voice" /> : null }
            <NavbarItem to="/settings" title="Settings" />
            <PhoneDropdown phoneList={phoneList} selectedPhone={selectedPhone} updateSelectedPhone={updateSelectedPhone} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

}

export default Header;