export interface TourPoint {
  id: string;
  title: string;
  coords: { latitude: number; longitude: number };
  url: string;
  address: string;
  description: string;
  category?: string;
  visited?: boolean;
}
