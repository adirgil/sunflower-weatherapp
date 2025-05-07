export type City = {
  id: number;
  name: string;
  continent: string;
  active: boolean;
  country: string;
  description: string;
  image: string;
  coords: {
    lat: number;
    lng: number;
  };
};
