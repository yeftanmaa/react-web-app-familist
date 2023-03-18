import { useEffect, useRef } from "react";
import { auth } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function useGetUser() {
    const currentUser = useRef(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          // import our collection in firestore
          const userDetails = collection(db, 'users');
  
          // get currentUser to be displayed on the bottom side of the page
          const qUser = query(userDetails, where('email', '==', user?.email));
          getDocs(qUser)
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                currentUser.current = doc.data().email;
              });
            })
            .catch((err) => {
              console.log('Error getting emails!', err);
            });
        } else {
          console.log('Error of auth!');
        }
      });
  
      return unsubscribe;
    }, []);
  
    return currentUser;
}