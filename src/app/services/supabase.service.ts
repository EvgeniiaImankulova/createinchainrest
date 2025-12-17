import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment';
import { Employee } from '../models/employee.model';

export interface LegalEntity {
  id?: string;
  name: string;
  description?: string;
  inn?: string;
  kpp?: string;
  okpo?: string;
  okpd?: string;
  ogrn?: string;
  legal_address_street?: string;
  legal_address_city?: string;
  legal_address_region?: string;
  legal_address_country?: string;
  legal_address_postal_code?: string;
  phone?: string;
  director_name?: string;
  accountant_name?: string;
  technologist_name?: string;
  production_manager_name?: string;
  is_draft?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  id?: string;
  legal_entity_id?: string;
  account_number: string;
  bik?: string;
  correspondent_account?: string;
  bank_name?: string;
  bank_city?: string;
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
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_country?: string;
  address_postal_code?: string;
  address_comment?: string;
  address_latitude?: number;
  address_longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  template?: string;
  is_franchise?: boolean;
  is_draft?: boolean;
  connection_status?: string;
  owner_id?: string;
  owner_phone?: string;
  owner_email?: string;
  accountant_id?: string;
  accountant_phone?: string;
  accountant_email?: string;
  royalty_percent?: number;
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

  async getEmployees() {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data as Employee[];
  }

  async getEmployee(id: string) {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Employee | null;
  }

  async createEmployee(employee: Employee) {
    const { data, error } = await this.supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  }

  async updateEmployee(id: string, employee: Partial<Employee>) {
    const { data, error } = await this.supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  }

  async deleteEmployee(id: string) {
    const { error } = await this.supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getBankAccounts(legalEntityId: string) {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .select('*')
      .eq('legal_entity_id', legalEntityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BankAccount[];
  }

  async createBankAccount(bankAccount: BankAccount) {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .insert([bankAccount])
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  }

  async updateBankAccount(id: string, bankAccount: Partial<BankAccount>) {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .update(bankAccount)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  }

  async deleteBankAccount(id: string) {
    const { error } = await this.supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
