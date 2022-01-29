import { useCallback, useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IPhone } from "../../hooks/useApi";
import { PhoneContext } from "../../providers/PhoneProvider";
import NavbarItem from "./NavbarItem";


function Header() {

  const { pathname } = useLocation();
  let params = useParams();

  let navigate = useNavigate();
  const { selectedPhone, phoneList, setSelectedPhone } = useContext(PhoneContext);

  const updateSelectedPhone = useCallback((item: IPhone) => {

    const currentNavLinkPhone = parseInt(params.phone_id || '');

    if (setSelectedPhone) {
      setSelectedPhone(item);

      if (currentNavLinkPhone !== item.phone_id) {
        navigate(pathname.replace(`/${currentNavLinkPhone}/`, `/${item.phone_id}/`), { replace: true });
      }
    }

  }, [setSelectedPhone, pathname, navigate, params.phone_id]);

  if(selectedPhone) {
    return (
      <Navbar bg="primary" variant="dark" expand="md">
        <Container fluid>
          <Navbar.Brand><Link className="navbar-brand" to='/'>Twilio Virtual Phone</Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              navbarScroll
            >
              <NavbarItem to="/" title="Home" />
              <NavbarItem to={`${selectedPhone.phone_id}/message`} title="Message" />
              <NavbarItem to={`${selectedPhone.phone_id}/voice`} title="Voice" />
              <NavbarItem to="/settings" title="Settings" />
              <NavDropdown title={`${selectedPhone.alias} (${selectedPhone.number})`} id="basic-nav-dropdown">
                {
                  phoneList?.map((item, index) => {
                    if (item.phone_id === selectedPhone.phone_id) {
                      return null
                    }
                    return <NavDropdown.Item onClick={() => { updateSelectedPhone(item) }} key={index}>{item.alias} ({item.number})</NavDropdown.Item>
                  })
                }
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  
  } else {
    return null
  }

  
}

export default Header;