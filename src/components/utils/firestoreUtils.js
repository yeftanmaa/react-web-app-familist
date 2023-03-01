import { db } from "../../config/firebase";
import { collection, getDocs, limit, orderBy, query, where, Timestamp } from "firebase/firestore";

export const getAllChartDataByQuery = async (collectionName)  => {
    // Get the start of current month
    const currentDate = new Date();
    const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the end of current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
    
    const querySnapshot = await getDocs(
       query(collection(db, collectionName), where('createdAt', '>=', startOfTheMonth), where('createdAt', '<=', endOfMonth))
    );
    
    return querySnapshot.docs.map((doc) => ({ ...doc.data() }));
};

export const getTodayEarningByQuery = async (collectionName, field, operator, sortBy) => {
    let latestEarning = 0;

    const workspaceRef = collection(db, collectionName);

    const getTodayEarning = query(workspaceRef, where(field, operator, Timestamp.fromDate(new Date())), orderBy(field, sortBy), limit(1));
    const querySnapshot = await getDocs(getTodayEarning);

    if (!querySnapshot.empty) {
        latestEarning = querySnapshot.docs[0].data().totalEarnings;
    } else {
        alert("Current earning is missing!");
    }

    return latestEarning;
};

export const getAllSchedulerData = async () => {
    const getSchedulerData = await getDocs(
        collection(db, 'scheduler')
    );

    return getSchedulerData.docs.map((doc) => ({ ...doc.data()}))
}