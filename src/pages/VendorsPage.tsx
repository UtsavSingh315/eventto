import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { VendorCard } from "../components/vendors/VendorCard";
import { VendorForm } from "../components/vendors/VendorForm";
import { Dialog, DialogContent } from "../components/ui/Dialog";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Tables = Database["public"]["Tables"];
type Vendor = Tables["vendors"]["Row"];

export const VendorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("vendors").select("*");

      if (error) throw error;

      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const searchTerms = searchQuery.toLowerCase();
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerms) ||
      vendor.email.toLowerCase().includes(searchTerms);

    const matchesCategory =
      categoryFilter === "all" || vendor.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleAddVendorSuccess = () => {
    setIsAddingVendor(false);
    fetchVendors();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <Button onClick={() => setIsAddingVendor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>

        <Dialog open={isAddingVendor} onOpenChange={setIsAddingVendor}>
          <DialogContent>
            <VendorForm
              onSuccess={handleAddVendorSuccess}
              onCancel={() => setIsAddingVendor(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select
            options={[
              { value: "all", label: "All Categories" },
              { value: "venue", label: "Venue" },
              { value: "catering", label: "Catering" },
              { value: "marketing", label: "Marketing" },
              { value: "entertainment", label: "Entertainment" },
              { value: "technology", label: "Technology" },
              { value: "other", label: "Other" },
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No vendors found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
