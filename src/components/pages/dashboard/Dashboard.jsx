import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { getMonthName } from "../../utils/DateGenerator";
import { FormatPrice } from "../../utils/PriceToString";
import Chart from 'chart.js/auto';
import {  getAllChartDataByQuery } from "../../utils/firestoreUtils";
// import ModalAddIncome from "../../modals/AddIncome";
import AddIcon from '@mui/icons-material/Add';
import { FetchAllPayments } from "../../../hooks/useFetchPayments";
// import ModalAddExpense from "../../modals/AddExpense";

const Dashboard = () => {

    const chartRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [newChartData, setNewChartData] = useState([]);
    
    // Get chart data
    useEffect(() => {
        const fetchChartData = async () => {
            const chartData = await getAllChartDataByQuery("workspace-graph");
            setChartData(chartData);
        };

        fetchChartData();
    }, [])

    // Get NEW chart data
    useEffect(() => {
        const fetchNewChartData = async () => {
            const chartData = await FetchAllPayments();
            setNewChartData(chartData);
        };

        fetchNewChartData();
    }, [])

    // render chart when component is mounted
    useEffect(() => {
        if (newChartData.length) {
            const myChart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: newChartData
                    .sort((a,b) => a.lastPaid.seconds - b.lastPaid.seconds)
                    .map((item) => {
                        const dateObj =  item.lastPaid.toDate();
                        return dateObj.getDate();
                    }),
                    datasets: [
                        {
                            label: getMonthName() + " Financial Chart",
                            data: newChartData.map((item) => item.amountPaid),
                            fill: true,
                            backgroundColor: 'rgba(217, 0, 0, 0.06)',
                            borderColor: 'rgba(224, 0, 0, 0.8)',
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
    }, [newChartData]);

    const currentUser = useRef(null);
    // const [latestEarning, setLatestEarning] = useState(0);

    // Get Today Earning
    // useEffect(() => {
    //     const fetchTodayEarning  = async() => {
    //         const earning = await getTodayEarningByQuery('workspace-graph', 'createdAt', '<=', "desc");
    //         setLatestEarning(earning);
    //     };

    //     fetchTodayEarning();
    // }, []);

    // Get payment info based on user month selection
    const [selectedMonth, setSelectedMonth] = useState("March");
    const [payments, setPayments] = useState([]);
    const [highestExpense, setHighestExpense] = useState(0);
    
    // Get list of every month by selecting dropdown menu
    useEffect(() => {
        const fetchData = async () => {
          const schedulerCol = collection(db, 'scheduler');
          const schedulerQuery = query(schedulerCol);
          const schedulerSnapshot = await getDocs(schedulerQuery);
          const docs = [];
      
          for (const schedulerDoc of schedulerSnapshot.docs) {
            const paymentsQuery = query(
              collection(schedulerDoc.ref, 'payments'),
              where('lastPaid', '>=', new Date(`${selectedMonth} 1, 2023`)),
              where('lastPaid', '<=', new Date(`${selectedMonth} 31, 2023`)),
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);
      
            if (!paymentsSnapshot.empty) {
              const paymentDocs = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payments: paymentDocs });
            }
          }
      
          setPayments(docs);
        };
      
        if (selectedMonth) {
          fetchData();
        }
    }, [selectedMonth]);

    // Get highest expenses on current month
    useEffect(() => {
        const fetchData = async () => {
          const schedulerCol = collection(db, 'scheduler');
          const schedulerQuery = query(schedulerCol);
          const schedulerSnapshot = await getDocs(schedulerQuery);
          let highestPaid = 0;
      
          for (const schedulerDoc of schedulerSnapshot.docs) {
            const paymentsQuery = query(
              collection(schedulerDoc.ref, 'payments'),
              where('lastPaid', '>=', new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
              where('lastPaid', '<=', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);
      
            if (!paymentsSnapshot.empty) {
              paymentsSnapshot.forEach(doc => {
                const amountPaid = doc.data().amountPaid;
                if (amountPaid > highestPaid) {
                  highestPaid = amountPaid;
                }
              });
            }
          }
      
          setHighestExpense(highestPaid);
        };
      
        fetchData();
      }, []);
    

    // Get current user that logged in
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

    // const [openModal, setOpenModal] = useState(false);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);
    
    // const handleOpenModal = () => {
    //     setOpenModal(true);
    // }

    // const handleCloseModal = () => {
    //     setOpenModal(false);
    // }

    const handleOpenExpenseModal = () => {
        setOpenExpenseModal(true);
    }

    const handleCloseExpenseModal = () => {
        setOpenExpenseModal(false);
    }
    
    // const [cashflowData, setCashflowData] = useState([]);

    // useEffect(() => {
    //     const fetchCashflowData = async () => {
    //         const cashflowData = await GetAllCashflowData();
    //         setCashflowData(cashflowData);
    //     }

    //     fetchCashflowData();
    // }, [])    

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
            
            <Container maxWidth="lg">

                <Box display={"flex"} alignItems={"center"} justifyContent="space-around" marginTop={"30px"}>
                    <Box flexGrow={1}>
                        <Typography variant="h6" fontWeight={400}>{getMonthName() + ' highest expenses:'}</Typography>
                        <Typography variant="h3" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(highestExpense)}</Typography>
                    </Box>


                    <Button startIcon={<AddIcon />} onClick={handleOpenExpenseModal} variant="contained" color="error" sx={{borderRadius: '7px'}}>Add Expense</Button>

                    {/* <Button startIcon={<AddIcon />} onClick={handleOpenModal} variant="contained" color="primary" sx={{borderRadius: '7px'}}>Add Income</Button> */}

                    {/* {openModal && <ModalAddIncome open={openModal} handleClose={handleCloseModal} onCloseClick={handleCloseModal} getLatestEarning={latestEarning} />} */}
                    {/* {openExpenseModal && <ModalAddExpense open={openExpenseModal} handleClose={handleCloseExpenseModal} onCloseClick={handleCloseExpenseModal} getLatestEarning={latestEarning} />} */}
                </Box>
                
                <div style={{width: "100%", marginTop: "30px", marginLeft: 'auto', marginRight: 'auto'}}>
                    <canvas ref={chartRef} />
                </div>

                <div style={{margin: 'auto', width: '100%', marginTop: '65px'}}>

                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography variant="h4" sx={{marginBottom: '20px'}}>Cashflow History</Typography>

                        <Select size="small" sx={{padding: '0 20px', marginBottom: '20px'}} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <MenuItem value="January">January</MenuItem>
                            <MenuItem value="February">February</MenuItem>
                            <MenuItem value="March">March</MenuItem>
                            <MenuItem value="April">April</MenuItem>
                            <MenuItem value="May">May</MenuItem>
                            <MenuItem value="June">June</MenuItem>
                            <MenuItem value="July">July</MenuItem>
                            <MenuItem value="August">August</MenuItem>
                            <MenuItem value="September">September</MenuItem>
                            <MenuItem value="October">October</MenuItem>
                            <MenuItem value="November">November</MenuItem>
                            <MenuItem value="December">December</MenuItem>
                        </Select>
                    </Box>

                    <TableContainer sx={{borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', marginBottom: '30px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Title</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Date Paid</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Amount Paid</TableCell>
                                    <TableCell sx={{fontWeight: 600, fontSize: 15}}>Remaining Payment</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {payments.map((scheduler) => (
                                    <TableRow key={scheduler.id}>
                                        <TableCell>{scheduler.title}</TableCell>
                                        <TableCell>{scheduler.payments && scheduler.payments[0]?.lastPaid?.toDate().toLocaleDateString()}</TableCell>
                                        <TableCell>{scheduler.payments && scheduler.payments[0]?.amountPaid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                        <TableCell>{scheduler.payments && scheduler.payments[0]?.remainingBill.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
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