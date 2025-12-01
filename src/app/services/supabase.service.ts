import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment';

export interface LegalEntity {
  id?: string;
  name: string;
  legal_name?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legal_address?: string;
  actual_address?: string;
  phone?: string;
  email?: string;
  director?: string;
  accountant?: string;
  bank_name?: string;
  bik?: string;
  correspondent_account?: string;
  payment_account?: string;
  is_draft?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id?: string;
  legal_entity_id?: string;
  name: string;
  description?: string;
  short_name?: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  template?: string;
  is_franchise?: boolean;
  is_draft?: boolean;
  connection_status?: string;
  opening_hours?: any;
  warehouse_settings?: any;
  terminal_settings?: any;
  external_settings?: any;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  async getLegalEntities() {
    const { data, error } = await this.supabase
      .from('legal_entities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getLegalEntity(id: string) {
    const { data, error } = await this.supabase
      .from('legal_entities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createLegalEntity(legalEntity: LegalEntity) {
    const { data, error } = await this.supabase
      .from('legal_entities')
      .insert([legalEntity])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLegalEntity(id: string, legalEntity: Partial<LegalEntity>) {
    const { data, error } = await this.supabase
      .from('legal_entities')
      .update(legalEntity)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteLegalEntity(id: string) {
    const { error } = await this.supabase
      .from('legal_entities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getRestaurants() {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getRestaurant(id: string) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createRestaurant(restaurant: Restaurant) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .insert([restaurant])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRestaurant(id: string, restaurant: Partial<Restaurant>) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .update(restaurant)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRestaurant(id: string) {
    const { error } = await this.supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
