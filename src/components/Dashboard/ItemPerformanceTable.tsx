import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search, TrendingUp, TrendingDown } from "lucide-react";
import { ItemData } from "@/lib/googleSheets";
import { Button } from "@/components/ui/button";

interface ItemPerformanceTableProps {
  data: ItemData[];
}

export const ItemPerformanceTable = ({ data }: ItemPerformanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof ItemData; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = data.filter(item =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (key: keyof ItemData) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            📊 Item Performance
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold text-right">Buy Price</TableHead>
                <TableHead className="font-semibold text-right">Qty</TableHead>
                <TableHead className="font-semibold text-right">Market Price</TableHead>
                <TableHead className="font-semibold text-right">Investment</TableHead>
                <TableHead className="font-semibold text-right">Current Value</TableHead>
                <TableHead className="font-semibold text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('profitLossPercent')}
                    className="hover:bg-transparent p-0 h-auto font-semibold"
                  >
                    P/L %
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-right">Volume (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => {
                const isProfit = item.profitLoss >= 0;
                return (
                  <TableRow key={index} className="hover:bg-muted/20">
                    <TableCell className="font-medium max-w-xs truncate">
                      {item.item}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.buyPrice.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ₹{item.marketPrice.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.totalInvestment.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{item.currentValue.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                        {isProfit ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {isProfit ? '+' : ''}{item.profitLossPercent.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.volume24h.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
