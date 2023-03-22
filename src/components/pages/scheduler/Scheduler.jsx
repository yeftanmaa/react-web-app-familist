import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, Link, Skeleton } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalAddScheduler from "../../modals/AddScheduler";
import ModalDeleteScheduler from "../../modals/DeleteScheduler";
import ModalEditScheduler from "../../modals/EditScheduler";
import ModalSchedulerDetails from "../../modals/DetailScheduler";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import UseFetchPaymentsLastPaid from '../../../hooks/useFetchPaymentsLastPaid';

const Scheduler = () => {

    // calling hooks to retrieve payment last paid
    const [data, isLoading] = UseFetchPaymentsLastPaid();

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    // Scheduler detail's data
    const [selectDocumentId, setSelectDocumentId] = useState('');
    const [selectSchedulerTitle, setSelectSchedulerTitle] = useState('');
    const [selectSchedulerType, setSelectSchedulerType] = useState('');
    const [selectSchedulerLastPaid, setSelectSchedulerLastPaid] = useState('');
    const [selectSchedulerAmountPaid, setSelectSchedulerAmountPaid] = useState('');
    const [selectSchedulerRemainingBill, setSelectSchedulerRemainingBill] = useState('');
    const [selectSchedulerTotalBill, setSelectSchedulerTotalBill] = useState('');
    const [selectSchedulerDeadline, setSelectSchedulerDeadline] = useState('');

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

    const handleOpenEditModal = (title, deadline, type, id) => {
        setOpenEditModal(true);
        setSelectSchedulerTitle(title);
        setSelectSchedulerDeadline(deadline);
        setSelectSchedulerType(type);
        setSelectDocumentId(id);
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    }

    const handleOpenDetailModal = (title, type, lastPaid, amountPaid, remainingBill, totalBill) => {
        setOpenDetailModal(true);
        setSelectSchedulerTitle(title);
        setSelectSchedulerType(type);
        setSelectSchedulerLastPaid(lastPaid);
        setSelectSchedulerAmountPaid(amountPaid);
        setSelectSchedulerRemainingBill(remainingBill);
        setSelectSchedulerTotalBill(totalBill);
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
    };

    // Sorting config
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    }

    const sortedData = data.slice().sort((a, b) => {
        if (sortColumn === 'title') {
            return (sortOrder === 'asc' ? 1 : -1) * (a.title > b.title ? 1 : -1);
        } else if (sortColumn === 'deadline') {
            return (sortOrder === 'asc' ? 1 : -1) * (a.deadline > b.deadline ? 1 : -1);
        } else {
            return 0;
        }
    });

    const sortIcon = (column) => {
        if (sortColumn === column) {
            if (sortOrder === 'asc') {
                return <ArrowUpward fontSize="small" sx={{marginBottom: '5px'}} />;
            } else if (sortOrder === 'desc') {
                return <ArrowDownward fontSize="small" sx={{marginBottom: '5px'}} />
            }
        } else {
            return null;
        }
    }

    // get next month
    const today = new Date();
    const nextMonthWithYear = (today.getMonth() + 2) + '/' + (today.getFullYear());

    return (
        <div>

            <Container>
                <Box display={"flex"} alignItems={"center"} marginTop={"50px"}>
                    <Typography flexGrow={1} variant="h4" fontWeight={500}>Scheduled Payments</Typography>
                    <Button onClick={handleOpenModal} startIcon={<AddIcon />} variant="contained" color="primary" sx={{padding: '5px 15px', borderRadius: '7px'}}>New Schedule</Button>

                    {openModal && <ModalAddScheduler open={openModal} handleClose={handleCloseModal} onCloseClick={handleCloseModal} />}
                </Box>

                {/* Table below */}
                <TableContainer sx={{marginTop: '60px'}}>
                    {isLoading ? (
                        <div>
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                            <Skeleton variant="rounded" height={30} sx={{marginBottom: '10px'}} />
                        </div>
                    ) : (
                            <Table sx={{minWidth: 650}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort('title')} sx={{fontWeight: 600, fontSize: 18, cursor: 'pointer'}}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                Title {sortIcon('title')}
                                            </Box>
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('deadline')} sx={{fontWeight: 600, fontSize: 18,  cursor: 'pointer', display: 'flex', gap: '10px'}}>
                                            Deadline {sortIcon('deadline')}
                                        </TableCell>
                                        <TableCell sx={{fontWeight: 600, fontSize: 18}}>Last Paid</TableCell>
                                        <TableCell sx={{fontWeight: 600, fontSize: 18}}>Next Payment</TableCell>
                                        <TableCell sx={{fontWeight: 600, fontSize: 18}} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : sortedData
                                    ).map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell><Link component="button" sx={{fontWeight: 500, fontSize: 17, textDecoration: 'none', color: '#0047FF'}} onClick={() => {handleOpenDetailModal(item.title, item.type, item.payment.lastPaid.toDate().toLocaleString(), item.fixedBill === undefined ? item.payment.amountPaid : item.fixedBill, item.isCicilan === true ? item.payment.remainingBill : 0, item.isCicilan === true ? item.totalBills : 0)}}>{item.title}</Link></TableCell>
                                            <TableCell sx={{fontSize: 17}}>{item.deadline}</TableCell>
                                            <TableCell sx={{fontSize: 17}}>{item.payment.lastPaid.toDate().toLocaleString()}</TableCell>
                                            <TableCell sx={{fontSize: 17}}>{item.deadline.substring(0, 2) + "/" + nextMonthWithYear}</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleOpenEditModal(item.title, item.deadline, item.type, item.id)} size="large">
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
                                            type={selectSchedulerType}
                                            lastPaid={selectSchedulerLastPaid}
                                            amountPaid={selectSchedulerAmountPaid}
                                            remainingBill={selectSchedulerRemainingBill}
                                            totalBill={selectSchedulerTotalBill}
                                            
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
                                            deadline={selectSchedulerDeadline}
                                            type={selectSchedulerType}
                                            id={selectDocumentId}
                                        />)
                                    }

                                </TableBody>
                            </Table>
                        )}

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Container>
        </div>
    );
}

export default Scheduler;