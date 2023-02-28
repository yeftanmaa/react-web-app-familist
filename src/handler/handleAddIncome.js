import { addDoc, collection } from "@firebase/firestore"
import { db } from "../config/firebase"

export const HandleAddIncome = (testdata) => {
    const workspaceRef = collection(db, "workspace-graph"); // Firebase creates this automatically

    let newIncomeData = {
        createdAt: "ADD_CURRENT_DATE",
        token: "n4th4nSpace",
        totalEarnings: "GET_CURRENT_PLUS_NEW_INCOME"
    }

    try {
        addDoc(workspaceRef, newIncomeData)
    } catch(err) {
        console.error("Error!", err);
    };
};