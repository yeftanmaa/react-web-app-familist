import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';

function useAuthState() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a user signed in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(null);
      } else {
        setUser(null);
      }
    });
    
    return unsubscribe;
  }, []);

  return user;
}

export default useAuthState;
