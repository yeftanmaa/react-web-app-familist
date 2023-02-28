import { Button, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { getMonthName } from "../../utils/DateGenerator";
import { FormatPrice } from "../../utils/PriceToString";
import Chart from 'chart.js/auto';
import { getAllChartDataByQuery, getTodayEarningByQuery } from "../../utils/firestoreUtils";


const Dashboard = () => {

    const chartRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    
    // Get chart data
    useEffect(() => {
        const fetchChartData = async () => {
            const chartData = await getAllChartDataByQuery("workspace-graph");
            setChartData(chartData);
        };

        fetchChartData();
    }, [])

    // render chart when component is mounted
    useEffect(() => {
        if (chartData.length) {
            const myChart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: chartData
                    .sort((a,b) => a.createdAt.seconds - b.createdAt.seconds)
                    .map((item) => {
                        const dateObj =  item.createdAt.toDate();
                        return dateObj.getDate();
                    }),
                    datasets: [
                        {
                            label: getMonthName() + " Financial Log",
                            data: chartData.map((item) => item.totalEarnings),
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: [
                            {
                                ticks: {
                                    beginAtZero: true
                                },
                            }
                        ],
                    },
                },
            });

            return () => {
                myChart.destroy();
            };
        }
    }, [chartData]);

    const currentUser = useRef(null);
    const latestEarning = useRef(0);

    // Get Today Earning
    useEffect(() => {
        const fetchTodayEarning  = async() => {
            const earning = await getTodayEarningByQuery('workspace-graph', 'createdAt', '<=', "desc");
            latestEarning.current = earning;
        };

        fetchTodayEarning();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // import our collection in firestore
                
                const userDetails = collection(db, "users");

                // get currentUser to be displayed on the bottom side of the page
                const qUser = query(userDetails, where("email", "==", user?.email));
                getDocs(qUser).then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                        currentUser.current = (doc.data().email);
                    })
                }).catch((err) => {
                    console.log("Error getting earnings", err);
                });

            } else {
                console.log("Error of auth!");
            }
        })

        return unsubscribe;
    })

    return (
        <div>
            
            <Container maxWidth="lg">

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginTop={"20px"} >
                    <Box>
                        <Typography variant="h6" fontWeight={400}>Current total earnings:</Typography>
                        <Typography variant="h2" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(latestEarning.current)}</Typography>
                    </Box>

                    <Button variant="contained" color="primary" sx={{padding: '5px 30px', borderRadius: '7px'}}>Add Income</Button>
                </Box>

                <div style={{width: "95 %", marginTop: "30px", marginLeft: 'auto', marginRight: 'auto'}}>
                    <canvas ref={chartRef} />
                </div>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <p style={{ fontSize: 14, position: 'fixed', bottom: 37}}>{currentUser.current === null ? "" : "Logged in as: " + currentUser.current} </p>
                    <p style={{opacity: 0.3, position: 'fixed', bottom: 10}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
                

            </Container>
        </div>
    );
}
 
export default Dashboard;