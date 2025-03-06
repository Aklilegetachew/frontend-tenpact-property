"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

interface Floor {
  id: string;
  name: string;
}

const formSchema = z.object({
  shopNumber: z.string().min(1, { message: "Shop number is required." }),
  size: z.number().positive({ message: "Size must be a positive number." }),
  floorId: z.string().min(1, { message: "Floor is required." }),
});

export default function AddShopPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopNumber: "",
      size: 0,
      floorId: "",
    },
  });

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await api.get<Floor[]>("/sales/floors");
        console.log("floors", response.data);
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const shopData = {
        ...values,
        floorId: values.floorId,
      };
      console.log(shopData);
      const response = await api.post("/admin/shops", shopData);
      console.log(response);

      toast.success("Shop added successfully!");
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error adding shop:", error);
      toast.error("Failed to add shop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-2xl font-bold">Add New Shop</h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Shop Details</CardTitle>
          <CardDescription>Enter the details for the new shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="shopNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. A1, B2, C3" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique identifier for the shop.
                    </FormDescription>
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
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the size of the shop in square feet.
                    </FormDescription>
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
                          <SelectItem
                            key={floor.id}
                            value={floor.id.toString()}
                          >
                            {floor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the floor where this shop is located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Shop"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
