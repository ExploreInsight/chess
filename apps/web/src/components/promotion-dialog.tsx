// ** import lib
import { Dialog, Group, Heading, Modal, ModalOverlay } from "react-aria-components";

export interface PromotionChoice {
  label: string;
  symbol: string;
  onSelect: () => void;
}

export interface PromotionDialogProps {
  isOpen: boolean;
  choices: PromotionChoice[];
  onClose: () => void;
}

export function PromotionDialog({ isOpen, choices, onClose }: PromotionDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <ModalOverlay className="fixed inset-0 bg-black/60" />
      <Dialog className="relative z-10 rounded-md border border-line bg-surface p-6 shadow-[0_18px_40px_rgb(0_0_0/0.5)]">
        <Heading className="m-0 mb-4 text-base font-medium text-ink">Promote pawn</Heading>
        <Group className="flex gap-3">
          {choices.map((choice) => (
            <button
              key={choice.label}
              type="button"
              onClick={choice.onSelect}
              className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-line bg-board text-ink transition-colors hover:bg-square-selected focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {choice.symbol}
              </span>
              <span className="text-xs">{choice.label}</span>
            </button>
          ))}
        </Group>
      </Dialog>
    </Modal>
  );
}
