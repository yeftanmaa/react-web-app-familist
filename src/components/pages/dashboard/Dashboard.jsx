import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { getMonthName } from "../../utils/DateGenerator";
import { FormatPrice } from "../../utils/PriceToString";
import Chart from 'chart.js/auto';
import AddIcon from '@mui/icons-material/Add';
import ModalPayBills from "../../modals/PayBills";
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => {

    // Get current user that logged in
    const currentUser = useRef(null);

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

    // Get list of every month by selecting dropdown menu
    const [payments, setPayments] = useState([]);
    const [prevPayments, setPrevPayments] = useState([]);
    var previousMonth = useRef('');
    const [selectedMonth, setSelectedMonth] = useState(getMonthName());
    const [highestExpense, setHighestExpense] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
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
                    const paymentDocs = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payments: paymentDocs });
                    highestPaid = paymentsSnapshot.docs.reduce(findHighestPaid, highestPaid);

                }
            }
        
            setPayments(docs);
            setIsLoading(false);
            setHighestExpense(highestPaid);
        };
        
        if (selectedMonth) {
            fetchData();
        }
    }, [selectedMonth]);

    useEffect(() => {
        const fetchPrevData = async () => {
            setIsLoading(true);
            const schedulerCol = collection(db, 'scheduler');
            const schedulerQuery = query(schedulerCol);
            const schedulerSnapshot = await getDocs(schedulerQuery);
            const docs = [];

            if (selectedMonth === 'January') {
                previousMonth.current = 'December';
            } else if (selectedMonth === 'February') {
                previousMonth.current = 'January';
            } else if (selectedMonth === 'March') {
                previousMonth.current = 'February';
            } else if (selectedMonth === 'April') {
                previousMonth.current = 'March';
            } else if (selectedMonth === 'May') {
                previousMonth.current = 'April';
            } else if (selectedMonth === 'June') {
                previousMonth.current = 'May';
            } else if (selectedMonth === 'July') {
                previousMonth.current = 'June';
            } else if (selectedMonth === 'August') {
                previousMonth.current = 'July';
            } else if (selectedMonth === 'September') {
                previousMonth.current = 'August';
            } else if (selectedMonth === 'October') {
                previousMonth.current = 'September';
            } else if (selectedMonth === 'November') {
                previousMonth.current = 'October';
            } else if (selectedMonth === 'December') {
                previousMonth.current = 'November';
            }
            
            for (const schedulerDoc of schedulerSnapshot.docs) {

                const PrevPaymentsQuery = query(
                    collection(schedulerDoc.ref, 'payments'),
                    where('lastPaid', '>=', new Date(`${previousMonth.current} 1, 2023`)),
                    where('lastPaid', '<=', new Date(`${previousMonth.current} 31, 2023`)),
                    orderBy('lastPaid', 'asc')
                );
                const paymentsSnapshot = await getDocs(PrevPaymentsQuery);
            
                if (!paymentsSnapshot.empty) {
                    const paymentDocs = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payments: paymentDocs });

                }
            }
        
            setPrevPayments(docs);
        };

        fetchPrevData();
    }, [selectedMonth])

    // render chart when component is mounted
    const chartRef = useRef(null);

    useEffect(() => {
        if (payments.length) {
            const myChart = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: payments.map((ordered) => ordered.title),
                    datasets: [
                        {
                            label: selectedMonth + " Financial Chart",
                            data: payments.map((item) => item.payments[0].amountPaid),
                            fill: true,
                            backgroundColor: 'rgba(217, 0, 0, 0.06)',
                            borderColor: 'rgba(224, 0, 0, 0.8)',
                            borderWidth: 2,
                            pointRadius: 6
                        },
                        
                        {
                            label: previousMonth.current + " Financial Chart",
                            data: prevPayments.map((item) => item.payments[0].amountPaid),
                            fill: true,
                            backgroundColor: 'rgba(0, 83, 249, 0.5)',
                            borderColor: 'rgba(0, 83, 249, 0.8)',
                            borderWidth: 2,
                            pointRadius: 6
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 200000
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
    }, [payments, selectedMonth, prevPayments]);

    // Modal handling
    const [openExpenseModal, setOpenExpenseModal] = useState(false);

    const handleOpenExpenseModal = () => {
        setOpenExpenseModal(true);
    }

    const handleCloseExpenseModal = () => {
        setOpenExpenseModal(false);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '15px'}}>
            
            <Container maxWidth="lg">

                <Box display={"flex"} alignItems={"center"} justifyContent="space-around">
                    <Select size="small" sx={{ textAlign: 'left', marginBottom: '20px'}} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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

                    <Box flexGrow={1} textAlign="center">
                        <Typography variant="h6" fontSize={"18px"} fontWeight={400}>{ selectedMonth + ' highest expenses:'}</Typography>
                        <Typography variant="h3" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(highestExpense)}</Typography>
                    </Box>

                    <Button startIcon={<AddIcon />} onClick={handleOpenExpenseModal} variant="contained" color="error" sx={{borderRadius: '7px'}}>Pay Bill</Button>
                    {openExpenseModal && <ModalPayBills open={openExpenseModal} handleClose={handleCloseExpenseModal} onCloseClick={handleCloseExpenseModal} />}
                </Box>
                
                <div style={{width: "70%", marginTop: "50px", marginLeft: 'auto', marginRight: 'auto'}}>
                    <canvas ref={chartRef} />
                </div>

                <div style={{margin: 'auto', width: '100%', marginTop: '65px'}}>

                    <Typography variant="h4" sx={{marginBottom: '20px'}}>Cashflow History</Typography>

                    <TableContainer sx={{borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', marginBottom: '30px'}}>
                        {isLoading ? (
                            <CircularProgress sx={{padding: '20px'}} />
                        ) : (
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
                                        <TableCell>{scheduler.payments && scheduler.payments[0]?.amountPaid?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                        <TableCell>{scheduler.payments && scheduler.payments[0]?.remainingBill === undefined ? 'Rp 0,00' : scheduler.payments[0]?.remainingBill?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        )}
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