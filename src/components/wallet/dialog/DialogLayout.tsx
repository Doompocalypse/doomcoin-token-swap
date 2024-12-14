import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogLayoutProps {
  children: ReactNode;
}

const DialogLayout = ({ children }: DialogLayoutProps) => {
  return (
    <DialogContent className="sm:max-w-md bg-black/20 backdrop-blur-sm border border-white/10">
      <DialogHeader>
        <DialogTitle className="text-white">Connect Your Wallet</DialogTitle>
        <DialogDescription className="text-gray-200">
          Choose your preferred wallet to connect to our application. Make sure you're on the Arbitrum network.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        {children}
      </div>
    </DialogContent>
  );
};

export default DialogLayout;