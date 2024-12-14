import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AccountDialogProps {
  accounts: string[];
  networkName: string;
  onSwitchAccount: (account: string) => void;
  onDisconnect: () => void;
}

const AccountDialog = ({
  accounts,
  networkName,
  onSwitchAccount,
  onDisconnect,
}: AccountDialogProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-white/90">
          {formatAddress(accounts[0])}{networkName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black/20 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Connected Account</DialogTitle>
          <DialogDescription className="text-gray-200">
            You are connected with account {formatAddress(accounts[0])}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {accounts.length > 1 && (
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-white">Switch Account</div>
              {accounts.map((account, index) => (
                <Button
                  key={account}
                  variant="outline"
                  onClick={() => onSwitchAccount(account)}
                  className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
                >
                  Account {index + 1}: {formatAddress(account)}
                </Button>
              ))}
            </div>
          )}
          <Button 
            onClick={onDisconnect} 
            variant="destructive"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;