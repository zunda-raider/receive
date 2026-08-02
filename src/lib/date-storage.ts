import type { CalendarEvent, DatePlan } from "@/lib/mock-data";

export const REFERENCE_DATE = "2026-08-02";
export const CUSTOM_EVENTS_KEY = "aime:custom-date-events:v1";
export const DATE_DATA_CHANGED_EVENT = "aime:date-data-changed";

export type StoredDateEvent = CalendarEvent & { id?: string };

export type DateReviewAnswers = {
  overallFeeling: string;
  meetAgain: string;
  partnerReactions: string[];
  goodThings: string[];
  goodThingsNote: string;
  improvements: string[];
  improvementsNote: string;
  learnedAboutPartner: string;
  nextTopics: string[];
  nextTopicsNote: string;
  nextAction: string;
};

export type SavedDateReview = {
  version: 1;
  answers: DateReviewAnswers;
  savedAt: string;
  completed: true;
};

export const getCustomEventId = (event: Pick<CalendarEvent, "date" | "time">) =>
  `custom-date-${event.date}-${event.time.replace(":", "")}`;

export const getEventId = (event: StoredDateEvent, plans: DatePlan[]) =>
  event.id ?? plans.find((plan) => plan.date === event.date && plan.time === event.time)?.id ?? getCustomEventId(event);

export const getReviewKey = (dateId: string) => `aime:date-review:v1:${dateId}`;

export const isReviewSaved = (dateId: string) => {
  try {
    const raw = window.localStorage.getItem(getReviewKey(dateId));
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<SavedDateReview>;
    return parsed.completed === true;
  } catch {
    return false;
  }
};

export const readCustomEvents = (): StoredDateEvent[] => {
  try {
    const raw = window.localStorage.getItem(CUSTOM_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredDateEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(CUSTOM_EVENTS_KEY);
    return [];
  }
};

export const getDateHref = (event: StoredDateEvent, dateId: string) => {
  const pathname = event.date < REFERENCE_DATE ? "/date/review" : "/date";
  return {
    pathname,
    query: { date: event.date, id: dateId, time: event.time, title: event.title },
  };
};
