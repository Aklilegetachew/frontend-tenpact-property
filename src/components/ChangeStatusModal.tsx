import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Shop {
  id: number;

  shopNumber: string;
  floor: any;
  size: number;
  status: "Available" | "Occupied" | "Sold";
}

interface ChangeStatusModalProps {
  shop: any;
  onClose: () => void;
  onConfirm: () => void;
}

export function ChangeStatusModal({
  shop,
  onClose,
  onConfirm,
}: ChangeStatusModalProps) {
  const newStatus = shop.status === "Available" ? "Sold" : "Available";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Shop Status</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to change the status of {shop.
shopNumber} to{" "}
          {newStatus}?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
