import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function useFetchPaymentsLastPaid() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
      const schedulerCol = collection(db, 'scheduler');
      const schedulerQuery = query(schedulerCol);
      const schedulerSnapshot = await getDocs(schedulerQuery);
      const docs = [];

      for (const schedulerDoc of schedulerSnapshot.docs) {
        const paymentsQuery = query(collection(schedulerDoc.ref, 'payments'), orderBy('lastPaid', 'desc'), limit(1));
        const paymentsSnapshot = await getDocs(paymentsQuery);

        if (!paymentsSnapshot.empty) {
          const paymentDoc = paymentsSnapshot.docs[0];
          docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payment: { id: paymentDoc.id, ...paymentDoc.data() } });
        }
      }

      setData(docs);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return [data, isLoading];
};
