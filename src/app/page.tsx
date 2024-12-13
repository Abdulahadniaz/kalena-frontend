"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((firstDay + daysInMonth) / 7);
  return { firstDay, daysInMonth, weeks };
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function GridPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const { firstDay, daysInMonth, weeks } = getMonthData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handleCellClick = (dayNumber: number) => {
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );
      console.log("Clicked date:", clickedDate.toDateString());
      console.log("Day of week:", daysOfWeek[clickedDate.getDay()]);
      console.log(
        "Is weekend:",
        clickedDate.getDay() === 0 || clickedDate.getDay() === 6
      );
    }
  };

  const isToday = (dayNumber: number) => {
    const today = new Date();
    return (
      today.getDate() === dayNumber &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center p-4 h-4 mt-2 ">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4 sm:p-6 lg:p-4">
        <div className="grid grid-cols-7 gap-2 h-full">
          {/* Day headings */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className={`text-center font-semibold text-gray-700 pb-2`}
            >
              {day}
            </div>
          ))}

          {/* Grid cells */}
          {Array.from({ length: weeks * 7 }).map((_, index) => {
            const dayNumber = index - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const isWeekend = index % 7 === 0 || index % 7 === 6;
            const isTodayDate = isToday(dayNumber);
            return (
              <div
                key={index}
                className={`rounded-lg shadow-md flex items-center justify-center p-4 aspect-[12/6]
                ${isWeekend ? "bg-gray-200" : "bg-white"}
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${Math.floor(index / 7) === weeks - 1 ? "border-b-0" : ""}`}
                onClick={() => handleCellClick(index)}
              >
                <span
                  className={`text-gray-600 font-light ${
                    isCurrentMonth ? "" : "opacity-30"
                  } ${
                    isTodayDate
                      ? "bg-blue-500 text-white px-2 py-1 rounded-full"
                      : ""
                  }`}
                >
                  {isCurrentMonth ? dayNumber : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// <div className="max-w-2xl mx-auto">
//   <h2 className="text-3xl font-bold font-serif mb-6 flex items-center">
//     <CalendarIcon className="w-8 h-8 mr-2 text-blue-600" />
//     Your Calendar
//   </h2>
//   <div className="bg-white shadow-lg rounded-lg overflow-hidden flex gap-4 p-2">
//     <Calendar
//       onChange={(value) => onDateChange(value)}
//       value={date}
//       className="border-none p-4"
//     />
//     <p className=" text-gray-600">
//       Selected date:{" "}
//       {`${
//         // convert Value to Date String
//         date ? new Date(Date.parse(date?.toString())).toDateString() : ""
//       }`}
//     </p>
//   </div>
// </div>
