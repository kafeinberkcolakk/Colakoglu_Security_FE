"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WidgetMaximizeDialogProps {
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export function WidgetMaximizeDialog({
  children,
  onOpenChange,
  open,
  title,
}: WidgetMaximizeDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex h-[90vh] w-[90vw] max-w-none flex-col gap-4 p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
