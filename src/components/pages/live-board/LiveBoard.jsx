import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Typography, Avatar, InputLabel, Select, MenuItem, Skeleton } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { GetMemberOnCurrentToken } from "../../utils/firestoreUtils";
import { getNextMonthName } from '../../utils/DateGenerator';

function App() {
  
  // retrieve member list of current workspace
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    const fetchMemberListData = async () => {
      const memberListData = await GetMemberOnCurrentToken('n4th4nSpace');
      setMemberList(memberListData);
    }

    fetchMemberListData();
  }, [])

  // filter by assignee
  const [selectedAssignee, setSelectedAssignee] = useState("");

  const handleFilterAssignee = (e) => {
    setSelectedAssignee(e.target.value);
  };

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentMonth = new Date().toLocaleDateString().substring(0, 1);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          const schedulerCol = collection(db, 'scheduler');
          const schedulerQuery = query(schedulerCol);
          const schedulerSnapshot = await getDocs(schedulerQuery);
          const docs = [];
      
          for (const schedulerDoc of schedulerSnapshot.docs) {
              const paymentsQuery = query(collection(schedulerDoc.ref, 'payments'), orderBy('lastPaid', 'desc'), limit(1));
              const paymentsSnapshot = await getDocs(paymentsQuery);
      
              if (!paymentsSnapshot.empty) {
              const paymentDoc = paymentsSnapshot.docs[0];
              docs.push({ id: schedulerDoc.id, ...schedulerDoc.data(), payment: { id: paymentDoc.id, ...paymentDoc.data() } });
              }
          }
      
          setData(docs);
          setIsLoading(false);
      };

      fetchData();
  }, [])

  useEffect(() => {
    const taskStatus = {
      nextpayment: {
        name: "Next Payment",
        // Display all data to show user incoming payment on next month
        items: data
      },
      notpaid: {
        name: "Not Paid",
        // Display all data on this month that user has not paid yet
        items: data.filter(task => task.payment && task.payment.lastPaid && task.payment.lastPaid.toDate().toLocaleDateString().substring(0, 1) !== currentMonth)
      },
      paid: {
        name: "Paid",
        // Display all data on this month that user has paid
        items: data.filter(task => task.payment && task.payment.lastPaid && task.payment.lastPaid.toDate().toLocaleDateString().substring(0, 1) === currentMonth)
      }
    };

    setColumns(taskStatus);
  }, [data, currentMonth])
  
  const [columns, setColumns] = useState({});

  // Duplicate skeleton
  const skeletonArray = [];
  for (let i = 0; i < 7; i++) {
    skeletonArray.push((<Skeleton variant="rounded" height={200} sx={{marginBottom: '15px'}} />))
  }

  return (
    <div>
      <Container maxWidth="xl">

        <Box sx={{display: "flex", justifyContent: 'space-between', alignItems: 'center', marginTop: '45px'}}>
          <Typography variant="h4" style={{ fontWeight: 500 }}>Kanban Board</Typography>
          
          <Box sx={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <InputLabel id="assignee-label">Filter by Assignee</InputLabel>
            <Select
              labelId="assignee-label"
              id="assignee-select"
              size="small"
              placeholder="All"
              value={selectedAssignee}
              onChange={handleFilterAssignee}
              style={{ minWidth: '200px' }}
            >
              <MenuItem value="">All</MenuItem>
              {memberList.map((member) => (
                <MenuItem value={member.name}>{member.name}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: '100%'
          }}
        >
          <DragDropContext>
            {/* Loop through taskStatus objects and makes 4 droppable columns */}
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    width: 'fit-content',
                  }}
                  key={columnId}
                >
                  <Box sx={{ backgroundColor: '#F4F5F7', marginTop: 3, padding: '20px 10px 0px 20px', borderRadius: '6px 6px 0 0' }}>
                    <Typography variant="h6" fontSize={17} sx={{fontWeight: 500, color: '#848484'}}>{column.name}</Typography>
                  </Box>

                  <div>
                    {/* this part is where each column getting droppable */}
                    <Droppable>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#ECF2F9"
                                : "#F4F5F7",
                              border: snapshot.isDraggingOver ? "2px dashed #4574b1" : "none",
                              padding: '20px',
                              width: '445px',
                              height: 'auto',
                              borderRadius: 6
                            }}
                          >
                          {isLoading ? (
                             skeletonArray
                          ) : (
                            <>
                              {/* we put every cards inside the columns */}
                              {column.items.map((item, index) => {
                                return (
                                  // then we make each cards is draggable
                                  <Draggable>
                                    {(provided, snapshot) => {
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: "none",
                                            padding: 15,
                                            borderRadius: '7px',
                                            margin: "0 0 15px 0",
                                            minHeight: "120px",
                                            backgroundColor: snapshot.isDragging
                                              ? "white"
                                              : "white",
                                            color: "black",
                                            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                                            position: 'relative',
                                            ...provided.draggableProps.style
                                          }}
                                        >
                                          <Box position={"absolute"} top={13} right={11}>
                                            <Box>
                                              {
                                                item.isCicilan ? (
                                                  <Box sx={{backgroundColor: '#aa16db', padding: '3px 10px', borderRadius: '20px'}}>
                                                    <Typography variant="caption" color={"white"}>Cicilan</Typography>
                                                  </Box>
                                                ) : (
                                                  <Box sx={{backgroundColor: 'rgba(36, 79, 255, 0.8)', padding: '3px 10px', borderRadius: '20px'}}>
                                                    <Typography variant="caption" color={"white"}>Tagihan Reguler</Typography>
                                                  </Box>
                                              )}
                                            </Box>
                                          </Box>
                                          
                                          <Typography>{item.title}</Typography>

                                          <Box sx={{maxWidth: '260px', marginTop: 1}}>
                                            <Typography sx={{ fontSize: 13, color: 'black'}}>
                                              {
                                                (columnId === 'nextpayment') ? '' :
                                                (columnId === 'notpaid') ? 'Tenggat waktu: ' + item.deadline.substring(0, 2) + '/' + currentMonth + '/2023' :
                                                (item.isCicilan) ? 'Sisa pembayaran: ' + item.payment?.remainingBill?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                                : ''
                                              }
                                            </Typography>

                                            <Typography fontStyle={'italic'} sx={{ fontSize: 13, color: '#C9C9C9'}}>
                                              {
                                                (columnId === 'nextpayment') ? "Next Payment: " + getNextMonthName() + ' ' + currentYear :
                                                (columnId === 'notpaid') ? 'Terakhir dibayar: ' + item.payment.lastPaid.toDate().toLocaleDateString() :
                                                (columnId === 'paid') ? 'Paid on: ' + item.payment.lastPaid.toDate().toLocaleDateString()
                                                : 'undefined'
                                              }
                                            </Typography>

                                          </Box>

                                          <Box position={"absolute"} bottom={10} left={15}>
                                            <Typography variant="h6" sx={{color: '#c4183b', fontWeight: 600, fontSize: '16px'}} >
                                              {
                                                (item.fixedBill === undefined && columnId !== 'nextpayment') ? item.payment.amountPaid?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) :
                                                (columnId === 'nextpayment' && item.fixedBill === undefined) ? (<Typography color={'grey'}>Not measured</Typography>) :
                                                item.fixedBill?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                              }
                                            </Typography>
                                          </Box>

                                          <Box position={"absolute"} bottom={10} right={10} display={"flex"} alignItems={"center"} gap={1}>
                                            <Avatar sx={{width: 32, height: 32, fontSize: 15}}>T</Avatar>
                                          </Box>
                                          
                                        </div>
                                        
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </>
                          )}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </Container>
    </div>
  );
}

export default App;
