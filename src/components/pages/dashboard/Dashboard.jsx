import { Button, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import LineChart from "../../utils/LineChart";

const Dashboard = () => {
    return (
        <div>
            <Container maxWidth="xl">

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Box>
                        <Typography variant="h6" fontWeight={400}>Current total earnings:</Typography>
                        <Typography variant="h2" fontWeight={600} fontStyle={"normal"} color={"#1E8CF1"}>Rp. 967,000</Typography>
                    </Box>

                    <Button variant="contained" color="primary" sx={{padding: '5px 40px', borderRadius: '7px'}}>Add new earnings</Button>
                </Box>

                <Box width={"70%"} marginLeft="auto" marginRight="auto" marginTop={15}>
                    <LineChart />
                </Box>
                
            </Container>
        </div>
    );
}
 
export default Dashboard;