"use client";

import { useMemo, useState } from "react";
import { ShopTile } from "@/components/shop-tile";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ShopGridProps {
  shops: Shop[];
}

export function ShopGrid({ shops }: ShopGridProps) {
  const shopsByFloor = useMemo(() => {
    return shops.reduce((acc, shop) => {
      const floorName = shop.floor.name;
      if (!acc[floorName]) {
        acc[floorName] = [];
      }
      acc[floorName].push(shop);
      return acc;
    }, {} as Record<string, Shop[]>);
  }, [shops]);

  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>(() => {
    // Initialize all floors as open
    return Object.keys(shopsByFloor).reduce((acc, floorName) => {
      acc[floorName] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleFloor = (floorName: string) => {
    setOpenFloors((prev) => ({ ...prev, [floorName]: !prev[floorName] }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(shopsByFloor).map(([floorName, floorShops]) => (
        <div key={floorName} className="border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleFloor(floorName)}
          >
            <h2 className="text-2xl font-semibold">{floorName}</h2>
            {openFloors[floorName] ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </Button>
          {openFloors[floorName] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {floorShops.map((shop) => (
                <ShopTile key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
