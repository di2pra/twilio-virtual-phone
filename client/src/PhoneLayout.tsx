import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PhoneContext } from "./providers/PhoneProvider";

function PhoneLayout() {

  const { selectedPhone } = useContext(PhoneContext);

  if (selectedPhone === null) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <Outlet />
  )

}

export default PhoneLayout;