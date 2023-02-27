import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // v4/5
import { onAuthStateChanged  } from 'firebase/auth';
import { auth } from '../../firebase';

const PrivateRoute = props => {
  const [pending, setPending] = useState(true);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        setCurrentUser(user);
        setPending(false);
      },
      error => {
        // any error logging, etc...
        setPending(false);
      }
    );

    return unsubscribe; // <-- clean up subscription
  }, []);

  if (pending) return null; // don't do anything yet

  return currentUser 
    ? <Outlet />                        // <-- render outlet for routes
    : <Navigate to="/" replace />; // <-- redirect to log in
};

export default PrivateRoute;