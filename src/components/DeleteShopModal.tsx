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
interface DeleteShopModalProps {
  shop: any;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteShopModal({
  shop,
  onClose,
  onConfirm,
}: DeleteShopModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Shop</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete {shop.shopNumber}? This action cannot
          be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
