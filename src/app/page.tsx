"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Modal } from "./components/Modal";
import { Users, Video, MapPin, AlignLeft, Calendar } from "lucide-react";

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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const test = false;
  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (test) {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/calendar/events`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
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
    }
  }, [test]);

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
      setSelectedDay(dayNumber);
      setIsNewEventModalOpen(true);
      setSelectedEvents(getEventsForDay(dayNumber));
    }
  };

  const handleMoreEventsClick = (dayNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDay(dayNumber);
    setIsSmallModalOpen(true);
    setSelectedEvents(getEventsForDay(dayNumber));
  };

  const getEventsForDay = (dayNumber: number) => {
    // return [] if events is null
    if (events === null || events.length === 0) {
      return [];
    } else {
      return events.filter(
        (event) => new Date(event.start).getDate() === dayNumber
      );
    }
  };

  const getEventSummariesForDay = (dayNumber: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNumber
    );
    // if events is null, return empty array and stop
    if (events === null) {
      return [];
    } else {
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
                onClick={() => isCurrentMonth && handleCellClick(dayNumber)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("clicked");
                          }}
                          // make each event summary in a rounded box
                          className="sm:text-sm text-xs font-light text-white bg-blue-500 rounded-full px-1 text-center sm:w-[20px] xl:w-[190px] sm:py-1 lg:py-0.5"
                        >
                          {summary}
                        </span>
                      ))}
                      {eventSummaries.length > 2 && (
                        <span
                          className="sm:text-sm text-xs font-light text-black hover:bg-gray-300 rounded-full px-1 text-center sm:w-[20px] xl:w-[190px] sm:py-1 lg:py-0.5"
                          onClick={(e) => handleMoreEventsClick(dayNumber, e)}
                        >
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
      <Modal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        title="Add title and time"
        size="large"
      >
        <div className="space-y-6">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
              Event
            </button>
            <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">
              Task
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Add title"
              className="w-full px-3 py-2 text-lg border-b border-gray-200 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex items-center gap-6 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>Tuesday, 3 December</span>
                  <button className="px-4 py-1.5 text-blue-600 rounded-full border hover:bg-gray-50">
                    Add time
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Doesn&apos;t repeat
                </span>
              </div>
            </div>

            <button className="flex items-center gap-4 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Add guests</span>
            </button>

            <button className="flex items-center gap-4 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Video className="w-5 h-5" />
              <span>Add Google Meet video conferencing</span>
            </button>

            <button className="flex items-center gap-4 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5" />
              <span>Add location</span>
            </button>

            <button className="flex items-center gap-4 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <AlignLeft className="w-5 h-5" />
              <span>Add description or attachment</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 mt-6 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                A
              </div>
              <div className="text-sm text-gray-600">
                <div>Abdul Ahad</div>
                <div>Free • Default visibility • Do not notify</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-blue-600 hover:bg-gray-50 rounded-lg">
                More options
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isSmallModalOpen}
        onClose={() => setIsSmallModalOpen(false)}
        title={`${
          selectedDay
            ? new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                selectedDay
              ).toLocaleString("default", {
                month: "short",
                day: "numeric",
              })
            : ""
        }`}
      >
        <div className="mt-4">
          {selectedEvents.map((event, index) => (
            <div key={index} className="mb-2">
              <p className="sm:text-sm text-xs font-light text-white bg-blue-500 rounded-full px-1 text-center sm:w-[20px] xl:w-[190px] sm:py-1 lg:py-0.5 hover:cursor-pointer hover:bg-blue-600">
                {event.summary}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
