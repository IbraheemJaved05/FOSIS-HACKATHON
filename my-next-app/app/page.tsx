"use client";

import React, { useState } from "react";
import InputButton from "./Components/InputButton";
import Tasks from "./Components/Tasks"; // Ensure correct path

interface Task {
  id: number;
  category: string;
  name: string;
  completed: boolean;
  resource: string;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]); // ✅ Global tasks state

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "0 auto" }}>
      {/* ✅ Pass setTasks so InputButton can update it */}
      <InputButton setTasks={setTasks} />
      
      {/* ✅ Ensure Tasks receive the updated state */}
      {tasks.length > 0 && (
        <div style={{ marginTop: "120px", width: "100%" }}>
          <Tasks tasks={tasks} />
        </div>
      )}
    </div>
  );
}
