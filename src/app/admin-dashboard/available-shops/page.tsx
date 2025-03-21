"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditShopModal } from "@/components/EditShopModal";
import { ChangeStatusModal } from "@/components/ChangeStatusModal";
import { DeleteShopModal } from "@/components/DeleteShopModal";

interface Shop {
  id: string; // Changed from number to string
  shopNumber: string;
  floor: {
    id: string;
    name: string;
    number: number;
  };
  size: number;
  status: "AVAILABLE" | "OCCUPIED" | "SOLD"; // Updated status values
  createdAt: string;
  updatedAt: string;
}

export default function AvailableShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editShop, setEditShop] = useState<Shop | null>(null);
  const [changeStatusShop, setChangeStatusShop] = useState<Shop | null>(null);
  const [deleteShop, setDeleteShop] = useState<Shop | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/sales/shops/available");

      // Map the new response format to the Shop interface
      const formattedShops = response.data.map((shop: any) => ({
        id: shop.id,
        shopNumber: shop.shopNumber,
        floor: {
          id: shop.floorId,
          name: shop.floorName,
          number: shop.floorNumber,
        },
        size: shop.size,
        status: shop.status,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
      }));

      setShops(formattedShops);
    } catch (error: any) {
      setError("Error fetching shops data");
      console.error("Error fetching shops data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditShop = async (updatedShop: Shop) => {
    try {
      const response = await api.put(`/admin/shops/${updatedShop.id}`, {
        shopNumber: updatedShop.shopNumber,
        floorId: updatedShop.floor.id,
        size: updatedShop.size,
      });

      setShops(
        shops.map((shop) => (shop.id === updatedShop.id ? updatedShop : shop))
      );

      setEditShop(null);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating shop:", error);
    }
  };

  const handleChangeStatus = async (shop: Shop) => {
    try {
      const newStatus = "SOLD";
      await api.put(`/admin/shops/${shop.id}/status`, { status: newStatus });

      setChangeStatusShop(null);
    } catch (error) {
      console.error("Error changing shop status:", error);
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    try {
      await api.delete(`/admin/shops/${shopId}`);
      setShops(shops.filter((shop) => shop.id !== shopId));
      setDeleteShop(null);
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-2xl font-bold">Available Shops</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Availability</CardTitle>
          <CardDescription>
            View all available shops in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell>{shop.shopNumber}</TableCell>
                    <TableCell>{shop.floor.name}</TableCell>
                    <TableCell>{shop.size} sq m</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          shop.status === "AVAILABLE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : shop.status === "OCCUPIED"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {shop.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditShop(shop)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChangeStatusShop(shop)}
                        >
                          Change Status
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteShop(shop)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editShop && (
        <EditShopModal
          shop={editShop}
          onClose={() => setEditShop(null)}
          onSubmit={handleEditShop}
        />
      )}

      {changeStatusShop && (
        <ChangeStatusModal
          shop={changeStatusShop}
          onClose={() => setChangeStatusShop(null)}
          onConfirm={() => handleChangeStatus(changeStatusShop)}
        />
      )}

      {deleteShop && (
        <DeleteShopModal
          shop={deleteShop}
          onClose={() => setDeleteShop(null)}
          onConfirm={() => handleDeleteShop(deleteShop.id)}
        />
      )}
    </div>
  );
}
