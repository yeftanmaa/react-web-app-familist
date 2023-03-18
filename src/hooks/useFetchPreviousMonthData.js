import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

export default function useFetchPreviousMonthData(selectedMonth) {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const schedulerCol = collection(db, 'scheduler');
        const schedulerQuery = query(schedulerCol);
        const schedulerSnapshot = await getDocs(schedulerQuery);
        const docs = [];
        let highestPaid = 0;
  
        const findHighestPaid = (highestPaid, doc) => {
          const amountPaid = doc.data().amountPaid;
          return amountPaid > highestPaid ? amountPaid : highestPaid;
        };
  
        for (const schedulerDoc of schedulerSnapshot.docs) {
          const paymentsQuery = query(
            collection(schedulerDoc.ref, 'payments'),
            where('lastPaid', '>=', new Date(`${selectedMonth} 1, 2023`)),
            where('lastPaid', '<=', new Date(`${selectedMonth} 31, 2023`)),
            orderBy('lastPaid', 'asc')
          );
          const paymentsSnapshot = await getDocs(paymentsQuery);
  
          if (!paymentsSnapshot.empty) {
            const paymentDocs = paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payments: paymentDocs });
            highestPaid = paymentsSnapshot.docs.reduce(findHighestPaid, highestPaid);
          }
        }
  
        setPayments(docs);
      };
  
      if (selectedMonth) {
        fetchData();
      }
    }, [selectedMonth]);
  
    return [payments];
}