import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem, Skeleton } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { getMonthName } from "../../utils/DateGenerator";
import Chart from 'chart.js/auto';
import AddIcon from '@mui/icons-material/Add';
import ModalPayBills from "../../modals/PayBills";
import useFetchCashflowHistory from "../../../hooks/useFetchCashflowHistory";
import useFetchPreviousMonthData from "../../../hooks/useFetchPreviousMonthData";
import useGetUser from '../../../hooks/useGetUser';

function setPreviousMonth(month) {
    if (month === 'January') {
        return 'December';
    } else if (month === 'February') {
        return 'January';
    } else if (month === 'March') {
        return 'February';
    } else if (month === 'April') {
        return 'March';
    } else if (month === 'May') {
        return 'April';
    } else if (month === 'June') {
        return 'May';
    } else if (month === 'July') {
        return 'June';
    } else if (month === 'August') {
        return 'July';
    } else if (month === 'September') {
        return 'August';
    } else if (month === 'October') {
        return 'September';
    } else if (month === 'November') {
        return 'October';
    } else if (month === 'December') {
        return 'November';
    }
}

const Dashboard = () => {

    // calling hooks to retrieve user that recently logged in
    const currentUser = useGetUser();

    // calling hooks to retrieve cashflow history
    const [selectedMonth, setSelectedMonth] = useState(getMonthName());
    const [payments, isLoading] = useFetchCashflowHistory(selectedMonth);

    // calling hooks to retrieve previous month data
    var previousMonth = useRef('');
    previousMonth.current = setPreviousMonth(selectedMonth);
    const [prevPayments] = useFetchPreviousMonthData(setPreviousMonth(selectedMonth));

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
                            backgroundColor: 'rgba(0, 83, 249, 0.05)',
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
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '45px'}}>
            
            <Container maxWidth="lg">

                <Box display={"flex"} alignItems={"center"} justifyContent="space-around">
                    <Select size="small" sx={{ textAlign: 'left' }} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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
                        {/* <Typography variant="h6" fontSize={"18px"} fontWeight={400}>{ selectedMonth + ' highest expenses:'}</Typography> */}
                        {/* <Typography variant="h3" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(highestExpense)}</Typography> */}
                        <Typography variant="h4" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>Family Monthly Expenses System</Typography>
                    </Box>

                    <Button startIcon={<AddIcon />} onClick={handleOpenExpenseModal} variant="contained" color="error" sx={{borderRadius: '7px'}}>Pay Bill</Button>
                    {openExpenseModal && <ModalPayBills open={openExpenseModal} handleClose={handleCloseExpenseModal} onCloseClick={handleCloseExpenseModal} />}
                </Box>
                
                <div style={{width: "80%", marginTop: "50px", marginLeft: 'auto', marginRight: 'auto'}}>
                    {isLoading ? (
                        <Skeleton variant="rounded" height={400} />
                    ) : (
                        <canvas ref={chartRef} />
                    )}
                    
                </div>

                <div style={{margin: 'auto', width: '100%', marginTop: '65px'}}>

                    <Typography variant="h4" sx={{marginBottom: '20px'}}>Cashflow History</Typography>

                    <TableContainer sx={{borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', marginBottom: '30px'}}>
                        {isLoading ? (
                            <div>
                                <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                                <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                                <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                                <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            </div>
                            
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