export type DealStatus = "new" | "in_progress" | "won" | "lost" | "pending";

export type B2BDeal = {
  id: string;
  dealId: string;
  company: string;
  title: string;
  value: number;
  status: DealStatus;
  createdDate: string;
  expectedClose: string;
  assignedTo: string;
};
