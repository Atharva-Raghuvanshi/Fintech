import { supabase } from './supabase';
import { Database } from '../types/supabase';

type TradeInsert = Database['public']['Tables']['trade_history']['Insert'];
type TradeRow = Database['public']['Tables']['trade_history']['Row'];

export async function insertAppData(data: TradeInsert) {
  const { error } = await supabase
    .from('trade_history')
    .insert([data]);
  
  if (error) {
    console.error('Supabase Insert Error:', error);
    throw error;
  }
}

export async function fetchAppData(): Promise<TradeRow[]> {
  const { data, error } = await supabase
    .from('trade_history')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase Fetch Error:', error);
    throw error;
  }
  
  return data || [];
}
