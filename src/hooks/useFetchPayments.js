import { query, where, getDocs, collection, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

// Get the start of current month
const currentDate = new Date();
const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Get the end of current month
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

export const FetchAllPayments = async () => {
    const schedulerCol = collection(db, 'scheduler');
    const schedulerQuery = query(schedulerCol);
    const schedulerSnapshot = await getDocs(schedulerQuery);
    const docs = [];

    for (const schedulerDoc of schedulerSnapshot.docs) {
        const paymentsQuery = query(
            collection(schedulerDoc.ref, 'payments'),
            where('lastPaid', '>=', startOfTheMonth),
            where('lastPaid', '<=', endOfMonth),
            orderBy('lastPaid', 'asc')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);

        if (!paymentsSnapshot.empty) {
            const paymentDocs = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payments: paymentDocs });
        }
    }

    return docs;
};

export const FetchHighestExpenses = async () => {
    const schedulerCol = collection(db, 'scheduler');
    const schedulerQuery = query(schedulerCol);
    const schedulerSnapshot = await getDocs(schedulerQuery);
    let highestPaid = 0;

    const findHighestPaid = (highestPaid, doc) => {
        const amountPaid = doc.data().amountPaid;
        return amountPaid > highestPaid ? amountPaid : highestPaid;
    };

    for (const schedulerDoc of schedulerSnapshot.docs) {
        const paymentsQuery = query(
            collection(schedulerDoc.ref, 'payments'),
            where('lastPaid', '>=', new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
            where('lastPaid', '<=', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
    
        if (!paymentsSnapshot.empty) {
            highestPaid = paymentsSnapshot.docs.reduce(findHighestPaid, highestPaid);
        };
    };

    return highestPaid;
};