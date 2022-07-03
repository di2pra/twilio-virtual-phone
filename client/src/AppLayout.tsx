import { Outlet } from "react-router-dom";
import AccountProvider from "./providers/AccountProvider";
import PhoneProvider from "./providers/PhoneProvider";

function AppLayout() {

  return (
    <AccountProvider>
      <PhoneProvider>
        <Outlet />
      </PhoneProvider>
    </AccountProvider>
  )
}

export default AppLayout;