import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Shop {
  id: number
  shopNumber: string
  floor: {
    id: number
    name: string
  }
  size: number
  status: "Available" | "Occupied" | "Sold"
}

interface ShopTileProps {
  shop: Shop
}

export function ShopTile({ shop }: ShopTileProps) {
  const statusColor = {
    Available: "bg-green-500",
    Occupied: "bg-yellow-500",
    Sold: "bg-red-500",
  }[shop.status]

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{shop.shopNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{shop.size} sq m</span>
          <Badge className={statusColor}>{shop.status}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

