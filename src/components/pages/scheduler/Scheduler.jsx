import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, Link } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalAddScheduler from "../../modals/AddScheduler";
import { getAllSchedulerData } from "../../utils/firestoreUtils";
import ModalDeleteScheduler from "../../modals/DeleteScheduler";
import ModalEditScheduler from "../../modals/EditScheduler";
import ModalSchedulerDetails from "../../modals/SchedulerDetails";

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
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectDocumentId, setSelectDocumentId] = useState('');
    const [selectSchedulerTitle, setSelectSchedulerTitle] = useState('');
    const [selectSchedulerDesc, setSelectSchedulerDesc] = useState('');
    const [selectSchedulerType, setSelectSchedulerType] = useState('');

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleOpenDeleteModal = (id) => {
        setOpenDeleteModal(true);
        setSelectDocumentId(id);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }

    const handleOpenEditModal = (desc, title, type, id) => {
        setOpenEditModal(true);
        setSelectSchedulerDesc(desc);
        setSelectSchedulerTitle(title);
        setSelectSchedulerType(type);
        setSelectDocumentId(id);
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    }

    const handleOpenDetailModal = (desc, title, type) => {
        setOpenDetailModal(true);
        setSelectSchedulerDesc(desc);
        setSelectSchedulerTitle(title);
        setSelectSchedulerType(type);
    }

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
    }

    // Pagination config
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                            {(rowsPerPage > 0
                                ? schedulerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : schedulerData
                            ).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell><Link component="button" sx={{fontWeight: 500, fontSize: 15, textDecoration: 'none', color: '#0047FF'}} onClick={() => {handleOpenDetailModal(item.desc, item.title, item.type, item.id)}}>{item.title}</Link></TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell>{item.type}</TableCell>

                                    <TableCell align="center">
                                        <IconButton onClick={() => handleOpenEditModal(item.desc, item.title, item.type, item.id)} size="large">
                                            <EditIcon color="primary" />
                                        </IconButton>

                                        <IconButton onClick={() => handleOpenDeleteModal(item.id)} size="large">
                                            <DeleteIcon color="cancel" />
                                        </IconButton>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {openDetailModal &&
                                (<ModalSchedulerDetails
                                    open={openDetailModal}
                                    handleClose={handleCloseDetailModal}
                                    onCloseClick={handleCloseDetailModal}
                                    title={selectSchedulerTitle}
                                    desc={selectSchedulerDesc}
                                    type={selectSchedulerType}
                                />
                                )

                            }

                            {openDeleteModal &&
                                (<ModalDeleteScheduler
                                    open={openDeleteModal}
                                    handleClose={handleCloseDeleteModal}
                                    onCloseClick={handleCloseDeleteModal}
                                    docID={selectDocumentId} 
                                />)
                            }

                            {openEditModal &&
                                (<ModalEditScheduler
                                    open={openEditModal}
                                    handleClose={handleCloseEditModal}
                                    onCloseClick={handleCloseEditModal}
                                    title={selectSchedulerTitle}
                                    desc={selectSchedulerDesc}
                                    type={selectSchedulerType}
                                    id={selectDocumentId}
                                />)
                            }

                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={schedulerData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <p style={{opacity: 0.3, position: 'fixed', bottom: 10}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
        </div>
    );
}
 
export default Scheduler;