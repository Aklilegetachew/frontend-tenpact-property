"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Shop {
  id: number;
  shopNumber: string;
  floor: { id: string; name: string };
  size: number;
  status: "Available" | "Occupied" | "Sold";
}

interface Floor {
  id: string;
  name: string;
}

interface EditShopModalProps {
  shop: Shop;
  onClose: () => void;
  onSubmit: (updatedShop: Shop) => void;
}

const formSchema = z.object({
  shopNumber: z.string().min(1, "Shop number is required"),
  floorId: z.string().min(1, "Floor is required"),
  size: z.number().positive("Size must be a positive number"),
});

export function EditShopModal({ shop, onClose, onSubmit }: EditShopModalProps) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopNumber: shop.shopNumber,
      floorId: shop.floor.id,
      size: shop.size,
    },
  });

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await api.get<Floor[]>("/sales/floors");
        setFloors(response.data);
      } catch (error) {
        console.error("Error fetching floors:", error);
        toast.error("Failed to fetch floors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloors();
  }, []);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    const updatedShop: Shop = {
      ...shop,
      shopNumber: data.shopNumber,
      size: data.size,
      floor: {
        id: data.floorId,
        name: floors.find((f) => f.id === data.floorId)?.name || "",
      },
    };
    onSubmit(updatedShop);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shop</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="shopNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id}>
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (sq m)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
