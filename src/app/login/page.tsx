"use client";
import { GoogleIcon } from "./GoogleIcon";
import { OutlookIcon } from "./OutlookIcon";

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold font-serif mb-6 text-center">
          Link one or more calendars here
        </h2>
        <div className="space-y-2">
          <button
            className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
            onClick={async () => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/calendar/auth`
                );
                const data = await response.json();
                if (data.authUrl) {
                  window.location.href = data.authUrl;
                } else {
                  console.error("No authorization URL received");
                }
              } catch (error) {
                console.error("Failed to initiate OAuth flow:", error);
              }
            }}
          >
            <GoogleIcon className="w-6 h-6 mr-2" />
            Link Google Calendar
          </button>
          <button
            className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
            onClick={() => {
              /* Implement Outllok OAuth logic here */
            }}
          >
            <OutlookIcon className="w-6 h-6 mr-2" />
            Link Outlook Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
