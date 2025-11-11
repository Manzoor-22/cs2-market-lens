import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";
import { SummaryData } from "@/lib/googleSheets";

interface SummaryCardsProps {
  data: SummaryData | null;
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="h-24 animate-pulse bg-muted/20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isProfit = data.profitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">Total Items</span>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data.totalItems}</div>
          <p className="text-xs text-muted-foreground mt-1">In Portfolio</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">Total Investment</span>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            ₹{data.totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Amount Invested</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">Current Value</span>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            ₹{data.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Portfolio Worth</p>
        </CardContent>
      </Card>

      <Card className={`border-border/50 backdrop-blur hover:border-${isProfit ? 'success' : 'destructive'}/30 transition-all duration-300 ${isProfit ? 'bg-success/5 hover:shadow-success/5' : 'bg-destructive/5 hover:shadow-destructive/5'} hover:shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">Profit/Loss</span>
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
          </div>
          <div className={`text-3xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
            {isProfit ? '+' : ''}₹{data.profitLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className={`text-xs mt-1 font-medium ${isProfit ? 'text-success' : 'text-destructive'}`}>
            {isProfit ? '+' : ''}{data.profitLossPercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
