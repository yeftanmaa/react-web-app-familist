import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';

const PrivateRoute = (props) => {
  const [authState, setAuthState] = useState({ authPending: true, isAuthenticated: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ authPending: false, isAuthenticated: !!user });
    });
    return unsubscribe;
  }, []);

  if (authState.authPending) {
    return null;
  }

  if (authState.isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
