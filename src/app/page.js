"use client";
import { useState } from "react";
import { Box, Heading, Input, Button } from "@chakra-ui/react";

const initialTasks = {
  todo: [
    { id: "1", text: "Todo-1" },
    { id: "2", text: "Todo-2" },
  ],
  inProgress: [],
  done: [
    { id: "3", text: "Todo-3" },
  ],
};

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [isDragging, setIsDragging] = useState(false); // To track dragging state

  // Handle adding a new task
  const handleAddTask = () => {
    let i=4;
    const newTaskObj = {
      id: i++, 
      text: newTask,
    };
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTaskObj],
    }));
    setNewTask(""); 
  };

  // Handle drag start
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task)); 
    setIsDragging(true); 
  };

  // Handle drop on other columns
  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData("task");
    const task = JSON.parse(taskData);

    const updatedTasks = { ...tasks };
    const sourceList = Object.keys(updatedTasks).find((key) =>
      updatedTasks[key].some((t) => t.id === task.id)
    );

    updatedTasks[sourceList] = updatedTasks[sourceList].filter((t) => t.id !== task.id);
    updatedTasks[status].push(task);
    setTasks(updatedTasks);
    setIsDragging(false);
  };

  // Handle drop on the delete box
  const handleDeleteDrop = (e) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData("task");
    const task = JSON.parse(taskData);

    // Remove the task from its original list
    const updatedTasks = { ...tasks };
    const sourceList = Object.keys(updatedTasks).find((key) =>
      updatedTasks[key].some((t) => t.id === task.id)
    );

    updatedTasks[sourceList] = updatedTasks[sourceList].filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    setIsDragging(false); // Hide delete box
  };

  // Handle drag over
  const AllowDrag = (e) => {
    e.preventDefault(); 
  };

  return (
      <Box textAlign="center" p={6}>
        <Heading mb={6}>Todo List</Heading>

        {/* Input for Adding New Task */}
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          mb={4}
        />
        <Button colorScheme="teal" onClick={handleAddTask} mb={6}>
          Add Task
        </Button>

        <Box display="flex" justifyContent="space-between" mb={4}>
          {/* Todo Column */}
          <Box
            p={4}
            bg="gray.200"
            borderRadius="md"
            boxShadow="md"
            w="30%"
            h="400px"
            onDrop={(e) => handleDrop(e, "todo")}
            onDragOver={AllowDrag}
          >
            <Heading size="md" className="bg-white">Todo</Heading>
            {tasks.todo.map((task) => (
              <Box
                key={task.id}
                p={4}
                bg="purple"
                borderRadius="md"
                boxShadow="md"
                color={"White"}
                m={2}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.text}
              </Box>
            ))}
          </Box>

          {/* In Progress Column */}
          <Box
            p={4}
            bg="gray.200"
            borderRadius="md"
            boxShadow="md"
            w="30%"
            h="400px"
            onDrop={(e) => handleDrop(e, "inProgress")}
            onDragOver={AllowDrag}
          >
            <Heading size="md" className="bg-white">In Progress</Heading>
            {tasks.inProgress.map((task) => (
              <Box
                key={task.id}
                p={4}
                bg="Yellow"
                borderRadius="md"
                color={"Black"}
                boxShadow="md"
                m={2}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.text}
              </Box>
            ))}
          </Box>

          {/* Done Column */}
          <Box
            p={4}
            bg="gray.200"
            borderRadius="md"
            boxShadow="md"
            w="30%"
            h="400px"
            onDrop={(e) => handleDrop(e, "done")}
            onDragOver={AllowDrag}
          >
            <Heading size="md" className="bg-white">Done</Heading>
            {tasks.done.map((task) => (
              <Box
                key={task.id}
                p={4}
                bg="Red"
                borderRadius="md"
                color={"White"}
                boxShadow="md"
                m={2}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.text}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Dynamic Delete Box at the Bottom */}
        {isDragging && (
          <Box
            p={4}
            bg="red.400"
            borderRadius="md"
            boxShadow="md"
            w="30%"
            h="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onDrop={handleDeleteDrop}
            onDragOver={AllowDrag}
            mx="auto" // Center the delete box
          >
            <Heading size="md" color="white">Drop here to delete</Heading>
          </Box>
        )}
      </Box>
  );
}
