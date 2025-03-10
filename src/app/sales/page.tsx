"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { ShopGrid } from "@/components/shop-grid";
import { Spinner } from "@/components/ui/spinner";

interface Shop {
  id: number;
  shopNumber: string;
  floor: {
    id: number;
    name: string;
  };
  size: number;
  status: "Available" | "Occupied" | "Sold";
}

export default function SalesPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get("/sales/shops");

        // Transform data to match the Shop interface
        const transformedShops: Shop[] = response.data.map(
          (shop: any, index: number) => ({
            id: index + 1, // Assuming you need a numeric ID (since original ID is a string)
            shopNumber: shop.shopNumber,
            floor: {
              id: index + 1, // Assuming a numeric mapping for floor ID
              name: shop.floorName,
            },
            size: shop.size,
            status:
              shop.status === "AVAILABLE"
                ? "Available"
                : (shop.status as "Occupied" | "Sold"),
          })
        );

        setShops(transformedShops);
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast.error("Failed to fetch shops. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const availableShopsCount = shops.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Available Shops</h1>
      <p className="text-lg mb-8">
        There are currently{" "}
        <span className="font-semibold text-primary">
          {availableShopsCount}
        </span>{" "}
        shops available for sale.
      </p>
      <ShopGrid shops={shops} />
    </div>
  );
}
