export type TagSelectorProps = {
	label: string;
	options: readonly string[];
	selected: string[];
	onToggle: (value: string) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isEditing: boolean;
};
