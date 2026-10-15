"use client";

import data from "@/public/db/data.json";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const WebsiteContent = () => {
  const { information } = data;
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState(null);

  const initiatives = [
    {
      img: "/img/initiative.jpg",
      title: "Initiatives",
      points: ["gallery management"],
      route: "/website-content/initiatives",
    },
  ];

  const sections = useMemo(() => {
    const all = [
      ...information.map((s) => ({ ...s, group: "Home" })),
      ...initiatives.map((s) => ({ ...s, group: "Who We Are" })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.points?.some((p) => p.toLowerCase().includes(q))
    );
  }, [information, query]);

  return (
    <>
      <style>{`
        @keyframes wcFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wcFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes wcShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes wcBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(20px,-15px) scale(1.08); }
          66%     { transform: translate(-15px,10px) scale(0.96); }
        }
        .wc-reveal { opacity: 0; animation: wcFadeUp .55s cubic-bezier(.22,1,.36,1) forwards; }
        .wc-card { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .35s ease; }
        .wc-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -18px rgba(43,54,116,.35); }
        .wc-card:hover .wc-img { transform: scale(1.08); }
        .wc-card:hover .wc-go { opacity: 1; transform: translateX(0); }
        .wc-img { transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .wc-go { opacity: 0; transform: translateX(-6px); transition: all .3s ease; }
        .wc-arrow { transition: transform .3s ease; }
        .wc-map:hover .wc-arrow { transform: translateX(4px); }
        @media (prefers-reduced-motion: reduce) {
          .wc-reveal, .wc-card, .wc-img, .wc-go { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <section className="space-y-7">
        {/* Hero */}
        <header
          className="wc-reveal relative overflow-hidden rounded-3xl bg-[#1c2555] p-8 text-white"
          style={{ animationDelay: "0ms" }}
        >
          {/* animated ambient blobs */}
          <div
            className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#4318FF]/40 blur-3xl"
            style={{ animation: "wcBlob 14s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-[#00C2FF]/25 blur-3xl"
            style={{ animation: "wcBlob 18s ease-in-out infinite reverse" }}
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Website · Content
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Shape every page of the
              <br />
              <span
                className="bg-gradient-to-r from-white via-[#9db4ff] to-white bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "wcShimmer 6s linear infinite",
                }}
              >
                public LSSC website
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              Every section below maps to a live block on the site. Open one to
              edit its content, images, and order.
            </p>

            <div className="mt-6 max-w-md">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur transition focus-within:bg-white/15 focus-within:ring-white/40">
                <i className="ri-search-line text-white/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a section…"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-white/50 hover:text-white"
                  >
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Section grid */}
        <div>
          <div
            className="wc-reveal mb-3 flex items-center justify-between"
            style={{ animationDelay: "120ms" }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Editable sections
            </h2>
            <span className="text-xs text-gray-400">
              {sections.length} shown
            </span>
          </div>

          {sections.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map((item, i) => (
                <Link
                  key={item.route}
                  href={item.route}
                  onMouseEnter={() => setHovered(item.route)}
                  onMouseLeave={() => setHovered(null)}
                  className="wc-card wc-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  style={{ animationDelay: `${180 + i * 70}ms` }}
                >
                  <div className="relative h-32 overflow-hidden bg-gray-100">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="wc-img object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2B3674] backdrop-blur">
                      {item.group}
                    </span>
                    <h3 className="absolute bottom-2 left-3 right-3 truncate text-base font-bold capitalize text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <ul className="flex flex-wrap gap-1.5">
                      {item.points?.map((p, j) => (
                        <li
                          key={j}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs capitalize text-gray-500 transition-colors group-hover:bg-[#2B3674]/8 group-hover:text-[#2B3674]"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-400">
                        Tap to edit
                      </span>
                      <span className="wc-go flex items-center gap-1 text-xs font-semibold text-[#2B3674]">
                        Open editor
                        <i className="ri-arrow-right-line" />
                      </span>
                    </div>
                  </div>

                  {/* progress-style accent that fills on hover */}
                  <span
                    className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#2B3674] to-[#4318FF] transition-all duration-500"
                    style={{ width: hovered === item.route ? "100%" : "0%" }}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="wc-reveal rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
                style={{ animation: "wcFloat 3s ease-in-out infinite" }}
              >
                <i className="ri-search-line text-xl" />
              </div>
              <p className="text-sm text-gray-500">
                No section matches “{query}”.
              </p>
            </div>
          )}
        </div>

        {/* Event map banner */}
        <Link
          href="/website-content/coordinates"
          className="wc-map wc-reveal group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6"
          style={{ animationDelay: `${180 + sections.length * 70 + 100}ms` }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(400px circle at 15% 50%, rgba(67,24,255,.06), transparent 60%)",
            }}
          />
          <span
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2B3674]/10 text-2xl text-[#2B3674]"
            style={{ animation: "wcFloat 4s ease-in-out infinite" }}
          >
            <i className="ri-map-pin-line" />
          </span>
          <div className="relative flex-1">
            <h3 className="text-lg font-bold text-[#2B3674]">
              India Event Map
            </h3>
            <p className="text-sm text-gray-500">
              Add and manage locations for events, institutes, and training
              centres.
            </p>
          </div>
          <span className="relative flex items-center gap-2 rounded-xl bg-[#2B3674] px-5 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-[#1f2957]">
            Manage
            <i className="ri-arrow-right-line wc-arrow" />
          </span>
        </Link>
      </section>
    </>
  );
};

export default WebsiteContent;