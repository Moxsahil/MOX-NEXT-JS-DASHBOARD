"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value}`);
    }
  }, [value, router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-dark-text-primary">Event Calendar</h3>
          <p className="text-sm text-dark-text-secondary">Select a date to view events</p>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="calendar-container">
        <Calendar 
          onChange={onChange} 
          value={value}
          className="modern-calendar"
        />
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-dark-border-secondary/50">
        <div className="text-xs text-dark-text-secondary font-medium mb-3">Quick Actions</div>
        <div className="space-y-2">
          <button className="group w-full flex items-center gap-3 text-sm text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-elevated/50 p-3 rounded-xl transition-all duration-200">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span>Add New Event</span>
          </button>
          <button className="group w-full flex items-center gap-3 text-sm text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-elevated/50 p-3 rounded-xl transition-all duration-200">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span>View All Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
