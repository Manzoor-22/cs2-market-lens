import { useEffect, useState } from "react";
import { Navbar } from "@/components/Dashboard/Navbar";
import { SummaryCards } from "@/components/Dashboard/SummaryCards";
import { ProfitTrendChart } from "@/components/Dashboard/ProfitTrendChart";
import { ItemPerformanceTable } from "@/components/Dashboard/ItemPerformanceTable";
import { ProfitDistributionChart } from "@/components/Dashboard/ProfitDistributionChart";
import { fetchSummaryData, fetchItemsData, SummaryData, ItemData } from "@/lib/googleSheets";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [itemsData, setItemsData] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [summary, items] = await Promise.all([
        fetchSummaryData(),
        fetchItemsData(),
      ]);
      
      setSummaryData(summary);
      setItemsData(items);
      setLastUpdated(new Date().toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }));
      
      toast({
        title: "Data Updated",
        description: "Dashboard has been refreshed with latest data",
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Using demo data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      loadData();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const latestSummary = summaryData[summaryData.length - 1] || null;
  const latestItems = itemsData.filter(item => 
    !latestSummary || item.date === latestSummary.date
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onRefresh={loadData} 
        isRefreshing={isLoading}
        lastUpdated={lastUpdated}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <SummaryCards data={latestSummary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfitTrendChart data={summaryData} />
          </div>
          <div>
            <ProfitDistributionChart data={latestItems} />
          </div>
        </div>
        
        <ItemPerformanceTable data={latestItems} />
      </main>
    </div>
  );
};

export default Index;
