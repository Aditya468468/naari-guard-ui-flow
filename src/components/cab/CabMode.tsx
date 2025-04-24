
import React, { useState, useEffect } from 'react';
import { Car, CarTaxiFront, User, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface CabDetails {
  driverName: string;
  vehicleNumber: string;
  cabCompany: string;
  sourceLocation: string;
  destinationLocation: string;
}

const mockCabData = {
  driverName: "John Doe",
  vehicleNumber: "XYZ 1234",
  cabCompany: "RideSafe",
  sourceLocation: "Central Park",
  destinationLocation: "Downtown"
};

const CabMode: React.FC = () => {
  const { toast } = useToast();
  const [isCabMode, setIsCabMode] = useState(false);
  const [isAutoFetch, setIsAutoFetch] = useState(false);
  
  const form = useForm<CabDetails>({
    defaultValues: {
      driverName: "",
      vehicleNumber: "",
      cabCompany: "",
      sourceLocation: "",
      destinationLocation: ""
    }
  });

  const handleAutoFetch = () => {
    setIsAutoFetch(true);
    // Simulate fetching from ride-hailing apps
    form.reset(mockCabData);
    
    toast({
      title: "Ride Details Fetched",
      description: "Successfully retrieved your current ride information",
    });
  };

  const onSubmit = async (data: CabDetails) => {
    try {
      const { error } = await supabase.from('cab_rides').insert({
        driver_name: data.driverName,
        vehicle_number: data.vehicleNumber,
        cab_company: data.cabCompany,
        source_location: data.sourceLocation,
        destination_location: data.destinationLocation,
        auto_fetched: isAutoFetch,
        is_active: true
      });

      if (error) throw error;

      toast({
        title: "Ride Details Saved",
        description: "Your ride information has been securely stored",
      });
    } catch (error) {
      toast({
        title: "Error Saving Ride Details",
        description: "There was a problem saving your ride information",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!isCabMode) {
      form.reset();
      setIsAutoFetch(false);
    }
  }, [isCabMode, form]);

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-6">
      <div className="p-3 border-b border-white/10 bg-white/5">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-medium flex items-center gap-2">
            <CarTaxiFront className="w-4 h-4 text-naari-purple" />
            Cab Mode
          </h2>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer ${
                isCabMode ? 'bg-naari-purple' : 'bg-gray-700'
              }`}
              onClick={() => setIsCabMode(!isCabMode)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  isCabMode ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
      </div>

      {isCabMode && (
        <div className="p-4">
          <div className="mb-4">
            <button
              onClick={handleAutoFetch}
              disabled={isAutoFetch}
              className={`w-full py-2 rounded-lg ${
                isAutoFetch 
                  ? 'bg-naari-purple/20 text-naari-purple'
                  : 'bg-naari-purple text-white'
              } flex items-center justify-center gap-2`}
            >
              <Car className="w-4 h-4" />
              {isAutoFetch ? 'Ride Details Fetched' : 'Auto-fetch Ride Details'}
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Driver Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-9 bg-white/5 border-white/10 text-white"
                          placeholder="Enter driver's name"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Vehicle Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-9 bg-white/5 border-white/10 text-white"
                          placeholder="Enter vehicle number"
                        />
                        <Car className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cabCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Cab Company</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-9 bg-white/5 border-white/10 text-white"
                          placeholder="Enter cab company name"
                        />
                        <CarTaxiFront className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Pickup Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-9 bg-white/5 border-white/10 text-white"
                          placeholder="Enter pickup location"
                        />
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Destination</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-9 bg-white/5 border-white/10 text-white"
                          placeholder="Enter destination"
                        />
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <button 
                type="submit"
                className="w-full py-2 bg-naari-teal text-white rounded-lg hover:bg-naari-teal/90 transition-colors"
              >
                Save Ride Details
              </button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CabMode;
