import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalAddScheduler from "../../modals/AddScheduler";
import { getAllSchedulerData } from "../../utils/firestoreUtils";

const Scheduler = () => {

    const [schedulerData, setSchedulerData] = useState([]);

    useEffect(() => {
        const fetchSchedulerData = async () => {
            const schedulerData = await getAllSchedulerData();
            setSchedulerData(schedulerData);
        }

        fetchSchedulerData();
    }, [])

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    return (
        <div>
            <Container>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginTop={"20px"}>
                    <Typography variant="h4" fontWeight={500}>Scheduled Payments</Typography>
                    <Button onClick={handleOpenModal} startIcon={<AddIcon />} variant="contained" color="primary" sx={{padding: '5px 15px', borderRadius: '7px'}}>New Schedule</Button>

                    {openModal && <ModalAddScheduler open={openModal} handleClose={handleCloseModal} onCloseClick={handleCloseModal} />}
                </Box>

                {/* Table below */}
                <TableContainer sx={{marginTop: '30px'}}>
                    <Table sx={{minWidth: 650}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 600, fontSize: 15}} >Title</TableCell>
                                <TableCell sx={{fontWeight: 600, fontSize: 15}}>Type</TableCell>
                                <TableCell sx={{fontWeight: 600, fontSize: 15}}>Action</TableCell>
                                <TableCell sx={{fontWeight: 600, fontSize: 15}} align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {schedulerData.length > 0 ? (
                                schedulerData.map((item) => (
                                <TableRow key={item.title}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell align="center">
                                    <IconButton size="large">
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton size="large">
                                        <DeleteIcon color="cancel" />
                                    </IconButton>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No data found.
                                </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}
 
export default Scheduler;