import { useContext } from "react";
import Container from "react-bootstrap/Container";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import { ConfigContext } from "../../providers/ConfigProvider";

function ConfigLayout() {

  const { config } = useContext(ConfigContext);

  if(config === null) {
    return (
      <>
        <Container className="mt-3" fluid>
          <Outlet />
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <Navigate to="/" replace />
  )

}

export default ConfigLayout;