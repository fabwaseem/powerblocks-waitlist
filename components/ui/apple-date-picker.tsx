import React, { useState, useEffect } from "react";
import Wheel from "./wheel";

interface AppleDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getYears = (minYear: number, maxYear: number): number[] => {
  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }
  return years;
};

export default function AppleDatePicker({
  value = new Date(),
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
}: AppleDatePickerProps) {
  const [selectedMonth, setSelectedMonth] = useState(value.getMonth());
  const [selectedDay, setSelectedDay] = useState(value.getDate());
  const [selectedYear, setSelectedYear] = useState(value.getFullYear());

  const years = getYears(minYear, maxYear);
  const currentYearIndex = years.findIndex((year) => year === selectedYear);
  const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);

  // Remove the useEffect that was causing conflicts - we handle day adjustment in the change handlers now

  const handleMonthChange = (relative: number, absolute: number) => {
    let newMonth;
    if (absolute >= 0) {
      newMonth = absolute % 12;
    } else {
      newMonth = 12 + (absolute % 12);
      if (newMonth >= 12) {
        newMonth = newMonth - 12;
      }
    }

    // Calculate the new day to ensure it's valid for the new month
    const newDaysInMonth = getDaysInMonth(newMonth, selectedYear);
    const adjustedDay = Math.min(selectedDay, newDaysInMonth);

    // Update both states
    setSelectedMonth(newMonth);
    setSelectedDay(adjustedDay);

    const newDate = new Date(selectedYear, newMonth, adjustedDay);
    onChange?.(newDate);
  };

  const handleDayChange = (relative: number, absolute: number) => {
    let newDay;
    if (absolute >= 0) {
      newDay = (absolute % daysInSelectedMonth) + 1;
    } else {
      newDay = daysInSelectedMonth + (absolute % daysInSelectedMonth) + 1;
      if (newDay > daysInSelectedMonth) {
        newDay = newDay - daysInSelectedMonth;
      }
    }
    setSelectedDay(newDay);
    const newDate = new Date(selectedYear, selectedMonth, newDay);
    onChange?.(newDate);
  };

  const handleYearChange = (relative: number, absolute: number) => {
    let yearIndex;
    if (absolute >= 0) {
      yearIndex = absolute % years.length;
    } else {
      yearIndex = years.length + (absolute % years.length);
      if (yearIndex >= years.length) {
        yearIndex = yearIndex - years.length;
      }
    }
    const newYear = years[yearIndex];

    // Calculate the new day to ensure it's valid for the new year (leap year handling)
    const newDaysInMonth = getDaysInMonth(selectedMonth, newYear);
    const adjustedDay = Math.min(selectedDay, newDaysInMonth);

    // Update both states
    setSelectedYear(newYear);
    setSelectedDay(adjustedDay);

    const newDate = new Date(newYear, selectedMonth, adjustedDay);
    onChange?.(newDate);
  };

  const formatMonth = (relative: number, absolute: number) => {
    // Handle proper looping for months
    let monthIndex;
    if (absolute >= 0) {
      monthIndex = absolute % 12;
    } else {
      // When going backwards, show months in reverse order
      monthIndex = 12 + (absolute % 12);
      if (monthIndex >= 12) {
        monthIndex = monthIndex - 12;
      }
    }
    return MONTHS[monthIndex];
  };

  const formatDay = (relative: number, absolute: number) => {
    // Handle proper looping for days
    if (daysInSelectedMonth <= 0) return "1";

    let dayValue;
    if (absolute >= 0) {
      dayValue = (absolute % daysInSelectedMonth) + 1;
    } else {
      // When going backwards, show days in reverse order
      dayValue = daysInSelectedMonth + (absolute % daysInSelectedMonth) + 1;
      if (dayValue > daysInSelectedMonth) {
        dayValue = dayValue - daysInSelectedMonth;
      }
    }
    return dayValue.toString();
  };

  const formatYear = (relative: number, absolute: number) => {
    // Handle proper looping for years
    let yearIndex;
    if (absolute >= 0) {
      yearIndex = absolute % years.length;
    } else {
      // When going backwards, show years in reverse order
      yearIndex = years.length + (absolute % years.length);
      if (yearIndex >= years.length) {
        yearIndex = yearIndex - years.length;
      }
    }
    return years[yearIndex].toString();
  };

  return (
    <div className="apple-date-picker">
      <div className="apple-date-picker__container">
        {/* Month Wheel */}
        <div className="apple-date-picker__wheel-container">
          <Wheel
            initIdx={selectedMonth}
            length={12}
            width={100}
            perspective="right"
            setValue={formatMonth}
            onChange={handleMonthChange}
            loop
          />
        </div>

        {/* Day Wheel */}
        <div className="apple-date-picker__wheel-container">
          <Wheel
            key={`day-${selectedMonth}-${selectedYear}`}
            initIdx={Math.min(selectedDay - 1, daysInSelectedMonth - 1)}
            length={daysInSelectedMonth}
            width={60}
            setValue={formatDay}
            onChange={handleDayChange}
            loop
          />
        </div>

        {/* Year Wheel */}
        <div className="apple-date-picker__wheel-container">
          <Wheel
            initIdx={currentYearIndex}
            length={years.length}
            width={80}
            perspective="left"
            setValue={formatYear}
            onChange={handleYearChange}
            loop
          />
        </div>
      </div>
    </div>
  );
}
