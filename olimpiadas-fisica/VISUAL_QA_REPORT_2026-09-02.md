# Physics Olympiad — Visual QA Report

Date: 2026-09-02
Scope: Theory Lab + Workshop + Supabase progress backend
Review level: Senior physics / geometry / interaction QA

## Executive result

The energy-transfer defect was confirmed. The previous implementation animated potential and kinetic energy with independent CSS scale factors while the kinetic-energy rectangle had a base height of only 10 px versus 150 px for potential energy. Therefore the displayed bars could not represent complementary energy transfer.

The V7 correction makes the particle position on the actual SVG track the single source of truth. Potential energy is computed from vertical position relative to the chosen datum and kinetic energy is defined as its complement in the conservative mode:

- U_fraction = clamp((datum_y - y)/(datum_y - top_y))
- K_fraction = 1 - U_fraction
- U_fraction + K_fraction = 1

The runner and both bars are now updated in the same animation frame. As U decreases, K increases by the same normalized amount; when the particle climbs, the relation reverses. Pause and Replay operate on the same state.

## Theory laboratory — block-by-block QA

| Block | Visual model | QA result | Action |
|---|---|---|---|
| 01 Tools & vectors | components / resultant | PASS | Component projections, 120° resultant geometry and axis conventions reviewed. |
| 02 Kinematics | x–t slope / v–t area / v–t slope | FIXED | The shaded v–t area now follows the same curved velocity graph instead of a polygonal approximation. |
| 03 Dynamics | inclined-plane FBD | FIXED | Block placement is computed from the surface normal; weight remains vertical; normal remains perpendicular; friction and velocity remain tangent to the plane; component equation typo removed. |
| 04 Work, energy & power | energy transfer / dissipation | FIXED — CRITICAL | U and K now derive from actual track height in one state model, with K = 1 − U. Independent CSS bar animations were disabled. |
| 05 Momentum | system / collision | FIXED | Cart keyframes were corrected so the two carts meet without a 50 px geometric overlap before the stuck state. |
| 06 Circular motion & gravitation | tangent velocity / radial acceleration | PASS | Velocity remains tangent and acceleration/gravity remains radial toward the center. No fictitious extra “centripetal force” is drawn. |
| 07 Rotation & equilibrium | perpendicular / radial force | PASS | Torque comparison correctly uses the perpendicular lever arm; a radial line through the pivot gives zero torque. |
| 08 Fluids | continuity / Bernoulli / hydrostatic | FIXED | Hydrostatic pressure now uses four equal-length directional arrows at a given depth and increases their common magnitude with depth; slider range prevents clipping. Bernoulli particle radius remains explicitly defined. |

## Workshop figure QA

The workshop already contained targeted physics corrections for high-risk figures, including vertical throw at the apex, inclined-plane FBDs, vertical-loop minimum-height geometry, stopping-distance diagrams that do not leak the answer, banked curves, radial torque, exact lever-arm ratios, continuity/Bernoulli pipe narrowing, floating-ice final-level anti-leak design, and equal-depth efflux comparisons.

A second runtime QA layer is now loaded after those physics-specific corrections and before the workshop renderer. Every non-empty workshop figure is parsed before display and is rejected if it contains malformed SVG structure, missing viewBox, NaN, Infinity, undefined/null geometry, or non-finite numeric coordinates. Accepted figures receive `data-physics-qa="workshop-v6"`, `data-qid`, `preserveAspectRatio="xMidYMid meet"`, and non-scaling strokes for stable rendering at different viewport sizes.

### Topic coverage

| Topic | Questions | Answer keys | Figure review state |
|---|---:|---:|---|
| tools-vectors | 10 | 10 | Reviewed + runtime guard |
| kinematics | 10 | 10 | Reviewed + targeted apex fix + runtime guard |
| dynamics | 10 | 10 | Reviewed + targeted FBD fixes + runtime guard |
| energy | 10 | 10 | Reviewed + loop/stopping-distance fixes + runtime guard |
| momentum | 10 | 10 | Reviewed + runtime guard |
| circular-gravity | 10 | 10 | Reviewed + banked-curve fix + runtime guard |
| rotation-equilibrium | 10 | 10 | Reviewed + torque/lever-arm fixes + runtime guard |
| fluids | 10 | 10 | Reviewed + continuity/ice/efflux fixes + runtime guard |

## Supabase QA

Project: `rlfxnjbqxbozjdzkbwlz`
Edge Function: `physics-olympiad-hub` v3 — ACTIVE

Database consistency check:

- Published topics: 8
- Declared questions: 80
- Answer-key rows: 80
- Distinct answer-key question IDs: 80
- Distribution: exactly 10 keys for each of the 8 topic slugs

Recent Edge Function traffic reviewed for 2026-09-02 showed successful `OPTIONS 204` and `POST 200` responses for the olympiad hub in the returned log window. No backend data migration was required for this visual correction.

## Files introduced/updated

- `theory-v7-qa.js` — state-coupled energy animation and theory geometry corrections
- `theory-v7-qa.css` — rendering/animation corrections, momentum collision geometry
- `theory.html` — loads V7 QA layer
- `workshop-v6-qa.js` — validates every rendered workshop SVG before display
- `workshop-v6-qa.css` — stable geometric rendering guardrails
- `workshop.html` — loads workshop V6 QA layer

## Acceptance criteria

1. In conservative Energy transfer mode, displayed U and K are complementary at every rendered animation state.
2. Lower particle height relative to the selected datum cannot produce a simultaneous decrease in both U and K.
3. Pause freezes runner and energy bars on the same state; Replay returns the system to the same initial state.
4. FBD geometry preserves vertical weight, surface-normal N and surface-tangent components as angle changes.
5. Hydrostatic pressure is visually isotropic at a point and increases with depth.
6. Workshop figures cannot render malformed/non-finite SVG geometry.
7. Workshop/Supabase remains 8 topics × 10 questions = 80, with 80 unique answer keys.
