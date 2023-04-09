import { db } from "../../config/firebase";
import { collection, getDocs, limit, orderBy, query, where, Timestamp, doc, updateDoc, collectionGroup } from "firebase/firestore";

export const getUserInfo = async (currentUserToken) => {
    const querySnapshot = await getDocs(
        query(collection(db, "users"), where('token' , '==', currentUserToken))
    );

    return querySnapshot.docs.map((doc) => ({ ...doc.data() }));
};

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

    const schedulerRef = collection(db, 'scheduler');

    const getSchedulerData = await getDocs(schedulerRef);

    return getSchedulerData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
};

export const GetAllCashflowData = async () => {
    const cashflowRef = collection(db, "workspace-graph");

    const getCashflowData = await getDocs(cashflowRef);

    return getCashflowData.docs.map((doc) => ({ ...doc.data(), id: doc.id}))
};

export const GetFamilyMembers = async () => {
    const memberRef = collection(db, "users");

    const getFamilyMembers = await getDocs(memberRef);

    return getFamilyMembers.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
};

export const GetPaymentInfo = async () => {
    const paymentRef = collection(db, "payments");

    const getPaymentInfo = await getDocs(paymentRef);

    return getPaymentInfo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
};

export const UpdateCardStatus = async (cardID, newStatus) => {
    try {
        const cardRef = doc(db, 'payments', cardID);
        await updateDoc(cardRef, { status: newStatus });
    } catch(err) {
        console.error('Error updating card status!', err);
    }
};

export const GetMemberOnCurrentToken = async (keyValue) => {
    
    const memberListRef = collection(db, 'users');

    const getMemberOnToken = query(memberListRef, where("token", "==", keyValue));
    const querySnapshot = await getDocs(getMemberOnToken);

    if (!querySnapshot.empty) {
       return querySnapshot.docs.map((doc) => ({ ...doc.data() }))
    } else {
        alert("No Users in this workspace!");
    }
};

export const GetPreviousMonthRemainingBill = async (schedulerID) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const firstDay = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastDay = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    try {
        const q = query(collectionGroup(db, "payments"), where("lastPaid", ">=", firstDay), where("lastPaid", "<=", lastDay));
        const querySnapshot = await getDocs(q);

        let totalRemainingBill = 0;

        querySnapshot.forEach((doc) => {
            if (doc.ref.parent.parent.id === schedulerID) {
                totalRemainingBill += doc.data().remainingBill;
            }
        });
        return totalRemainingBill;
    } catch (e) {
        console.error("Error fetching data: ", e);
        return null;
    }
}