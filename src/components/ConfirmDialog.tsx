import { Spacing } from "./Spacing";
import { Portal } from "./Portal";
import { ReactNode } from "react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  content: string | ReactNode;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function ConfirmDialog({
  content,
  open,
  onConfirm,
  onClose,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl w-1/2 max-w-sm min-h-[140px] shadow-2xl z-[101]">
          <Spacing size={42} />
          {typeof content === "string" ? (
            <div className="flex justify-center">{content}</div>
          ) : (
            content
          )}
          <Spacing size={36} />
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button onClick={onConfirm}>{confirmButtonText}</Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
