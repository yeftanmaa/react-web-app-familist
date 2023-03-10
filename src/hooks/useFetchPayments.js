import { query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../config/firebase';

// Get the start of current month
const currentDate = new Date();
const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Get the end of current month
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

export const FetchAllPayments = async () => {
    const paymentRef = collectionGroup(db, 'payments');
    const paymentsQuery = query(paymentRef, 
        where('lastPaid', '>=', startOfTheMonth), 
        where('lastPaid', '<=', endOfMonth)
    );
    
    const paymentsSnapshot = await getDocs(paymentsQuery);

    return paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
