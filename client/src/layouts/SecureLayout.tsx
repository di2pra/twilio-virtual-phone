import { useOktaAuth } from '@okta/okta-react';
import { createContext, FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const UserContext = createContext<{}>({});

const SecureLayout: FC = () => {

  const { authState } = useOktaAuth();


  if (!authState) {
    return null;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <UserContext.Provider value={{}}>
      <Outlet />
    </UserContext.Provider>
  )

}

export default SecureLayout;