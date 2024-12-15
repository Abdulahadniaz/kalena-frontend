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
  summary: string;
  start: string;
  end: string;
};

export default function GridPage() {
  const [today, setToday] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/calendar/events`
        );
        const data = await response.json();
        console.log(data);
        setEvents(data);
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

  const getEventSummariesForDay = (dayNumber: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNumber
    );
    // if events is null, return null
    if (events === null) {
      return [];
    }
    const eventSummaries = events
      .filter((event) => {
        const eventStartDate = new Date(event.start);
        return (
          eventStartDate.getDate() === clickedDate.getDate() &&
          eventStartDate.getMonth() === clickedDate.getMonth() &&
          eventStartDate.getFullYear() === clickedDate.getFullYear()
        );
      })
      .map((event) => event.summary);

    return eventSummaries.length > 0 && eventSummaries;
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
    <div className="flex flex-col min-h-screen p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <div className="mb-2 sm:mb-0">
          <p className="text-sm sm:text-base text-black">
            Today:{" "}
            <span className="italic text-gray-500">
              {today.toDateString()}
              {events !== null &&
                events.length > 0 &&
                " - " + events.length + " events upcoming"}
              {events === null && " - No events found"}
            </span>
          </p>
        </div>
        <div className="flex items-center justify-between space-x-2 sm:space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      <div className="flex-grow">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 h-full">
          {/* Day headings */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 pb-1 sm:pb-2 text-xs sm:text-sm"
            >
              {day.slice(0, 3)}
            </div>
          ))}

          {/* Grid cells */}
          {Array.from({ length: weeks * 7 }).map((_, index) => {
            const dayNumber = index - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const isWeekend = index % 7 === 0 || index % 7 === 6;
            const isTodayDate = isToday(dayNumber);
            const eventSummaries = getEventSummariesForDay(dayNumber); // Get all event summaries for the day

            return (
              <div
                key={index}
                className={`rounded-lg shadow-sm flex flex-col items-center justify-start p-1 sm:p-2 sm:aspect-square xl:aspect-[16/10] overflow-hidden
                ${isWeekend ? "bg-gray-200" : "bg-white"}
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${Math.floor(index / 7) === weeks - 1 ? "border-b-0" : ""}
                ${isCurrentMonth ? "cursor-pointer " : ""}`}
                onClick={() => handleCellClick(dayNumber)}
              >
                <span
                  className={`text-xs sm:text-sm font-light mb-1 
                  ${isCurrentMonth ? "" : "opacity-30"}
                  ${
                    isTodayDate
                      ? "bg-blue-800 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full"
                      : ""
                  }`}
                >
                  {isCurrentMonth ? dayNumber : ""}
                </span>
                <div className="flex flex-col items-center justify-center space-y-1 ">
                  {eventSummaries && eventSummaries.length > 0 && (
                    <>
                      {eventSummaries.slice(0, 2).map((summary, idx) => (
                        <span
                          key={idx}
                          // make each event summary in a rounded box
                          className="sm:text-sm text-xs font-light text-white bg-blue-500 rounded-full px-1 text-center sm:w-[20px] xl:w-[190px] sm:py-1 lg:py-0.5"
                        >
                          {summary}
                        </span>
                      ))}
                      {eventSummaries.length > 2 && (
                        <span className="sm:text-sm text-xs font-light text-black hover:bg-gray-300 rounded-full px-1 text-center sm:w-[20px] xl:w-[190px] sm:py-1 lg:py-0.5">
                          {eventSummaries.length - 2} more events
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
