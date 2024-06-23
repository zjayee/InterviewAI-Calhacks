"use client";
import Link from "next/link";
import Logo from "./components/Logo";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  return (
    <main className="main-container">
      <Logo />
      <div className="flex flex-row w-[100%] items-center">
        <section className="mt-[6vh] w-[50%] items-center justify-center">
          <Camera />
        </section>
        <section className="w-[50%] h-[100%] flex flex-col items-center justify-between">
          <Form />
          <JoinButton />
        </section>
      </div>
    </main>
  );

  function Form() {
    const [type, setType] = useState(null);
    const handleTypeChange = (event: any) => {
      setType(event.target.value);
    };

    const [value, setValue] = useState(0);

    const handleNumberChange = (event: any) => {
      let newValue = parseInt(event.target.value);
      if (!isNaN(newValue)) {
        if (newValue < 0) {
          newValue = 0;
        } else if (newValue > 10) {
          newValue = 10;
        }
        setValue(newValue);
      }
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
              value={type}
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
          />
          <div className="">
            <div className="ml-[10px] text-[0.6rem] font-light">
              # of Questions
            </div>
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
          />
        </div>
      </div>
    );
  }
}

function Camera() {
  return (
    <div className="rounded-[30px] bg-red-300 h-[48vh] aspect-[765/501]"></div>
  );
}

function JoinButton() {
  return (
    <Link
      className="flex justify-center items-center font-medium w-[120px] h-[50px] bg-[#6E87ED] text-white rounded-[50px]"
      href="/interview-room"
    >
      Join Now
    </Link>
  );
}
