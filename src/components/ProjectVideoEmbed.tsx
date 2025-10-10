"use client";

import React from "react";

function toEmbedUrl(raw?: string): { url?: string; title?: string } {
  if (!raw) return {};
  try {
    const u = new URL(raw);
    const host = u.hostname.replace("www.", "");

    // YouTube formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      let id = "";
      if (host.includes("youtu.be")) {
        id = u.pathname.split("/").filter(Boolean)[0] || "";
      } else if (u.pathname.startsWith("/watch")) {
        id = u.searchParams.get("v") || "";
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/")[2] || "";
      }
      if (id) {
        return {
          url: `https://www.youtube.com/embed/${id}?rel=0` ,
          title: "YouTube video player",
        };
      }
    }

    // Vimeo formats: vimeo.com/ID
    if (host.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0] || "";
      if (id && /^\d+$/.test(id)) {
        return {
          url: `https://player.vimeo.com/video/${id}`,
          title: "Vimeo video player",
        };
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  return {};
}

export default function ProjectVideoEmbed({ videoUrl }: { videoUrl?: string }) {
  const { url, title } = toEmbedUrl(videoUrl);
  if (!url) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/20">
      <div className="relative pt-[56.25%]">{/* 16:9 */}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={url}
          title={title || "Project video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
