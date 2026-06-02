export { mockDatabase, generateMockData, type ContentItem, type LanguageConfig, supportedLanguages } from './database';
export { supabase, supabaseDatabase } from './supabase';

export const getDatabase = () => {
  if (typeof window !== 'undefined') {
    return supabaseDatabase;
  }
  return mockDatabase;
};