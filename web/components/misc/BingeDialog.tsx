import { Dialog } from "@headlessui/react";
import React, { type ReactNode } from "react";
import Loading from "./Loading";
import Button from "../ui/Button";

type BingeDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  callback?: () => void;
  title: string;
  description: string;
  children?: ReactNode;
  error?: string | null;
  loading?: boolean;
};

const BingeDialog = ({
  isOpen,
  setIsOpen,
  callback,
  title,
  description,
  children,
  error,
  loading = false,
}: BingeDialogProps) => {
  const handleSubmit = () => {
    callback?.();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 text-ink"
    >
      <div className="fixed inset-0 bg-void/85 backdrop-blur-sm" aria-hidden />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bb-panel w-full max-w-md overflow-hidden !p-0">
          <div className="space-y-2 p-6 pb-4">
            <Dialog.Title className="text-xl font-bold tracking-tight">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm leading-relaxed text-ink-muted">
              {description}
            </Dialog.Description>
            {children ?? null}
          </div>
          {error ? (
            <div className="px-6 pb-2 text-sm text-red-300">{error}</div>
          ) : null}
          <div className="flex gap-3 border-t border-line bg-surface/50 p-4">
            <Button
              variant="ghost"
              className="flex-1"
              disabled={loading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={loading}
              onClick={() => handleSubmit()}
            >
              {loading ? <Loading /> : "Confirm"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BingeDialog;
