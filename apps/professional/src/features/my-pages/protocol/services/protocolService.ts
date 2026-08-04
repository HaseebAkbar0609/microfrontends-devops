import {
	MeetingPoint,
	PROTOCOL_NOTES,
	PROTOCOLS,
	PointStatus,
	Protocol,
	ProtocolNote,
	ProtocolStatus,
} from "../constants/mockData";

// Mock-backed store shared by the list/view/edit routes during a session.
// Replace with the protocol API when it lands; filtering, sorting and
// pagination of this (PII-bearing) data must then move server-side.
let protocols: Protocol[] = PROTOCOLS.map((protocol) => ({ ...protocol }));
let notes: ProtocolNote[] = PROTOCOL_NOTES.map((note) => ({ ...note }));

export function listProtocols(): Protocol[] {
	return [...protocols];
}

export function getProtocol(id: string): Protocol | undefined {
	return protocols.find((protocol) => protocol.id === id);
}

export function createProtocol(protocol: Protocol): Protocol[] {
	protocols = [protocol, ...protocols];
	return [...protocols];
}

export function updateProtocol(
	id: string,
	changes: Partial<Protocol>,
): Protocol[] {
	protocols = protocols.map((protocol) =>
		protocol.id === id ? { ...protocol, ...changes } : protocol,
	);
	return [...protocols];
}

export function setProtocolStatus(
	id: string,
	status: ProtocolStatus,
): Protocol[] {
	return updateProtocol(id, { status });
}

export function removeProtocol(id: string): Protocol[] {
	protocols = protocols.filter((protocol) => protocol.id !== id);
	return [...protocols];
}

export function addPoint(protocolId: string, point: MeetingPoint): Protocol[] {
	return updateProtocol(protocolId, {
		points: [...(getProtocol(protocolId)?.points ?? []), point],
	});
}

export function updatePoint(
	protocolId: string,
	pointId: string,
	changes: Partial<MeetingPoint>,
): Protocol[] {
	const points = (getProtocol(protocolId)?.points ?? []).map((point) =>
		point.id === pointId ? { ...point, ...changes } : point,
	);
	return updateProtocol(protocolId, { points });
}

export function setPointStatus(
	protocolId: string,
	pointId: string,
	status: PointStatus,
): Protocol[] {
	return updatePoint(protocolId, pointId, { status });
}

export function removePoint(protocolId: string, pointId: string): Protocol[] {
	const points = (getProtocol(protocolId)?.points ?? []).filter(
		(point) => point.id !== pointId,
	);
	return updateProtocol(protocolId, { points });
}

export function listNotes(): ProtocolNote[] {
	return [...notes];
}

export function addNote(note: ProtocolNote): ProtocolNote[] {
	notes = [note, ...notes];
	return [...notes];
}

export function updateNote(
	id: string,
	changes: Partial<ProtocolNote>,
): ProtocolNote[] {
	notes = notes.map((note) =>
		note.id === id ? { ...note, ...changes } : note,
	);
	return [...notes];
}

export function removeNote(id: string): ProtocolNote[] {
	notes = notes.filter((note) => note.id !== id);
	return [...notes];
}
