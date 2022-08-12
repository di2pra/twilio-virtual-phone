import { Outlet } from "react-router-dom";
import SocketProvider from "../providers/SocketProvider";

function PhoneLayout() {

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  )
}

export default PhoneLayout;