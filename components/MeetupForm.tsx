"use client";

import { useEffect, useMemo, useState } from "react";
import { addMeetup, myHandle } from "@/lib/storage";
import { useRouter } from "next/navigation";

type GeoResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function MeetupForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState<string>("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string }>();
  const host = myHandle();

  useEffect(() => {
    const controller = new AbortController();
    async function search() {
      if (!placeQuery || placeQuery.length < 3) {
        setGeoResults([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeQuery)}&format=json&limit=5`,
          { headers: { "Accept-Language": "en" }, signal: controller.signal }
        );
        const data = (await res.json()) as GeoResult[];
        setGeoResults(data);
      } catch {
        // ignore
      }
    }
    const id = setTimeout(search, 400);
    return () => {
      controller.abort();
      clearTimeout(id);
    };
  }, [placeQuery]);

  const canSubmit = useMemo(() => !!title && !!datetime && !!selectedLocation, [title, datetime, selectedLocation]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedLocation) return;
    addMeetup({
      title,
      description: description || undefined,
      hostHandle: host,
      datetimeIso: new Date(datetime).toISOString(),
      location: selectedLocation,
    });
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm">Title</label>
          <input
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meetup name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Description</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What to expect, parking, rules..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Location</label>
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
          placeholder="Search a place..."
          required
        />
        {geoResults.length > 0 && (
          <div className="rounded border border-white/10 bg-white/5 divide-y divide-white/10">
            {geoResults.map((r, i) => (
              <button
                type="button"
                key={i}
                className="w-full text-left px-3 py-2 hover:bg-white/10"
                onClick={() => {
                  setSelectedLocation({ lat: Number(r.lat), lng: Number(r.lon), name: r.display_name });
                  setGeoResults([]);
                  setPlaceQuery(r.display_name);
                }}
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
        {selectedLocation ? (
          <div className="text-xs text-white/70">
            Selected: {selectedLocation.name} ({selectedLocation.lat.toFixed(5)},{selectedLocation.lng.toFixed(5)})
          </div>
        ) : null}
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-50"
        >
          Create Meetup
        </button>
      </div>
    </form>
  );
}

