"use client";

import { v4 as uuidv4 } from "uuid";
import type { AppData, Meetup, Post, Profile, VehicleType } from "./types";

const STORAGE_KEY = "gearheads_app_data_v1";

function getDefaultHandle(): string {
  return `guest_${uuidv4().slice(0, 6)}`;
}

function getInitialSeedData(): AppData {
  const now = new Date().toISOString();
  const handles = ["boosted_ben", "vtec_violet", "two_wheel_tony", "stance_sam"];
  const posts: Post[] = [
    {
      id: uuidv4(),
      type: "car",
      title: "Mk4 Supra - Single Turbo Build",
      imageUrl:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop",
      authorHandle: "boosted_ben",
      description: "Fresh 6466 single turbo setup. Tuned on E85.",
      specs: {
        make: "Toyota",
        model: "Supra",
        year: 1997,
        engine: "2JZ-GTE",
        horsepower: 720,
        drivetrain: "RWD",
        transmission: "6MT",
        color: "Black",
      },
      mods: ["Precision 6466", "AEM Infinity", "ID1300 injectors", "BC coilovers"],
      createdAt: now,
      likes: 42,
      location: { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
    },
    {
      id: uuidv4(),
      type: "bike",
      title: "Yamaha R6 Track Setup",
      imageUrl:
        "https://images.unsplash.com/photo-1520877745935-6a1f0b2e5f5a?q=80&w=1600&auto=format&fit=crop",
      authorHandle: "two_wheel_tony",
      description: "Suspension dialed in, ready for the weekend.",
      specs: { make: "Yamaha", model: "R6", year: 2018, color: "Blue" },
      mods: ["Akrapovic exhaust", "Quickshifter", "Race fairings"],
      createdAt: now,
      likes: 27,
      location: { lat: 36.174465, lng: -115.137221, name: "Las Vegas" },
    },
  ];

  const meetups: Meetup[] = [
    {
      id: uuidv4(),
      title: "Saturday Cars & Coffee",
      description: "All builds welcome. Be respectful.",
      hostHandle: "stance_sam",
      datetimeIso: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      location: { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
    },
  ];

  const profile: Profile = {
    handle: getDefaultHandle(),
    bio: "Car/bike enthusiast. Building my dream machine.",
    following: ["boosted_ben"],
  };

  return { posts, meetups, profile, handles };
}

function safeGetLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadData(): AppData {
  const ls = safeGetLocalStorage();
  if (!ls) return getInitialSeedData();
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) {
    const data = getInitialSeedData();
    ls.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    const data = getInitialSeedData();
    ls.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
}

export function saveData(data: AppData): void {
  const ls = safeGetLocalStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addPost(newPost: Omit<Post, "id" | "createdAt" | "likes">): Post {
  const data = loadData();
  const post: Post = {
    ...newPost,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  data.posts.unshift(post);
  if (!data.handles.includes(post.authorHandle)) data.handles.push(post.authorHandle);
  saveData(data);
  return post;
}

export function likePost(postId: string): void {
  const data = loadData();
  const p = data.posts.find((x) => x.id === postId);
  if (p) {
    p.likes += 1;
    saveData(data);
  }
}

export function addMeetup(meetup: Omit<Meetup, "id">): Meetup {
  const data = loadData();
  const m: Meetup = { ...meetup, id: uuidv4() };
  data.meetups.unshift(m);
  if (!data.handles.includes(meetup.hostHandle)) data.handles.push(meetup.hostHandle);
  saveData(data);
  return m;
}

export function followHandle(handle: string): void {
  const data = loadData();
  if (data.profile.handle === handle) return;
  if (!data.profile.following.includes(handle)) {
    data.profile.following.push(handle);
    saveData(data);
  }
}

export function setHandle(newHandle: string): void {
  const data = loadData();
  data.profile.handle = newHandle;
  if (!data.handles.includes(newHandle)) data.handles.push(newHandle);
  saveData(data);
}

export function setBio(newBio: string): void {
  const data = loadData();
  data.profile.bio = newBio;
  saveData(data);
}

export function myHandle(): string {
  return loadData().profile.handle;
}

export function myProfile(): Profile {
  return loadData().profile;
}

export function myPosts(): Post[] {
  const me = myHandle();
  return loadData().posts.filter((p) => p.authorHandle === me);
}

export function allPosts(filter?: { type?: VehicleType; author?: string }): Post[] {
  const data = loadData();
  let arr = data.posts.slice();
  if (filter?.type) arr = arr.filter((p) => p.type === filter.type);
  if (filter?.author) arr = arr.filter((p) => p.authorHandle === filter.author);
  return arr;
}

export function allMeetups(): Meetup[] {
  return loadData().meetups.slice();
}

export function knownHandles(): string[] {
  return loadData().handles.slice();
}

