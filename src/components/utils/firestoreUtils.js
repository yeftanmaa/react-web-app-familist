import { db } from "../../firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export const getAllChartDataByQuery = async (collectionName)  => {
    
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ ...doc.data() }));
};

export const getTodayEarningByQuery = async (collectionName, field, operator, sortBy) => {
    let latestEarning = 0;
    
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    const workspaceRef = collection(db, collectionName);

    const getTodayEarning = query(workspaceRef, where(field, operator, currentDate), orderBy(field, sortBy), limit(1));
    const querySnapshot = await getDocs(getTodayEarning);

    if (!querySnapshot.empty) {
        latestEarning = querySnapshot.docs[0].data().totalEarnings;
    } else {
        alert("Current earning is missing!");
    }

    return latestEarning;
};