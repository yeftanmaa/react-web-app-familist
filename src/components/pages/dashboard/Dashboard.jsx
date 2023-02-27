import { Button, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../firebase";
import LineChart from "../../chart/LineChart";
import { daysInArray, getMonthName } from "../../utils/DateGenerator";
import { FormatPrice } from "../../utils/PriceToString";

const Dashboard = () => {

    // eslint-disable-next-line
    const [day, setDay] = useState();
    const currentUser = useRef(null);
    const latestEarning = useRef(0);

    // Get current date with hours set to 0
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    

    useEffect(() => {
        const unsusbcribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const workspaceDetails = collection(db, "workspace-graph");
                const userDetails = collection(db, "users");

                // const q = query(workspaceDetails, where("token", "==", "n4th4nSpace"));
                const qUser = query(userDetails, where("email", "==", user?.email));
                const getTodayEarnings = query(workspaceDetails, where("createdAt", ">=", currentDate));

                // getDocs(q).then((querySnapshot) => {
                //     querySnapshot.docs.forEach((doc) => {
                //         setCurrentIncome(doc.data().totalEarnings);
                //         setDay(doc.data().createdAt.toDate());
                //     })
                // }).catch((err) => {
                //     console.log("Error getting earnings", err);
                // });

                getDocs(qUser).then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                        currentUser.current = (doc.data().email);
                    })
                }).catch((err) => {
                    console.log("Error getting earnings", err);
                });

                getDocs(getTodayEarnings).then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        // There is at least one document that matches query
                        latestEarning.current = querySnapshot.docs[0].data().totalEarnings;
                        console.log(querySnapshot.docs[0].data().totalEarnings);
                    } else {
                        alert("No matching earnings for today!");
                    }
                })

            } else {
                console.log("Error of auth!");
            }
        })

        return unsusbcribe;
    })

    // configure userData to be displayed in chart
    const [userData] = useState({
        labels: daysInArray,
        datasets: [{
            label: getMonthName() + ' Incomes & Expenses',  
            data: [10706, 12847, 11516, 10464, 10707, 10706, 12847, 11516, 10464, 11723, 11923, 11922, 11922, 11922, 12012, 11912, 10900, 10705, 10238, 10353, 10353, 11012, 11000, 12000, 12000, 12000],
            borderColor: "rgb(255,99,132)",
            backgroundColor: "rgba(255,99,132, 0.5)",
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
        }]
    })

    const [userDataOptions] = useState({
        responsive: true,
        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 10,
                    max: 100
                }
            }
        },
    })

    return (
        <div>
            <Container maxWidth="lg">

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginTop={"20px"} >
                    <Box>
                        <Typography variant="h6" fontWeight={400}>Current total earnings:</Typography>
                        <Typography variant="h2" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>{FormatPrice(latestEarning.current)}</Typography>
                    </Box>

                    <Button variant="contained" color="primary" sx={{padding: '5px 30px', borderRadius: '7px'}}>Add new earnings</Button>
                </Box>

                <Box marginTop={"20px"}>
                    <LineChart chartData={userData} chartOptions={userDataOptions} />
                </Box>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <p style={{ fontSize: 14, position: 'fixed', bottom: 37}}>{currentUser.current === null ? "" : "Logged in as: " + currentUser.current} </p>
                    <p style={{opacity: 0.3, position: 'fixed', bottom: 10}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
                

            </Container>
        </div>
    );
}
 
export default Dashboard;