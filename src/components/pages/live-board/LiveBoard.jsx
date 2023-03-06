import { useState } from "react";
import {DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Card(props) {
  const { id, title, desc } = props;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="card">
        <div className="card-content">
          <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 600 }}>{title}</Typography>
          
          <Typography variant="caption" sx={{ fontStyle: "italic", color: "#C9C9C9", lineHeight: "21px" }}>{desc}</Typography>

          <div className="card-action">
            <IconButton>
              <EditIcon color="primary" />
            </IconButton>

            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          </div>

        </div>
      </div>
    </div>
  );
}

function SortableCard(props) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card {...props} />
    </div>
  );
}

function Column(props) {
  const { id, title, cards, droppableId } = props;

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { droppableId },
  });

  const style = {
    background: isOver ? "#eee" : "",
  };

  return (
    <div ref={setNodeRef} className="col" style={style}>
      <Typography variant="h6" sx={{ color: "#848484", marginBottom: "10px", fontSize: "14px" }}>{title}</Typography>

      <SortableContext id={id} items={cards} strategy={verticalListSortingStrategy}>
        {cards.map((card, index) => (
          <SortableCard key={card.id} {...card} index={index} />
        ))}
      </SortableContext>
    </div>
  );
}

function LiveBoard() {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Task 1",
      desc: "Description for task 1",
      status: "todo",
    },
    {
      id: 2,
      title: "Task 2",
      desc: "Description for task 2",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Task 3",
      desc: "Description for task 3",
      status: "done",
    },
    {
      id: 4,
      title: "Task 4",
      desc: "Description for task 4",
      status: "in-progress",
    },
  ]);

  const getCardsByStatus = (status) =>
    cards.filter((card) => card.status === status);

  const [todoCards, inProgressCards, doneCards] = [
    getCardsByStatus("todo"),
    getCardsByStatus("in-progress"),
    getCardsByStatus("done"),
  ];

  const handleDrop = (event) => {
    const { id: cardId, status: oldStatus } = event.active.data.current;
    const { droppableId: newStatus } = event.over.data.current;

    if (oldStatus === newStatus) return;

    const newCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, status: newStatus };
      }
      return card;
    });

    setCards(newCards);
  };

  return (
    <DndContext onDrop={handleDrop}>
      <div className="row">
        <Column id="todo" title="TO DO" cards={todoCards} droppableId="todo" />
        <Column id="in-progress" title="IN PROGRESS" cards={inProgressCards} droppableId="in-progress" />
        <Column id="done" title="DONE" cards={doneCards} droppableId="done" />
      </div>
    </DndContext>
  );
}

export default LiveBoard;