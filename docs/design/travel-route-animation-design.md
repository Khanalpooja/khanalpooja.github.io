# Travel Route Animation System (Astro)
**Final Design Document – v1**

---

## 1. Purpose & Scope

We are building a **static-first travel route animation system** for an Astro blog where:

- A **single trip map** persists across chapters
- Each chapter represents **arrival at a destination**
- Animation is a **replayable transition** (source → destination)
- Geometry is **precomputed at build time**
- A **lightweight client-side map** is used for context
- SVG routes always work **with or without the map**
- Authoring remains **simple and low-granularity**

This is **narrative visualization**, not a navigation engine.

---

## 2. High-level Architecture

Astro (static build)
- Prebuild step (Node)
  - Validate trips, routes, places
  - Compute map bounds per trip
  - Generate missing route SVGs
  - Optional static map fallback
- Client runtime (browser)
  - Leaflet / MapLibre (non-interactive)
  - SVG overlay (route + labels)
  - anime.js (marker animation)
- MDX authoring
  - TripStep markers per chapter

---

## 3. Tech Stack

- Astro
- MDX
- TypeScript
- anime.js
- Leaflet or MapLibre GL JS
- OpenStreetMap (build-time only)
- SVG

---

## 4. Core Mental Model

- Each chapter corresponds to an **arrival state**
- Routes are **legs**, always complete
- Animations are **ephemeral transitions**
- No partial progress, no continuous motion
- Reverse scroll simply replays the same transition

---

## 5. Data Models (JSON)

### places.json
```json
{
  "chicago": {
    "name": "Chicago, IL",
    "lat": 41.8781,
    "lng": -87.6298
  },
  "zion": {
    "name": "Zion National Park",
    "lat": 37.2982,
    "lng": -113.0263
  }
}
```

### routes.json
```json
{
  "chicago-to-zion": {
    "from": "chicago",
    "to": "zion",
    "mode": "car",
    "svg": "/routes/chicago-zion-car.svg"
  }
}
```

### trips.json
```json
{
  "southwest-roadtrip": {
    "legs": ["chicago-to-zion"],
    "map": {
      "width": 1000,
      "height": 600,
      "padding": 0.15
    }
  }
}
```

---

## 6. Geometry & Projection Math

### Lat/Lng → Normalized World Coordinates

```ts
function projectLatLng(lat: number, lng: number) {
  const x = (lng + 180) / 360
  const latRad = lat * Math.PI / 180
  const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2
  return { x, y }
}
```

### Map Bounds & SVG Projection

```ts
function projectToSVG(
  x: number,
  y: number,
  bounds: Bounds,
  width: number,
  height: number
) {
  return {
    x: ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * width,
    y: ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * height
  }
}
```

---

## 7. SVG Contract

```svg
<svg viewBox="0 0 1000 600">
  <path d="M120 480 L300 360 L820 120" />
</svg>
```

Rules:
- Single `<path>`
- No transforms
- No inline styles
- Direction matches travel direction

---

## 8. Build-Time Pipeline (Pseudocode)

```ts
function prebuild() {
  validateData()
  for (const trip of trips) {
    const bounds = computeTripBounds(trip)
    for (const legId of trip.legs) {
      const leg = routes[legId]
      if (!exists(leg.svg)) {
        generateRouteSVG(leg, bounds, trip.map)
      }
    }
  }
}
```

---

## 9. Runtime Rendering Model

```html
<div class="trip-map">
  <div id="map"></div>
  <svg class="route-overlay"></svg>
  <svg class="marker-layer">
    <rect class="marker" />
  </svg>
</div>
```

---

## 10. Animation Logic (anime.js)

```ts
import anime from "animejs"

function animateLeg(pathEl: SVGPathElement, markerEl: SVGElement) {
  const motionPath = anime.path(pathEl)
  anime({
    targets: markerEl,
    translateX: motionPath("x"),
    translateY: motionPath("y"),
    duration: 1200,
    easing: "easeInOutSine"
  })
}
```

---

## 11. Astro Components (Examples)

### TripLayout.astro
```astro
---
import { onMount } from "astro/client"
---
<div class="trip-map">
  <slot />
</div>
```

### TripStep.tsx
```ts
export function TripStep({ leg }: { leg: string }) {
  return null // registers via IntersectionObserver
}
```

---

## 12. Authoring Example (MDX)

```mdx
---
trip: southwest-roadtrip
---

## Day 1 – Zion
<TripStep leg="chicago-to-zion" />
```

---

## 13. Accessibility & Fallbacks

- prefers-reduced-motion → snap only
- Map failure → SVG only
- JS failure → static SVG

---

## 14. Implementation Checklist

1. Define JSON schemas
2. Implement projection math
3. Build prebuild generator
4. Setup Leaflet / MapLibre
5. Render SVG overlays
6. Integrate anime.js
7. Wire Astro components
8. Polish and document
