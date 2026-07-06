export interface ActiveProject {
  id: string;
  name: string;
  referenceNo: string;
  clientNo: string;
  projectNo: string;
  startDate: string;
  endDate: string;
  contactPersonName: string;
  mobileNumber: string;
  email: string;
  address: string;
  postalCode: string;
  companyName: string;
  status: "active" | "on-hold" | "completed";
  category: string;
  description?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  specification: string;
  type: string;
  date: string;
  fileUrl?: string;
}

export interface PersonalDocument {
  id: string;
  name: string;
  type: string;
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  rating: "good" | "moderate" | "bad";
  description: string;
}

export interface ProjectQuestion {
  id: string;
  question: string;
  answer?: string;
  date: string;
  isAnswered: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface OrgMember {
  id: string;
  company: string;
  category: string;
  role: string;
  contactPerson: string;
  phone: string;
  mail: string;
}
