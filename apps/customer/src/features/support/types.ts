export interface GuideFolderItem {
	id: string;
	label: string;
	count?: number;
	active?: boolean;
	href?: string;
}

export interface GuideFolder {
	title: string;
	count?: number;
	defaultOpen?: boolean;
	items?: GuideFolderItem[];
	href?: string;
}
