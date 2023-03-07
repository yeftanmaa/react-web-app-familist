import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Fab, IconButton, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEditTask from "../../modals/EditTask";
import ModalDeleteTask from "../../modals/DeleteTask";
import AddIcon from '@mui/icons-material/Add';
import ModalAddTask from "../../modals/AddTask";

function App() {
  const tasks = [
    { id: "1", content: "Beli sabun mandi", desc: 'No description', priceEstimation: 5000, status: 'topay' },
    { id: "2", content: "Beli pasta gigi", desc: 'No description', priceEstimation: 12000, status: 'topay' },
    { id: "3", content: "Bayar SPP sekolah", desc: 'Pembayaran SPP sekolah untuk bulan Februari 2023', priceEstimation: 450000 ,status: 'inprogress' },
    { id: "4", content: "Servis HP rusak", desc: 'Layar HP samsung gabisa di sentuh, harus dibawa ke tempat service', priceEstimation: 320000, status: 'done' }
  ];
  
  const taskStatus = {
    toDo: {
      name: "To Pay",
      items: tasks.filter(task => task.status === 'topay')
    },
    inProgress: {
      name: "In Progress",
      items: tasks.filter(task => task.status === 'inprogress')
    },
    done: {
      name: "Done",
      items: tasks.filter(task => task.status === 'done' )
    }
  };
  
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
  
  const [columns, setColumns] = useState(taskStatus);

  // modal handler
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
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

        <Typography variant="h4" style={{ fontWeight: 500 }}>Kanban Board</Typography>
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
                                          <IconButton onClick={handleOpenEditModal}>
                                            <EditIcon color="primary" />
                                          </IconButton>

                                          <IconButton onClick={handleOpenDeleteModal}>
                                            <DeleteIcon color="error" />
                                          </IconButton>
                                        </Box>
                                        
                                        <Typography>{item.content}</Typography>

                                        <Box sx={{maxWidth: '260px', marginTop: 1}}>
                                          <Typography fontStyle={'italic'} sx={{ fontSize: 14, color: '#C9C9C9'}}>{item.desc}</Typography>
                                        </Box>

                                        <Box position={"absolute"} bottom={7} left={15}>
                                          <Typography variant="h6" sx={{color: '#D14E4E', fontWeight: 600, fontSize: '16px'}} >{item.priceEstimation.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
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
          <ModalAddTask open={openAddModal} handleClose={handleCloseAddModal} onCloseClick={handleCloseAddModal} />
        )}

        {openEditModal && (
          <ModalEditTask open={openEditModal} handleClose={handleCloseEditModal} onCloseClick={handleCloseEditModal} />
        )}

        {openDeleteModal && (
          <ModalDeleteTask open={openDeleteModal} handleClose={handleCloseDeleteModal} onCloseClick={handleCloseDeleteModal} />
        )}
      </Container>
    </div>
  );
}

export default App;
