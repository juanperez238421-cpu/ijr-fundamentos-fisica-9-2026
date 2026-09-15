# Final Sprint V9 — Senior Visual / Animation QA

Date: 2026-09-15
Scope: `final-sprint-visuals-v9.js`, `final-sprint-v9.css`, rendered SVG figures `fs-01` … `fs-20`.
Reference motion grammar: Statistics 11 Manim sequence `Create → FadeIn → Indicate`, adapted to viewport-triggered SVG/CSS without blocking the workshop UI.

## Executive result

The previous V9 contained several high-severity visual-coherence defects: known dimensions were drawn with wrong ratios, moving bodies detached from ropes/forces, some trajectories were animated as straight translations instead of the curve shown, equilibrium objects moved even though the statement said they were at rest, and some animations directly encoded the requested answer.

The corrected build uses one principle throughout: **known quantities may be proportional; unknown quantities must never be encoded by graphical length, speed, or final position.**

Automated deep geometry/motion checks: **41 / 41 PASS**.

## High-severity defects corrected

- `fs-01`: pendulum rotation now uses the physical pivot and a small-angle geometry; previous transform origin was the SVG group's bounding box.
- `fs-02`: 150 km/h and 200 km/h vectors now have the exact 3:4 graphical ratio.
- `fs-03`: delayed-pursuit curves are generated from the actual equations and meet at the mathematically correct event.
- `fs-04`: projectile animation now follows a sampled parabola instead of a straight diagonal translation; known height and motion share one spatial scale.
- `fs-06`: Atwood rope endpoints now terminate at block tops. Blocks no longer move independently of the rope and force labels.
- `fs-07`: the ramp is now exactly 30°; previous drawing was about 16°. The known 5 m segment is constructed on that same geometry.
- `fs-08`: collision and spring compression are separated into two panels so a cart does not pass through an undeformed spring.
- `fs-10`: unknown `h/R` is no longer implied by the drawing. Initial height and loop-top condition are shown in separate panels.
- `fs-11`: orbit radii are now exactly 1:9 and fit inside the viewBox. Animation no longer reveals the period ratio.
- `fs-12`: 3 m and 4 m lever-arm positions share a common scale and the cable is drawn at a true 30°.
- `fs-13`: disk and hoop are tangent to identical ramps. The animation no longer makes one travel farther and reveal which arrives first.
- `fs-14`: the fully submerged equilibrium body remains static; previous vertical bobbing contradicted the statement.
- `fs-15`: circular-pipe diameters are drawn in a ratio close to √2, consistent with `A1 = 2 A2`; unknown `v2` is not magnitude-scaled.
- `fs-16`: collision and projectile stages are separated. The post-collision body follows a parabola and lands on the ground plane; unknown range remains symbolic.
- `fs-17`: wheel bottoms are tangent to the road. The vehicle no longer translates an arbitrary stopping distance that could be mistaken for the result.
- `fs-18`: ballistic-pendulum rotation now uses the true pivot and the animated center-of-mass rise corresponds to the given 0.80 m scale.
- `fs-19`: the known 2.0 m height and 4.0 m rough segment now use the same linear scale. Animation stops before the unknown spring compression.
- `fs-20`: `3R` and `R` now use the same exact scale. `N` direction is shown but its graphical length is explicitly non-metric.

## Animation architecture

- Figures animate only after entering the viewport (`IntersectionObserver`).
- No recursive subtree observer is used.
- `Create` behavior: controlled stroke drawing.
- `FadeIn` behavior: delayed semantic labels/data.
- `Indicate` behavior: short filter/pulse emphasis; no layout-changing scale on critical geometry.
- Projectile motion uses sampled parabolic keyframes.
- Ballistic-pendulum motion rotates around the exact SVG pivot.
- Equilibrium objects do not translate.
- Unknown answer distances are not used as animation endpoints.
- `prefers-reduced-motion` remains supported.

## Numerical QA invariants

| Check | Result |
|---|---:|
| Plane/wind vector ratio | 150/200 = 180/240 = 0.75 |
| Delayed pursuit intersection | t = 17.0623 s global; x = 170.62 m |
| Horizontal projectile geometry | 260 px / 15 px·m⁻¹ = 17.333 m; theoretical 17.321 m |
| Incline | 30.000° |
| Incline path | 500 px represents 5 m |
| Orbit ratio | 166.5 / 18.5 = 9.000 |
| Beam load position | 3/4 of 4 m span |
| Beam cable | 30.000° |
| Pipe diameter ratio | 140/99 = 1.41414 ≈ √2 |
| Braking wheel contact | 298 + 17 = road y 315 |
| Ballistic pendulum | 45.3° rotation gives ≈80 px rise on R=270 px |
| Energy scene | 60 px/m: 2 m=120 px; 4 m=240 px |
| Loop final problem | R=80 px; 3R=240 px |

## Release acceptance criteria

PASS requires:

1. no `NaN`, `Infinity`, undefined SVG geometry, or duplicate marker IDs;
2. all 20 final-sprint figures render;
3. known geometric ratios are internally consistent;
4. unknown answer values are not leaked by visual scale or animation;
5. moving objects remain attached to their physical constraints;
6. no equilibrium object is animated as if accelerating;
7. motion does not block form fields, answer selection, or timer interaction;
8. mobile and reduced-motion fallbacks remain valid.
