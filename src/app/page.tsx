"use client";

import { useEffect, useState } from "react";
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

type Event = {
  id: string;
  title: string;
  date: string;
};

export default function GridPage() {
  const [today, setToday] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/calendar/upcoming-events`
        );
        const data = await response.json();
        console.log(data);
        setEvents(data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

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
      <div className="flex justify-between items-center p-4 h-4 mt-2 ">
        <div>
          <p className="text-black">
            Today:{" "}
            {
              <span className="italic text-gray-500 ">
                {today.toDateString()}
              </span>
            }
            {!loading && (
              <span className="italic text-gray-500 ">
                {" - "}Number of upcoming events: {events.length}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center justify-between ">
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
                className={`rounded-lg shadow-md flex flex-col items-center justify-start p-2 aspect-[12/6] overflow-hidden
                ${isWeekend ? "bg-gray-200" : "bg-white"}
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${Math.floor(index / 7) === weeks - 1 ? "border-b-0" : ""}`}
                onClick={() => handleCellClick(dayNumber)}
              >
                <span
                  className={`text-gray-600 font-light mb-1 ${
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
