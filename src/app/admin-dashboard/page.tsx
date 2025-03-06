"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import api from "@/lib/axios";
export default function DashboardPage() {
  const [stats, setStats] = useState({
    shops: 0,
    floors: 0,
    users: 0,
    availableShops: 0,
    soldShops: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [shops, floors, users, availableShops, soldShops] =
          await Promise.all([
            api.get("/admin/shops/count"),
            api.get("/admin/floors/count"),
            api.get("/admin/users/count"),
            api.get("/admin/shops/available/count"),
            api.get("/admin/shops/sold/count"),
          ]);

        setStats({
          shops: shops.data.totalShops || 0,
          floors: floors.data.totalFloors || 0,
          users: users.data.totalUsers || 0,
          availableShops: availableShops.data.availableShops || 0,
          soldShops: soldShops.data.soldShops || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
          <CardDescription>
            Select an option from the sidebar to manage your shops and users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Total Shops"
              description="Manage your shop listings and availability"
              value={stats.shops.toString()}
            />
            <DashboardCard
              title="Floors"
              description="Organize your shops by floor"
              value={stats.floors.toString()}
            />
            <DashboardCard
              title="Users"
              description="Manage user accounts and permissions"
              value={stats.users.toString()}
            />
            <DashboardCard
              title="Available Shops"
              description="Shops that are still open for sale"
              value={stats.availableShops.toString()}
            />
            <DashboardCard
              title="Sold Shops"
              description="Shops that have been purchased"
              value={stats.soldShops.toString()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
