
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrustCircleContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  is_emergency_contact: boolean;
  is_sharing: boolean;
  is_alerted?: boolean;
  priority: number;
  user_id: string;
}

export function useTrustCircle() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['trust-circle-contacts'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('trust_circle_contacts')
        .select('*')
        .order('priority', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching contacts",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Initialize is_alerted as false for all contacts
      return (data || []).map(contact => ({
        ...contact,
        is_alerted: false
      })) as TrustCircleContact[];
    },
  });

  const addContact = useMutation({
    mutationFn: async (contact: Omit<TrustCircleContact, 'id'>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      const newContact = {
        ...contact,
        user_id: user.id
      };
      
      const { data, error } = await (supabase as any)
        .from('trust_circle_contacts')
        .insert(newContact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-circle-contacts'] });
      toast({
        title: "Contact added",
        description: "Contact has been added to your trust circle",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async (contact: TrustCircleContact) => {
      // Filter out the is_alerted property if it exists as it's not in the DB
      const { is_alerted, ...dbContact } = contact;
      
      const { data, error } = await (supabase as any)
        .from('trust_circle_contacts')
        .update(dbContact)
        .eq('id', contact.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-circle-contacts'] });
      toast({
        title: "Contact updated",
        description: "Contact has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('trust_circle_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-circle-contacts'] });
      toast({
        title: "Contact deleted",
        description: "Contact has been removed from your trust circle",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
  };
}
