import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';

const NewDash = () => {
  const [chartData, setChartData] = useState({});

  const fetchData = async () => {
    const db = getFirestore();
    const data = await getDocs(collection(db, 'workspace-graph'));

    const earnings = data.docs.forEach((doc) => doc.data().totalEarnings);

    setChartData({
      labels: ['Document 1', 'Document 2', 'Document 3'],
      datasets: [
        {
          label: 'Total Earnings',
          data: earnings,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default NewDash;
