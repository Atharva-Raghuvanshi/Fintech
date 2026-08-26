import { supabase } from './supabase';

export async function insertAppData(data: any) {
  const { error } = await supabase
    .from('app_data')
    .insert([data]);
  
  if (error) {
    console.error('Supabase Insert Error:', error);
    throw error;
  }
}

export async function fetchAppData() {
  const { data, error } = await supabase
    .from('app_data')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase Fetch Error:', error);
    throw error;
  }
  
  return data;
}
