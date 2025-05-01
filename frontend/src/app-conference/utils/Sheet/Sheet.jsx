import * as Dialog from "@radix-ui/react-dialog";
import { MdClose } from "react-icons/md";
import "./Sheet.css"; 

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" onClick={() => onOpenChange(false)} />
        <Dialog.Content className="sheet-content" data-state={open ? "open" : "closed"}>
          <Dialog.Close asChild>
            <button className="sheet-close">
              <MdClose size={24} />
            </button>
          </Dialog.Close>
          <div className="sheet-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Sheet;
