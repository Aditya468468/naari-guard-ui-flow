-- Create cab_rides table
CREATE TABLE public.cab_rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  cab_company TEXT NOT NULL,
  source_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  auto_fetched BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cab_rides ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cab_rides
CREATE POLICY "Users can view their own rides" 
ON public.cab_rides 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rides" 
ON public.cab_rides 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" 
ON public.cab_rides 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rides" 
ON public.cab_rides 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cab_rides_updated_at
  BEFORE UPDATE ON public.cab_rides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_cab_rides_user_id ON public.cab_rides(user_id);
CREATE INDEX idx_cab_rides_is_active ON public.cab_rides(is_active);
CREATE INDEX idx_cab_rides_created_at ON public.cab_rides(created_at);