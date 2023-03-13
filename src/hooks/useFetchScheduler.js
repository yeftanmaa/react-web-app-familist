import { collection, getDocs, query } from "firebase/firestore"
import { db } from "../config/firebase"

export const FetchAllSchedulers = async () => {
    const schedulerRef = collection(db, 'scheduler');

    const getSchedulerData = await getDocs(schedulerRef);

    return getSchedulerData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getAllSchedulerData = async () => {
    const schedulerQuery = query(collection(db, 'scheduler'));
    const schedulerSnapshots = await getDocs(schedulerQuery);

    const schedulers = schedulerSnapshots.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { ...data, id };
    });

    const promises = schedulers.map(async (scheduler) => {
        const paymentsQuery = query(
          collection(db, 'scheduler', scheduler.id, 'payments')
        );
        const paymentsSnapshots = await getDocs(paymentsQuery);
    
        const payments = paymentsSnapshots.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { ...data, id };
        });

        return { ...scheduler, payments };
    });

    const results = await Promise.all(promises);

    return results;
}