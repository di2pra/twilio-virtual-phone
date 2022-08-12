import { FC } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';


interface Props {
  to: string,
  title: string
}

const NavbarItem: FC<Props> = ({ to, title }) => {
  return (
    <Nav.Item>
      <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to={to}>{title}</NavLink>
    </Nav.Item>
  );
}

export default NavbarItem;