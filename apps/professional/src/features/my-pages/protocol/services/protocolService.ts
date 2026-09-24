import { getRecord, listRecords, saveRecord } from "../../shared/api";
import { MeetingPoint, PointStatus, Protocol, ProtocolNote } from "../constants/data";

export const listProtocols = () => listRecords<Protocol>("protocol");
export const getProtocol = (id: string) => getRecord<Protocol>(id);
export const listNotes = () => listRecords<ProtocolNote>("note");
export const updateProtocol = (protocol: Protocol, changes: Partial<Protocol>) =>
  saveRecord("protocol", { ...protocol, ...changes }, protocol);
export const addPoint = (protocol: Protocol, point: MeetingPoint) =>
  updateProtocol(protocol, { points: [...protocol.points, point] });
export const updatePoint = (protocol: Protocol, id: string, changes: Partial<MeetingPoint>) =>
  updateProtocol(protocol, { points: protocol.points.map((point) => point.id === id ? { ...point, ...changes } : point) });
export const setPointStatus = (protocol: Protocol, id: string, status: PointStatus) =>
  updatePoint(protocol, id, { status });
export const removePoint = (protocol: Protocol, id: string) =>
  updateProtocol(protocol, { points: protocol.points.filter((point) => point.id !== id) });
