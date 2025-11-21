"use client";

import { useEffect, useMemo, useState } from "react";
import { addPost, myHandle } from "@/lib/storage";
import type { VehicleType } from "@/lib/types";
import { useRouter } from "next/navigation";

type GeoResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function PostForm() {
  const router = useRouter();
  const [type, setType] = useState<VehicleType>("car");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState({
    make: "",
    model: "",
    year: "",
    engine: "",
    horsepower: "",
    color: "",
    drivetrain: "",
    transmission: "",
  });
  const [modsText, setModsText] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string }>();
  const author = myHandle();

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
          {
            headers: { "Accept-Language": "en" },
            signal: controller.signal,
          }
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

  const canSubmit = useMemo(() => {
    return (
      !!title &&
      !!imageUrl &&
      !!specs.make &&
      !!specs.model
    );
  }, [title, imageUrl, specs.make, specs.model]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    addPost({
      type,
      title,
      imageUrl,
      authorHandle: author,
      description: description || undefined,
      specs: {
        make: specs.make,
        model: specs.model,
        year: specs.year ? Number(specs.year) : undefined,
        engine: specs.engine || undefined,
        horsepower: specs.horsepower ? Number(specs.horsepower) : undefined,
        drivetrain: specs.drivetrain || undefined,
        transmission: specs.transmission || undefined,
        color: specs.color || undefined,
      },
      mods: modsText
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      location: selectedLocation,
    });
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm">Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("car")}
              className={`px-3 py-1.5 rounded border ${type === "car" ? "bg-blue-600 border-blue-500" : "bg-white/5 border-white/10"}`}
            >
              Car
            </button>
            <button
              type="button"
              onClick={() => setType("bike")}
              className={`px-3 py-1.5 rounded border ${type === "bike" ? "bg-emerald-600 border-emerald-500" : "bg-white/5 border-white/10"}`}
            >
              Bike
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Title</label>
          <input
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Build title"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Image URL</label>
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          required
        />
        <p className="text-xs text-white/60">Paste a direct image URL (Imgur, Unsplash, etc.).</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Description</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about the build..."
          rows={3}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Make" value={specs.make} onChange={(v) => setSpecs({ ...specs, make: v })} required />
        <Field label="Model" value={specs.model} onChange={(v) => setSpecs({ ...specs, model: v })} required />
        <Field label="Year" value={specs.year} onChange={(v) => setSpecs({ ...specs, year: v })} />
        <Field label="Engine" value={specs.engine} onChange={(v) => setSpecs({ ...specs, engine: v })} />
        <Field label="Horsepower" value={specs.horsepower} onChange={(v) => setSpecs({ ...specs, horsepower: v })} />
        <Field label="Color" value={specs.color} onChange={(v) => setSpecs({ ...specs, color: v })} />
        <Field label="Drivetrain" value={specs.drivetrain} onChange={(v) => setSpecs({ ...specs, drivetrain: v })} />
        <Field label="Transmission" value={specs.transmission} onChange={(v) => setSpecs({ ...specs, transmission: v })} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Mods (comma separated)</label>
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={modsText}
          onChange={(e) => setModsText(e.target.value)}
          placeholder="Coilovers, Intake, Exhaust"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Location (optional)</label>
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
          placeholder="Search a place..."
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
          Share Build
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm">{label}{required ? " *" : ""}</label>
      <input
        className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

