import { useState } from 'react';

export interface ModalProps<T> {
    isOpen: boolean;
    openModal: (type: T, id?: string) => void;
    type: T | '';
    closeModal: () => void;
    modalId?: string;
}

export default function useModal<T>(): ModalProps<T> {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<T | ''>('');
    const [id, setId] = useState<string | undefined>();

    const openModal = (type: T, id?: string) => {
        setIsOpen(true);
        setType(type);
        setId(id);
    };

    const closeModal = () => {
        setIsOpen(false);
        setType('');
        setId(undefined);
    };

    return {
        isOpen,
        modalId: id,
        type,
        openModal,
        closeModal,
    };
}
