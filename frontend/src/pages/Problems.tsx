import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Shuffle, Flame, List,
  Workflow,
  Database,
  Terminal,
  Cpu,
  Code2,
  Table, } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProblems } from '../api/api';
import ProblemTable from '../components/ProblemTable';
import PageWrapper from '../components/PageWrapper';
import SkeletonLoader from '../components/SkeletonLoader';
import type { Problem } from '../types/problems';

/* ================= TYPES ================= */

type ProblemsResponse = {
  problems: Problem[];
  count: number;
};

/* ================= CONSTANTS ================= */

const TAGS = [
  'Arrays', 'String', 'Hash Table', 'Math',
  'Dynamic Programming', 'Sorting', 'Greedy',
  'Depth-First Search', 'Binary Search',
];
const TOPICS = [
  { label: 'All Topics', icon: List },
  { label: 'Algorithms', icon: Workflow },
  { label: 'Database', icon: Database },
  { label: 'Shell', icon: Terminal },
  { label: 'Concurrency', icon: Cpu },
  { label: 'JavaScript', icon: Code2 },
  { label: 'pandas', icon: Table },
];

const DIFFICULTIES: Array<'All' | 'Easy' | 'Medium' | 'Hard'> = ['All', 'Easy', 'Medium', 'Hard'];

/* ================= STREAK CALENDAR ================= */

const MOCK_ACTIVE_DAYS = new Set([1, 3, 4, 8, 9, 10, 15, 20, 21, 22, 23, 30, 31, 45, 60, 61, 62, 80, 90, 91]);

const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000) - 1;
}

function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

const StreakCalendar: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const weeks = buildMonthGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isActiveDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    return MOCK_ACTIVE_DAYS.has(getDayOfYear(date));
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  // Weekly progress: W1–W5 of current month
  const currentWeekIdx = Math.floor((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay() - 1) / 7);

  // Seconds left today
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const now = new Date();
    return (23 - now.getHours()) * 3600 + (59 - now.getMinutes()) * 60 + (59 - now.getSeconds());
  });

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => (s > 0 ? s - 1 : 86399)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  // Calculate streak
  let streak = 0;
  for (let d = getDayOfYear(today); d >= 0; d--) {
    if (MOCK_ACTIVE_DAYS.has(d)) streak++;
    else break;
  }

  const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5'];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 w-full select-none">

      {/* Day + timer header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-bold text-gray-800">Day {today.getDate()}</span>
          <span className="text-xs text-gray-400 ml-2">{hh}:{mm}:{ss} left</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 text-sm px-1">‹</button>
          <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 text-sm px-1">›</button>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-gray-400 font-medium py-0.5">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              if (!day) return <div key={di} />;
              const active = isActiveDay(day);
              const todayCell = isToday(day);
              return (
                <div
                  key={di}
                  className="flex items-center justify-center"
                >
                  <div
                    className={`
                      w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all
                      ${todayCell
                        ? 'bg-orange-500 text-white font-bold'
                        : active
                          ? 'bg-orange-100 text-orange-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-3" />

      {/* Weekly Premium row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-orange-500">Weekly Challenge</span>
        </div>
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="h-3 w-3" />
          <span className="text-xs font-bold text-orange-500">{streak}d streak</span>
        </div>
      </div>

      {/* W1–W5 pills */}
      {/* <div className="flex items-center gap-1.5">
        {weekLabels.map((label, idx) => {
          const isCurrentWeek = idx === currentWeekIdx && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const isPast = idx < currentWeekIdx && viewMonth === today.getMonth() && viewYear === today.getFullYear();

          // Check if any day in this week was active
          const weekStart = idx * 7 + 1 - new Date(viewYear, viewMonth, 1).getDay();
          const hasActivity = Array.from({ length: 7 }, (_, i) => weekStart + i)
            .some(d => d >= 1 && d <= new Date(viewYear, viewMonth + 1, 0).getDate() && isActiveDay(d));

          return (
            <div
              key={label}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all
                ${isCurrentWeek && hasActivity
                  ? 'bg-orange-500 text-white'
                  : isCurrentWeek
                    ? 'border-2 border-orange-400 text-orange-500'
                    : isPast && hasActivity
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-300 font-medium'}
              `}
            >
              {label}
            </div>
          );
        })}
      </div> */}

    </div>
  );
};

/* ================= COMPONENT ================= */

const Problems: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [activeTopic, setActiveTopic] = useState<string>('All Topics');

  const { data, isLoading, error } = useQuery<ProblemsResponse>({
    queryKey: ['problems', { difficulty: activeDifficulty, tag: activeTag, search: searchTerm }],
    queryFn: () =>
      getProblems({
        difficulty: activeDifficulty !== 'All' ? activeDifficulty.toLowerCase() : undefined,
        tag: activeTag ? activeTag.toLowerCase() : undefined,
        search: searchTerm || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const problems = data?.problems ?? [];
  const totalProblems = data?.count ?? 0;

  const solvedProblems = 0;
  const circumference = 2 * Math.PI * 9;
  const progressPercent = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
        <div className="flex py-6 gap-4 items-start mx-auto ">
            <div className='w-[70vw]'>
            {/* TAGS */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-3">
                {TAGS.map((tag) => (
                <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-full text-xs border flex-shrink-0 transition-all ${
                    activeTag === tag
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-orange-400 hover:text-orange-500'
                    }`}
                >
                    {tag}
                </button>
                ))}
            </div>

            {/* TOPICS */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
                {TOPICS.map((t) => {
    const Icon = t.icon;

    return (
                <button
                    key={t.label}
                    onClick={() => setActiveTopic(t.label)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border flex-shrink-0 transition-all ${
                    activeTopic === t.label
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                >
            

    <Icon className="w-4 h-4" />
                    {t.label}
                </button>
            );
    })}
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all w-56"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-1">
                    {DIFFICULTIES.map(d => (
                    <button
                        key={d}
                        onClick={() => setActiveDifficulty(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        activeDifficulty === d
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        {d}
                    </button>
                    ))}
                </div>

                <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg">
                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </button>
                </div>

                <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
                    <circle cx="11" cy="11" r="9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                    <circle
                        cx="11" cy="11" r="9" fill="none" stroke="#f97316"
                        strokeWidth="2.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                    </svg>
                    <span>{totalProblems} Problems</span>
                </div>

                <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg">
                    <Shuffle className="h-4 w-4 text-gray-500" />
                </button>
                </div>
            </div>

            {/* MAIN CONTENT — two column layout: table + sidebar */}
            

                {/* TABLE */}
                <div className="flex-1 min-w-0">
                {isLoading ? (
                    <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <SkeletonLoader key={i} type="tableRow" className="rounded-lg" />
                    ))}
                    </div>
                ) : error ? (
                    <div className="flex-grow flex items-center justify-center p-8 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-red-500 font-medium">
                        {(error as Error).message || 'Error loading problems'}
                    </p>
                    </div>
                ) : (
                    <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    <ProblemTable problems={problems} />
                    </motion.div>
                )}
                </div>
            </div>
            {/* SIDEBAR — streak calendar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
            <StreakCalendar />
            </div>

        </div>
  );
};

export default Problems;