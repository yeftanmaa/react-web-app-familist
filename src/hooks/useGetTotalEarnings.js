import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useGetTotalEarnings = (collectionName) => {
    const [documents, setDocuments] = useState([]);

    // Firebase collection ref
    const postCollectionRef = collection(db, collectionName);

    useEffect(() => {
        const getDocuments = async() => {
            const data = await getDocs(postCollectionRef);
            setDocuments(data.docs.map((doc) => ({totalEarnings: doc.data().totalEarnings})));
        };

        getDocuments();
    }, [postCollectionRef]);

    return { documents };
}
 
export default useGetTotalEarnings;