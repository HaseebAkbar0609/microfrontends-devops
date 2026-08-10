export type CalcOverviewStatus = "not_started" | "in_progress" | "completed";

export type CalcOverviewItem = {
  id: string;
  calcNo: string;
  projectName: string;
  connection: string;
  client: string;
  offertDatum: string;
  typ: string;
  offertSumma: number;
  kategori: string;
  status: CalcOverviewStatus;
};
