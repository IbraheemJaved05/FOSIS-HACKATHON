"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

interface Task {
  id: number;
  category: string;
  name: string;
  completed: boolean;
  resource: string;
}

interface TasksProps {
  tasks: Task[];
}

export default function Tasks({ tasks }: TasksProps) {
  const [checkedTasks, setCheckedTasks] = useState<Task[]>([]);

  // Initialize checkbox state when tasks change
  useEffect(() => {
    console.log("Tasks received:", tasks); // ✅ Debugging: Ensure tasks are received
    setCheckedTasks(tasks);
  }, [tasks]);

  // Handle checkbox change
  const handleTaskChange = (taskId: number) => {
    // setCheckedTasks((prev) => ({
    //   ...prev,
    //   [taskId]: !prev[taskId],
    // }));
  };

  return (
    <Box
      sx={{
        display: tasks.length > 0 ? "flex" : "none",
        flexDirection: "column",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        width: "100%",
        marginTop: "120px",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>Your Learning Tasks</Typography>
      <Divider sx={{ mb: 1 }} />

      {checkedTasks.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>No tasks available.</Typography>
      ) : (
        checkedTasks.map((task) => (
          <Box key={task.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <FormControlLabel label={`${task.category}: ${task.name}`} control={<Checkbox checked={task.completed} onChange={() => handleTaskChange(task.id)} />} />
            <Link href={task.resource} target="_blank" rel="noopener" sx={{ ml: 1 }}>(Resource)</Link>
          </Box>
        ))
      )}
    </Box>
  );
}
