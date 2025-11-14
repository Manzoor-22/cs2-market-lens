import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SteamItem {
  name: string;
  hash_name: string;
  asset_description?: {
    icon_url?: string;
  };
}

interface SteamSearchResponse {
  success: boolean;
  results?: Array<{
    name: string;
    hash_name: string;
    asset_description?: {
      icon_url?: string;
    };
  }>;
}

const AddInvestment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SteamItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SteamItem | null>(null);
  
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dateBought, setDateBought] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    item: "",
    buyPrice: "",
    quantity: "",
    date: "",
  });

  // Search Steam Market API
  useEffect(() => {
    const searchSteam = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://steamcommunity.com/market/search/render/?query=${encodeURIComponent(
            searchQuery
          )}&count=20&appid=730&norender=1`
        );
        const data: SteamSearchResponse = await response.json();
        
        if (data.success && data.results) {
          setSearchResults(data.results);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Steam search error:", error);
        toast({
          title: "Search Error",
          description: "Unable to fetch Steam items. Try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchSteam, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleItemSelect = (item: SteamItem) => {
    setSelectedItem(item);
    setSearchQuery(item.name);
    setShowResults(false);
    setErrors({ ...errors, item: "" });
  };

  const validateForm = () => {
    const newErrors = {
      item: "",
      buyPrice: "",
      quantity: "",
      date: "",
    };

    if (!selectedItem) {
      newErrors.item = "Please select an item";
    }

    const priceNum = parseFloat(buyPrice);
    if (!buyPrice || isNaN(priceNum) || priceNum <= 0) {
      newErrors.buyPrice = "Please enter a valid price";
    }

    const quantityNum = parseInt(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Quantity cannot be zero";
    }

    if (!dateBought) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        itemName: selectedItem!.hash_name,
        buyPrice: parseFloat(buyPrice),
        quantity: parseInt(quantity),
        dateBought: format(dateBought!, "dd/MM/yyyy"),
        category: "General",
        appId: 730,
      };

      // TODO: Replace with your actual n8n webhook URL
      const webhookUrl = "YOUR_N8N_WEBHOOK_URL";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Investment added successfully",
        });
        
        // Reset form
        setSelectedItem(null);
        setSearchQuery("");
        setBuyPrice("");
        setQuantity("");
        setDateBought(undefined);
        
        // Optional: redirect after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to add investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedItem && buyPrice && quantity && dateBought;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Add New Investment
            </h1>
            <p className="text-muted-foreground">
              Record a new purchase and track its performance automatically.
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>
                Search for a CS2 item and enter your purchase details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Steam Item Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Steam Item Search *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Type to search CS2 items..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedItem(null);
                    }}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    className="pl-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full max-w-2xl mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleItemSelect(item)}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        {item.asset_description?.icon_url && (
                          <img
                            src={`https://community.cloudflare.steamstatic.com/economy/image/${item.asset_description.icon_url}`}
                            alt={item.name}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <span className="text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {errors.item && (
                  <p className="text-sm text-destructive">{errors.item}</p>
                )}
              </div>

              {/* Selected Item Preview */}
              {selectedItem && (
                <Card className="bg-accent/50 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      {selectedItem.asset_description?.icon_url && (
                        <img
                          src={`https://community.cloudflare.steamstatic.com/economy/image/${selectedItem.asset_description.icon_url}`}
                          alt={selectedItem.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Item</p>
                        <p className="font-semibold">{selectedItem.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Buy Price */}
              <div className="space-y-2">
                <Label htmlFor="buyPrice">Buy Price (₹) *</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  step="0.01"
                  placeholder="1500.00"
                  value={buyPrice}
                  onChange={(e) => {
                    setBuyPrice(e.target.value);
                    setErrors({ ...errors, buyPrice: "" });
                  }}
                />
                {errors.buyPrice && (
                  <p className="text-sm text-destructive">{errors.buyPrice}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setErrors({ ...errors, quantity: "" });
                  }}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity}</p>
                )}
              </div>

              {/* Date Bought */}
              <div className="space-y-2">
                <Label>Date Bought *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateBought && "text-muted-foreground"
                      )}
                    >
                      {dateBought ? format(dateBought, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateBought}
                      onSelect={(date) => {
                        setDateBought(date);
                        setErrors({ ...errors, date: "" });
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Adding Investment...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Investment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddInvestment;
