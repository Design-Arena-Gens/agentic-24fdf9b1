"use client";

import nextDynamic from "next/dynamic";
import type { MapMarker } from "@/components/Map";
import MeetupForm from "@/components/MeetupForm";
import { allMeetups } from "@/lib/storage";
import { useMemo } from "react";

export const dynamic = "force-dynamic";

const Map = nextDynamic(() => import("@/components/Map"), { ssr: false });

export default function MeetupsPage() {
  const meetups = allMeetups();
  const markers: MapMarker[] = useMemo(
    () =>
      meetups.map((m) => ({
        id: m.id,
        position: [m.location.lat, m.location.lng],
        label: `${m.title} ? ${new Date(m.datetimeIso).toLocaleString()}`,
      })),
    [meetups]
  );
  const center = markers[0]?.position ?? [37.7749, -122.4194];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Meetups</h1>
      <Map center={center} markers={markers} />
      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          {meetups.length === 0 ? (
            <div className="text-white/70 text-sm">No meetups yet.</div>
          ) : (
            <ul className="space-y-3">
              {meetups.map((m) => (
                <li
                  key={m.id}
                  className="rounded border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-white/70">
                      {new Date(m.datetimeIso).toLocaleString()} ? {m.location.name}
                    </div>
                    {m.description ? <div className="text-sm mt-1">{m.description}</div> : null}
                  </div>
                  <div className="text-xs text-white/60">Host: @{m.hostHandle}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Create a Meetup</h2>
          <MeetupForm />
        </section>
      </div>
    </div>
  );
}

