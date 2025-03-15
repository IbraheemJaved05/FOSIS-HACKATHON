"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tasks from "./Tasks";

interface Task {
  id: number;
  category: string;
  name: string;
  completed: boolean;
  resource: string;
}

interface InputButtonProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // ✅ Lift state up
}

export default function InputButton({ setTasks }: InputButtonProps) {
  const [inputValue, setInputValue] = useState(""); // User input
  const [loading, setLoading] = useState(false);
  const [tasks, setTasksState] = useState<Task[]>([]);

  // Handle input field change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle button click to "fetch" (mock AI response)
  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      console.log("Input is empty, not submitting.");
      return;
    }

    console.log("Submitting...");
    console.log(inputValue);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text(); // Since it's a streaming response
      console.log("Response:", data);
      
      // Parse the response text into steps
      const steps = data.split('Step').filter(step => step.trim());
      
      // Convert steps into the required task format
      const parsedTasks = steps.map((step, index) => {
        // Extract information using regex
        const nameMatch = step.match(/Name: '([^']+)'/);
        const resourceMatch = step.match(/Resource: '<([^>]+)>'/);
        
        return {
          id: index + 1,
          category: inputValue,
          name: nameMatch ? nameMatch[1] : `Task ${index + 1}`,
          completed: false,
          resource: resourceMatch ? resourceMatch[1] : "https://example.com"
        };
      });

      const mockResponse = {
        tasks: parsedTasks
      };

      setTasksState(mockResponse.tasks);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        width: "100%", 
        maxWidth: "600px", 
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* 🔥 Input Section (Fixed at the Top) */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: "50%", 
          transform: "translateX(-50%)",
          width: "100%", 
          maxWidth: "600px",
          background: "white", 
          padding: "15px", 
          zIndex: 1000, 
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
        }}
      >
        <h2 className="text-lg font-semibold mb-2">What do you want to learn today?</h2>
        <TextField 
          fullWidth 
          label="e.g Learn Python" 
          id="fullWidth" 
          value={inputValue} 
          onChange={handleChange} 
        />
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          style={{ marginTop: 10, width: "100%" }}
        >
          Submit
        </Button>
      </div>

      {/* 🔥 Task List */}
      <div 
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "120px",
          paddingBottom: "20px"
        }}
      >
        {loading && <p>Loading tasks...</p>}
        {tasks.length > 0 && (
          <div 
            style={{ 
              width: "100%", 
              border: "1px solid #ccc", 
              padding: "10px", 
              borderRadius: "8px",
              backgroundColor: "white"
            }}
          >
            <Tasks tasks={tasks} />
          </div>
        )}
      </div>
    </div>
  );
}
