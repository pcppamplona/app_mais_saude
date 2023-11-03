import axios from 'axios';

const supabase = axios.create({
    baseURL: 'https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1',
    headers:{
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreHlqb2VkdXV0bnpxa3luc2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNjU3ODMsImV4cCI6MjAwODc0MTc4M30.2Ms9z2pZQ-SU3sVh3qIHCTxHVDeRyeCO1yHQhkAiV8o'
    }
})

export default supabase;