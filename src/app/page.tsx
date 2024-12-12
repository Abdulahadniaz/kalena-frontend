"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Value } from "react-calendar/src/shared/types.js";

export default function Home() {
  const [date, setDate] = useState<Value>(new Date());

  const onDateChange = (date: Value) => {
    setDate(date);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold font-serif mb-6 flex items-center">
        <CalendarIcon className="w-8 h-8 mr-2 text-blue-600" />
        Your Calendar
      </h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex gap-4 p-2">
        <Calendar
          onChange={(value) => onDateChange(value)}
          value={date}
          className="border-none p-4"
        />
        <p className=" text-gray-600">
          Selected date:{" "}
          {`${
            // convert Value to Date String
            date ? new Date(Date.parse(date?.toString())).toDateString() : ""
          }`}
        </p>
      </div>
    </div>
  );
}
