import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Fab, IconButton, Typography, Avatar, InputLabel, Select, MenuItem } from "@mui/material";
import { Box, Container } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEditTask from "../../modals/EditTask";
import ModalDeleteTask from "../../modals/DeleteTask";
import AddIcon from '@mui/icons-material/Add';
import ModalAddTask from "../../modals/AddTask";
import { GetMemberOnCurrentToken, GetPaymentInfo, UpdateCardStatus } from "../../utils/firestoreUtils";

function App() {

  const [taskCard, setTaskCard] = useState([]);
  
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

  useEffect(() => {
    const fetchCardData = async () => {
      const cardData = await GetPaymentInfo();
      setTaskCard(cardData);
    }

    fetchCardData();
  }, [])

  useEffect(() => {
    const taskStatus = {
      topay: {
        name: "To Pay",
        items: taskCard.filter(task => task.status === 'topay' && (selectedAssignee === '' || task.assignee === selectedAssignee))
      },
      inprogress: {
        name: "In Progress",
        items: taskCard.filter(task => task.status === 'inprogress' && (selectedAssignee === '' || task.assignee === selectedAssignee))
      },
      done: {
        name: "Done",
        items: taskCard.filter(task => task.status === 'done' && (selectedAssignee === '' || task.assignee === selectedAssignee))
      }
    };

    setColumns(taskStatus);
  }, [taskCard, selectedAssignee])
  
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      UpdateCardStatus(removed.id, destination.droppableId);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };
  
  const [columns, setColumns] = useState({});
  const [selectDocumentId, setSelectDocumentId] = useState('');
  const [selectTaskTitle, setSelectTaskTitle] = useState('');
  const [selectTaskDesc, setSelectTaskDesc] = useState('');
  const [selectTaskPrice, setSelectTaskPrice] = useState('');
  const [selectTaskAssignee, setSelectTaskAssignee] = useState('');

  // modal handler
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setSelectDocumentId(id);

  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleOpenEditModal = (desc, priceEstimation, title, assignee, id) => {
    setOpenEditModal(true);
    setSelectTaskDesc(desc);
    setSelectTaskPrice(priceEstimation);
    setSelectTaskTitle(title);
    setSelectDocumentId(id);
    setSelectTaskAssignee(assignee);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  
  return (
    <div>
      <Container maxWidth="xl">
        <Box sx={{position: "absolute", bottom: 55, right: 50}}>
          <Fab onClick={handleOpenAddModal} color="primary"> <AddIcon /> </Fab>
        </Box>

        <Box sx={{display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
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
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
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
                    <Droppable droppableId={columnId} key={columnId}>
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
                            {/* we put every cards inside the columns */}
                            {column.items.map((item, index) => {
                              return (
                                // then we make each cards is draggable
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
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
                                        <Box position={"absolute"} top={7} right={7}>
                                          <IconButton onClick={() => handleOpenEditModal(item.desc, item.priceEstimation, item.title, item.assignee, item.id)}>
                                            <EditIcon color="primary" />
                                          </IconButton>

                                          <IconButton onClick={() => handleOpenDeleteModal(item.id)}>
                                            <DeleteIcon color="error" />
                                          </IconButton>
                                        </Box>
                                        
                                        <Typography>{item.title}</Typography>

                                        <Box sx={{maxWidth: '260px', marginTop: 1}}>
                                          <Typography fontStyle={'italic'} sx={{ fontSize: 14, color: '#C9C9C9'}}>{item.desc}</Typography>
                                        </Box>

                                        <Box position={"absolute"} bottom={10} left={15}>
                                          <Typography variant="h6" sx={{color: '#D14E4E', fontWeight: 600, fontSize: '16px'}} >{item.priceEstimation.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
                                        </Box>

                                        <Box position={"absolute"} bottom={10} right={10} display={"flex"} alignItems={"center"} gap={1}>
                                          <Typography variant="h6" sx={{fontWeight: 400, fontSize: '14px'}} >{item.assignee}</Typography>
                                          <Avatar sx={{width: 32, height: 32, fontSize: 15}}>T</Avatar>
                                        </Box>
                                        
                                      </div>
                                      
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
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

        {openAddModal && (
          <ModalAddTask
            open={openAddModal}
            handleClose={handleCloseAddModal}
            onCloseClick={handleCloseAddModal}
          />
        )}

        {openEditModal && (
          <ModalEditTask
            open={openEditModal}
            handleClose={handleCloseEditModal}
            onCloseClick={handleCloseEditModal}
            desc={selectTaskDesc}
            priceEstimation={selectTaskPrice}
            assignee={selectTaskAssignee}
            title={selectTaskTitle}
            id={selectDocumentId}
          />
        )}

        {openDeleteModal && (
          <ModalDeleteTask
            open={openDeleteModal}
            handleClose={handleCloseDeleteModal}
            onCloseClick={handleCloseDeleteModal}
            docID={selectDocumentId}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
