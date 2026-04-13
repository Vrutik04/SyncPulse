export type CheckoutStatus = "completed" | "partial" | "blocked";

// Saved when you submit check-in
export type CheckinEntry = {
  projectName: string;
  goal: string;
  note?: string;
  checkedInAt?: string;
};

export type WorkItem = {
  text: string;
  status: CheckoutStatus;
};

//Saved when you submit check-out
export type CheckoutEntry = {
  works?: WorkItem[];
  workCompleted?: string;
  status?: CheckoutStatus;
  checkedOutAt?: string;
};

export type DailyRecord = {
  date: string;
  Checkin?: CheckinEntry;
  Checkout?: CheckoutEntry;
};

export type ThemePreference = "system" | "light" | "dark";
