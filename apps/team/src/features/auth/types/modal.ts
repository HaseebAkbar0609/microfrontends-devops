export interface ModalProps<T> {
	isOpen: boolean;
	openModal: (type: T, id?: string) => void;
	type: T | "";
	closeModal: () => void;
	modalId?: string;
}
