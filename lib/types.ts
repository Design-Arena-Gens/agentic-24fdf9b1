export type VehicleType = "car" | "bike";

export interface VehicleSpecs {
  make: string;
  model: string;
  year?: number;
  engine?: string;
  horsepower?: number;
  torque?: number;
  drivetrain?: string;
  transmission?: string;
  color?: string;
}

export interface Post {
  id: string;
  type: VehicleType;
  title: string;
  imageUrl: string;
  authorHandle: string;
  description?: string;
  specs: VehicleSpecs;
  mods: string[];
  createdAt: string; // ISO
  likes: number;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  meetupIdea?: boolean;
}

export interface Meetup {
  id: string;
  title: string;
  description?: string;
  hostHandle: string;
  datetimeIso: string;
  location: {
    lat: number;
    lng: number;
    name?: string;
  };
}

export interface Profile {
  handle: string;
  bio?: string;
  following: string[];
}

export interface AppData {
  posts: Post[];
  meetups: Meetup[];
  profile: Profile;
  handles: string[]; // known handles for discovery
}

