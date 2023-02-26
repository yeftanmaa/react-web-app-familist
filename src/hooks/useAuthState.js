import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../firebase'

function useAuthState() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a user signed in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        signOut(auth);
        setUser(null);
      } else {
        setUser(null);
      }
    });

    // // Sign out the user if there is one
    // if (user) {
    //   signOut(auth)
    //     .then(() => {
    //       setUser(null);
    //     })
    //     .catch((err) => {
    //       alert("Error signing out: ", err);
    //     })
    // }

    return unsubscribe;
  }, []);

  return user;
}

export default useAuthState;
