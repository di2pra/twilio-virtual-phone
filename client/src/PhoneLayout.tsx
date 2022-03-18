import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { PhoneContext } from "./providers/PhoneProvider";

function PhoneLayout() {

  return (
    <Outlet />
  )

}

export default PhoneLayout;