import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export default function Form({ handleFormChange }: {handleFormChange: any}) {
  const [type, setType] = useState(null);
  const [value, setValue] = useState(1); // Default value for number of questions

  const handleTypeChange = (event: any) => {
    const value = event.target.value;
    setType(value);
    handleFormChange("type", value);
  };

  const handleNumberChange = (event: any) => {
    let newValue = parseInt(event.target.value);
    if (!isNaN(newValue)) {
      if (newValue < 1) {
        newValue = 1;
      } else if (newValue > 10) {
        newValue = 10;
      }
      setValue(newValue);
      handleFormChange("num_q", newValue);
    }
  };

  const handleInputChange = (event: any, field: any) => {
    const value = event.target.value;
    handleFormChange(field, value);
  };

  return (
    <div className="mb-[3vh] w-[80%] flex items-start flex-col gap-y-[3vh]">
      <div className="flex flex-row justify-center items-center gap-x-[10px]">
        <h1 className="font-semibold text-[1.5rem]">Start New</h1>
        <FormControl className="w-[200px]">
          <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type || ""}
            label="Select Type"
            onChange={handleTypeChange}
          >
            <MenuItem value={"resume"}>Resume Screening</MenuItem>
            <MenuItem value={"behavioural"}>Behavioural</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex w-[100%] flex-row justify-between items-center">
        <TextField
          className="w-[300px]"
          id="outlined-basic"
          label="Company name"
          variant="standard"
          onChange={(e) => handleInputChange(e, "company")}
        />
        <div className="">
          <div className="ml-[10px] text-[0.6rem] font-light"># of Questions</div>
          <input
            type="number"
            id="numberInput"
            value={value}
            onChange={handleNumberChange}
            min="1"
            max="10"
            style={{
              padding: "10px",
              margin: "10px",
              fontSize: "16px",
              background: "#EEF3FA",
            }}
          />
        </div>
      </div>
      <div className="w-[100%] flex flex-row justify-center items-start gap-x-[10px]">
        <TextField
          multiline
          minRows={7}
          maxRows={7}
          className="w-[100%]"
          id="description"
          label="Position Description?"
          variant="filled"
          InputProps={{
            style: { backgroundColor: "#EEF3FA" },
          }}
          onChange={(e) => handleInputChange(e, "job_description")}
        />
      </div>
      <div className="w-[100%] flex flex-row justify-center items-start gap-x-[10px]">
        <TextField
          multiline
          minRows={7}
          maxRows={7}
          className="w-[100%]"
          id="resume"
          label="Your Resume"
          variant="filled"
          InputProps={{
            style: { backgroundColor: "#EEF3FA" },
          }}
          onChange={(e) => handleInputChange(e, "resume")}
        />
      </div>
    </div>
  );
}
