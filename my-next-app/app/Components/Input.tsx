import { TextField } from "@mui/material";

export default function Input() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">What do you want to learn today?</h2>
      
      <TextField 
        fullWidth 
        label="e.g Learn Python" 
        id="fullWidth" 
      />
    </div>
  );
}
