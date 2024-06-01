import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import GreenStitch from "./assets/navLogo.svg";
import { FaRegCalendarAlt } from "react-icons/fa";

const App = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    inProgress: [],
    completed: [],
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTask = () => {
    if (title.trim()) {
      const newTask = { id: `${Date.now()}`, title, description };
      setTasks((prev) => ({
        ...prev,
        pending: [...prev.pending, newTask],
      }));
      setTitle("");
      setDescription("");
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = tasks[source.droppableId];
    const destList = tasks[destination.droppableId];
    const [movedTask] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    }));
  };

  const handleMove = (task, from, to) => {
    setTasks((prev) => {
      const sourceList = [...prev[from]];
      const destList = [...prev[to]];
      sourceList.splice(sourceList.indexOf(task), 1);
      if (to === "completed") {
        task.completedAt = new Date().toLocaleString();
      }
      destList.push(task);
      return {
        ...prev,
        [from]: sourceList,
        [to]: destList,
      };
    });
  };

  return (
    <div className="w-full h-screen flex bg-[#A18AFF]">
      <div className="w-1/5 h-screen mx-4 rounded-3xl bg-slate-100">
        <div className="header px-4 py-10 h-1/3">
          <div className="image">
            <img src={GreenStitch} alt="" />
          </div>
          <div className="title flex flex-col items-end mx-10 gap-2">
            <div className="tile1 font-bold text-2xl">Do - it</div>
            <div className="tile2 font-light text-3xl">Aniruddh</div>
          </div>
        </div>
        <div className="content px-4 py-5">
          <div className="content1 flex w-full justify-center items-center gap-16">
            <div className="icon text-xl">
              <FaRegCalendarAlt />
            </div>
            <div className="text text-2xl">Today's Task</div>
          </div>
          <div className="content2 flex w-full py-5">
            <div className="w-1/3"></div>
            <div className="tasks w-2/3 flex flex-col gap-4">
              <div className="pending flex items-center gap-5">
                <div className="w-5 h-5 bg-[#CA8BFE] rounded-full"></div>Pending
              </div>
              <div className="inprogress flex items-center gap-5">
                <div className="w-5 h-5 bg-[#FD99AF] rounded-full"></div>
                In Progress
              </div>
              <div className="complete flex items-center gap-5">
                <div className="w-5 h-5 bg-[#355E3B] rounded-full"></div>
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container w-4/5 flex h-screen flex-col items-center px-4 py-10">
        <h1 className="text-3xl mb-2 font-extrabold font-serif ">To-Do List</h1>
        <div className="add-task flex flex-col mb-5 w-1/2 px-10 py-20 gap-5 rounded-3xl text-center bg-[#01204E]">
          <input
            className="px-2 py-2 rounded"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
          <input
            className="px-2 py-2 rounded"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
          />
          <button className="bg-[#28a745] px-2 py-3 rounded" onClick={addTask}>
            Add Task
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex justify-around w-full">
            {["pending", "inProgress", "completed"].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column ${snapshot.isDraggingOver ? "draggingOver" : ""}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px', flexGrow: 1 }}
                  >
                    <h2 className="text-xl">{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                    <ul className="task-list">
                      {tasks[status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task ${snapshot.isDragging ? "dragging" : ""}`}
                              style={{
                                width: '200px',
                                margin: '10px 0',
                                padding: '10px',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                                transition: 'background-color 0.2s ease',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <h3 className="font-bold">{task.title}</h3>
                              {task.description && <p>{task.description}</p>}
                              {status === "pending" && (
                                <button
                                  className="bg-[#CA8BFE] px-2 py-1 mt-2 rounded"
                                  onClick={() => handleMove(task, "pending", "inProgress")}
                                >
                                  Start
                                </button>
                              )}
                              {status === "inProgress" && (
                                <button
                                  className="bg-[#FD99AF] px-2 py-1 mt-2 rounded"
                                  onClick={() => handleMove(task, "inProgress", "completed")}
                                >
                                  Complete
                                </button>
                              )}
                              {status === "completed" && (
                                <span className="timestamp text-sm">
                                  {task.completedAt}
                                  <div className="py-1 bg-[#355E3B] w-1/2 text-white text-center">Completed</div>
                                </span>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
