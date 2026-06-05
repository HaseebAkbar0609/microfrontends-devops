export interface GuideFolderItem {
	label: string;
	count?: number;
	active?: boolean;
}

export interface GuideFolder {
	title: string;
	count?: number;
	defaultOpen?: boolean;
	items?: GuideFolderItem[];
}