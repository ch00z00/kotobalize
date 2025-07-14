'use client';

import React from 'react';
import Modal from '../common/Modal';
import Button from '../atoms/Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
  confirmText?: string;
  loadingText?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  confirmText = '削除',
  loadingText = '削除中...',
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500 whitespace-pre-line">{message}</p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="danger"
            className="w-full sm:ml-3 sm:w-auto"
          >
            {isLoading ? loadingText : confirmText}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="mt-3 w-full sm:mt-0 sm:w-auto"
          >
            キャンセル
          </Button>
        </div>
      </div>
    </Modal>
  );
}
