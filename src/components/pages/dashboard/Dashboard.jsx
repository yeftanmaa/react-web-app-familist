import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { getMonthName } from "../../utils/DateGenerator";
import { FormatPrice } from "../../utils/PriceToString";
import Chart from 'chart.js/auto';
import { GetAllCashflowData, getAllChartDataByQuery, getTodayEarningByQuery } from "../../utils/firestoreUtils";
import ModalAddIncome from "../../modals/AddIncome";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ModalAddExpense from "../../modals/AddExpense";

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
                type: 'line',
                data: {
                    labels: chartData
                    .sort((a,b) => a.createdAt.seconds - b.createdAt.seconds)
                    .map((item) => {
                        const dateObj =  item.createdAt.toDate();
                        return dateObj.getDate();
                    }),
                    datasets: [
                        {
                            label: getMonthName() + " Financial Chart",
                            data: chartData.map((item) => item.totalEarnings),
                            fill: true,
                            backgroundColor: 'rgba(20, 76, 245, 0.16)',
                            borderColor: 'rgba(20, 76, 245, 0.91)',
                            borderWidth: 2,
                            pointRadius: 6,
                            tension: 0.4
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 500000
                            }
                        },
                        
                        x: {
                            grid: {
                                display : false
                            }
                            
                        }
                    },
                },
            });

            return () => {
                myChart.destroy();
            };
        }
    }, [chartData]);

    const currentUser = useRef(null);
    const [latestEarning, setLatestEarning] = useState(0);

    // Get Today Earning
    useEffect(() => {
        const fetchTodayEarning  = async() => {
            const earning = await getTodayEarningByQuery('workspace-graph', 'createdAt', '<=', "desc");
            setLatestEarning(earning);
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
                    console.log("Error getting emails!", err);
                });

            } else {
                console.log("Error of auth!");
            }
        })

        return unsubscribe;
    })

    const [openModal, setOpenModal] = useState(false);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);
    
    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleOpenExpenseModal = () => {
        setOpenExpenseModal(true);
    }

    const handleCloseExpenseModal = () => {
        setOpenExpenseModal(false);
    }
    
    const [cashflowData, setCashflowData] = useState([]);

    useEffect(() => {
        const fetchCashflowData = async () => {
            const cashflowData = await GetAllCashflowData();
            setCashflowData(cashflowData);
        }

        fetchCashflowData();
    }, [])    

    return (
        <div>
            
            <Container maxWidth="lg">

                <Box display={"flex"} alignItems={"center"} marginTop={"30px"}>
                    <Button startIcon={<RemoveIcon />} onClick={handleOpenExpenseModal} variant="contained" color="error" sx={{borderRadius: '7px'}}>Add Expense</Button>

                    <Box flexGrow={1} textAlign={"center"}>
                        <Typography variant="h6" fontWeight={400}>Current total earnings:</Typography>
                        <Typography variant="h3" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(latestEarning)}</Typography>
                    </Box>

                    <Button startIcon={<AddIcon />} onClick={handleOpenModal} variant="contained" color="primary" sx={{borderRadius: '7px'}}>Add Income</Button>

                    {openModal && <ModalAddIncome open={openModal} handleClose={handleCloseModal} onCloseClick={handleCloseModal} getLatestEarning={latestEarning} />}
                    {openExpenseModal && <ModalAddExpense open={openExpenseModal} handleClose={handleCloseExpenseModal} onCloseClick={handleCloseExpenseModal} getLatestEarning={latestEarning} />}
                </Box>
                
                <div style={{width: "100%", marginTop: "30px", marginLeft: 'auto', marginRight: 'auto'}}>
                    <canvas ref={chartRef} />
                </div>

                <div style={{margin: 'auto', width: '100%', marginTop: '65px'}}>
                    <Typography variant="h4" sx={{marginBottom: '20px'}}>Cashflow History</Typography>
                    <TableContainer sx={{borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', p: 1, marginBottom: '30px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Date</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15, textAlign: 'center'}}>Type</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Title</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Details</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Amount</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15, textAlign: 'right'}}>Total Current Money</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {cashflowData
                                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                                .map((cashdata) => (
                                    <TableRow key={cashdata.id}>
                                        <TableCell>{new Date(cashdata.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Box bgcolor={cashdata.type === 'Income' ? 'rgba(20, 202, 9, 0.87)' : 'rgba(234, 71, 71, 0.95)'} sx={{padding: '4px 9px', fontSize: '13px', color: 'white', borderRadius: '50px', textAlign: 'center'}}>
                                                {cashdata.type === 'Income' ? 'Income' : 'Expenses'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{cashdata.title}</TableCell>
                                        <TableCell>{cashdata.description}</TableCell>
                                        <TableCell>{cashdata.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                        <TableCell sx={{ textAlign: 'right'}}>{cashdata.totalEarnings.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Container>

            <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: 14, opacity: 0.6, position: 'fixed', bottom: 26, right: 25}}>{currentUser.current === null ? "" : "Logged in as: " + currentUser.current} </p>
                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0, right: 25}}>Copyright 2023. Thesis Project Purposes.</p>
            </div>
        </div>
    );
}
 
export default Dashboard;