import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AccountProvider from "../providers/AccountProvider";
import AuthProvider from "../providers/AuthProvider";
import PhoneProvider from "../providers/PhoneProvider";

function AppLayout() {

  return (
    <AuthProvider>
      <AccountProvider>
        <PhoneProvider>
          <Header />
          <Container className="mt-3" fluid>
            <Outlet />
          </Container>
          <Footer />
        </PhoneProvider>
      </AccountProvider>
    </AuthProvider>
  )
}

export default AppLayout;