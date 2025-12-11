export interface Address {
  street: string;
  city: string;
  region: string;
  country: string;
  postal_code?: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
}

export function createEmptyAddress(): Address {
  return {
    street: '',
    city: '',
    region: '',
    country: '',
    postal_code: '',
    comment: '',
    latitude: undefined,
    longitude: undefined
  };
}
