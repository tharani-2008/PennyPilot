import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-navy-300 mb-4 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn-primary flex-1 bg-red-500 hover:bg-red-400 text-white"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
