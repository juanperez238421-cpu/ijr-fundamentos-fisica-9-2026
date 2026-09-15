(() => {
  const data = window.PHYSICS_OLYMPIAD_DATA;
  if (!data?.topics || data.topics.some((topic) => topic.slug === "final-sprint")) return;

  data.competition.questionCount = 100;
  data.competition.finalSprint = {
    date: "2026-09-17",
    audience: "Grade 11",
    targetMinutes: 63,
    note: "Timed practice built from the current mechanics scope. It is original preparation material, not an official or leaked EIA test."
  };

  data.topics.push({
    slug: "final-sprint",
    number: "09",
    title: "EIA Final Sprint · Timed Practice",
    english: "Timed semifinal/final-level mechanics",
    level: "Final",
    overview: "20 integrated olympiad-style problems for Grade 11. The goal is not formula recall: choose the model quickly, solve under a target time, and verify the result physically.",
    problemLens: "Final-sprint routine: identify the governing principle in the first 20–30 seconds, model symbolically, calculate only what is needed, then use units and limiting cases as a final check.",
    questions: [
      {
        id: "fs-01", stage: "Sprint", timeLimitSec: 90, skill: "Scaling · dimensional reasoning", difficulty: "Medium",
        description: "Use scaling instead of re-deriving the full pendulum equation.",
        prompt: "The period of a simple pendulum scales as \\(T\\propto\\sqrt{L/g}\\). If \\(L\\to4L\\) while \\(g\\to g/4\\), the new period is:",
        options: {A:"2T", B:"4T", C:"8T", D:"16T"}
      },
      {
        id: "fs-02", stage: "Sprint", timeLimitSec: 120, skill: "Vectors · relative motion", difficulty: "Medium",
        description: "Resolve perpendicular velocity components before thinking about direction.",
        prompt: "An airplane has an airspeed of 200 km/h due north while a wind of 150 km/h blows due east. Its ground velocity is approximately:",
        options: {A:"350 km/h due northeast", B:"250 km/h, 53.1° east of north", C:"250 km/h, 36.9° east of north", D:"50 km/h, 36.9° east of north"},
        visual: {type:"kinematics-graph", variant:"river"}
      },
      {
        id: "fs-03", stage: "Core", timeLimitSec: 180, skill: "Kinematics · delayed pursuit", difficulty: "Hard",
        description: "Choose a single time origin and keep the four-second delay explicit.",
        prompt: "Car A passes x=0 at 10 m/s. Four seconds later, car B starts from rest at x=0 with constant acceleration 2 m/s². How long after B starts does B catch A?",
        options: {A:"8.0 s", B:"13.1 s", C:"16.0 s", D:"20.0 s"}
      },
      {
        id: "fs-04", stage: "Sprint", timeLimitSec: 150, skill: "Projectile · impact speed", difficulty: "Medium",
        description: "Horizontal and vertical components share time but can be combined at impact.",
        prompt: "A ball is launched horizontally at 10 m/s from a 15 m cliff. Neglect air resistance and use \\(g=10\\,m/s^2\\). Its speed just before impact is:",
        options: {A:"10 m/s", B:"17.3 m/s", C:"20 m/s", D:"25 m/s"},
        visual: {type:"kinematics-graph", variant:"projectile"}
      },
      {
        id: "fs-05", stage: "Core", timeLimitSec: 180, skill: "Dynamics · angled pull with friction", difficulty: "Hard",
        description: "The vertical component changes the normal force, which changes kinetic friction.",
        prompt: "A 5 kg block on a horizontal floor is pulled by a 30 N force at 37° above the horizontal. The coefficient of kinetic friction is 0.20. Use \\(g=10\\,m/s^2\\), \\(\\sin37°=0.6\\), \\(\\cos37°=0.8\\). The acceleration is approximately:",
        options: {A:"2.00 m/s²", B:"2.80 m/s²", C:"3.20 m/s²", D:"3.52 m/s²"},
        visual: {type:"dynamics-incline", variant:"push-down"}
      },
      {
        id: "fs-06", stage: "Core", timeLimitSec: 180, skill: "Dynamics · Atwood tension", difficulty: "Hard",
        description: "Find the common acceleration first, then isolate one mass to obtain the tension.",
        prompt: "An ideal Atwood machine has masses 6 kg and 2 kg. Use \\(g=10\\,m/s^2\\). The string tension is:",
        options: {A:"20 N", B:"30 N", C:"40 N", D:"60 N"},
        visual: {type:"dynamics-incline", variant:"atwood"}
      },
      {
        id: "fs-07", stage: "Core", timeLimitSec: 210, skill: "Energy · friction on incline", difficulty: "Hard",
        description: "Compare the gravitational energy lost with the work done by friction.",
        prompt: "A 2 kg block starts from rest and slides 5 m down a 30° incline with \\(\\mu_k=0.20\\). Use \\(g=10\\,m/s^2\\). Its speed at the bottom is approximately:",
        options: {A:"4.0 m/s", B:"5.0 m/s", C:"5.7 m/s", D:"7.1 m/s"},
        visual: {type:"energy-track", variant:"two-paths"}
      },
      {
        id: "fs-08", stage: "Final", timeLimitSec: 240, skill: "Collision + spring energy", difficulty: "Final",
        description: "Momentum is conserved during the sticking collision; mechanical energy is used only after the collision.",
        prompt: "A 1 kg cart moving at 8 m/s sticks to a 3 kg cart at rest. The joined carts then compress an ideal spring with \\(k=64\\,N/m\\) on a frictionless surface. Maximum compression is:",
        options: {A:"0.50 m", B:"0.71 m", C:"1.00 m", D:"2.00 m"},
        visual: {type:"momentum-collision", variant:"stick"}
      },
      {
        id: "fs-09", stage: "Core", timeLimitSec: 180, skill: "Impulse · momentum change", difficulty: "Hard",
        description: "The signed area under the force-time pulse is the impulse.",
        prompt: "A 2 kg object initially moves at -3 m/s. A force-time graph is a positive triangle of base 0.40 s and height 100 N. The final velocity is:",
        options: {A:"2 m/s", B:"4 m/s", C:"5 m/s", D:"7 m/s"},
        visual: {type:"momentum-collision", variant:"impulse"}
      },
      {
        id: "fs-10", stage: "Final", timeLimitSec: 240, skill: "Vertical loop · critical contact", difficulty: "Final",
        description: "Combine the top-of-loop contact condition with conservation of energy.",
        prompt: "A small block starts from rest at height h above the bottom of a frictionless loop of radius R. What minimum h keeps the block in contact throughout the loop?",
        options: {A:"2R", B:"5R/2", C:"3R", D:"4R"},
        visual: {type:"orbit", variant:"vertical-circle"}
      },
      {
        id: "fs-11", stage: "Sprint", timeLimitSec: 120, skill: "Orbit scaling · Kepler", difficulty: "Hard",
        description: "Use \\(v\\propto r^{-1/2}\\) and \\(T\\propto r^{3/2}\\) as ratios.",
        prompt: "A satellite moves from a circular orbit of radius r to one of radius 9r around the same planet. Its new orbital speed and period are:",
        options: {A:"3v and 3T", B:"v/9 and 9T", C:"v/3 and 27T", D:"v/3 and 9T"},
        visual: {type:"orbit", variant:"kepler"}
      },
      {
        id: "fs-12", stage: "Core", timeLimitSec: 210, skill: "Statics · torque balance", difficulty: "Hard",
        description: "Take torques about the hinge so the hinge force disappears from the rotational equation.",
        prompt: "A uniform 4 m horizontal beam weighs 200 N and is hinged at its left end. A 300 N load hangs 3 m from the hinge. A cable attached to the right end makes 30° above the beam. For equilibrium, the cable tension is:",
        options: {A:"325 N", B:"400 N", C:"500 N", D:"650 N"},
        visual: {type:"lever", variant:"seesaw"}
      },
      {
        id: "fs-13", stage: "Core", timeLimitSec: 180, skill: "Rotation · rolling without slipping", difficulty: "Hard",
        description: "Rotational inertia reduces translational acceleration differently for different shapes.",
        prompt: "A solid disk and a thin hoop have the same mass and radius and roll without slipping from rest down the same incline. Which statement is correct?",
        options: {A:"They arrive together because their masses are equal", B:"The disk arrives first because its rotational inertia factor is smaller", C:"The hoop arrives first because more mass is far from the axis", D:"The result depends only on the radius"}
      },
      {
        id: "fs-14", stage: "Sprint", timeLimitSec: 150, skill: "Buoyancy · fully submerged equilibrium", difficulty: "Hard",
        description: "Compare buoyant force and weight; the extra force must oppose the net upward force.",
        prompt: "An object has volume 0.010 m³ and density 800 kg/m³. It is held fully submerged in water of density 1000 kg/m³. Use \\(g=10\\,m/s^2\\). The external force required to keep it at rest is:",
        options: {A:"20 N downward", B:"20 N upward", C:"80 N downward", D:"100 N downward"},
        visual: {type:"fluids", variant:"ice"}
      },
      {
        id: "fs-15", stage: "Core", timeLimitSec: 210, skill: "Continuity + Bernoulli", difficulty: "Final",
        description: "Use continuity first to find the second speed, then Bernoulli for the pressure difference.",
        prompt: "Water flows steadily through a horizontal pipe. Section 1 has twice the area of section 2 and \\(v_1=3\\,m/s\\). For \\(\\rho=1000\\,kg/m^3\\), the pressure difference \\(P_1-P_2\\) is:",
        options: {A:"4.5 kPa", B:"9.0 kPa", C:"13.5 kPa", D:"18.0 kPa"},
        visual: {type:"fluids", variant:"continuity"}
      },
      {
        id: "fs-16", stage: "Final", timeLimitSec: 240, skill: "Collision + projectile", difficulty: "Final",
        description: "Use momentum for the collision and projectile motion only after the combined block leaves the table.",
        prompt: "A projectile of mass m moving horizontally at 12 m/s embeds in a block of mass 3m at rest on the edge of a frictionless table 5 m high. Use \\(g=10\\,m/s^2\\). How far from the table edge does the combined object land?",
        options: {A:"1.5 m", B:"3.0 m", C:"6.0 m", D:"12.0 m"},
        visual: {type:"momentum-collision", variant:"stick"}
      },
      {
        id: "fs-17", stage: "Sprint", timeLimitSec: 120, skill: "Braking distance · scaling", difficulty: "Hard",
        description: "With the same friction-limited deceleration, stopping distance scales with the square of speed.",
        prompt: "A car on a level road can brake with maximum deceleration \\(a=\\mu g\\), where \\(\\mu=0.50\\) and \\(g=10\\,m/s^2\\). From 30 m/s, its minimum stopping distance is:",
        options: {A:"30 m", B:"45 m", C:"60 m", D:"90 m"}
      },
      {
        id: "fs-18", stage: "Final", timeLimitSec: 300, skill: "Ballistic pendulum · momentum + energy", difficulty: "Final",
        description: "Do not conserve kinetic energy during the collision; conserve momentum there, then energy during the rise.",
        prompt: "A projectile of mass m embeds in a stationary block of mass 4m. The combined system rises to a maximum vertical height of 0.80 m. Use \\(g=10\\,m/s^2\\). The projectile's initial speed was:",
        options: {A:"8 m/s", B:"16 m/s", C:"20 m/s", D:"25 m/s"},
        visual: {type:"momentum-collision", variant:"stick"}
      },
      {
        id: "fs-19", stage: "Final", timeLimitSec: 240, skill: "Energy · friction + spring", difficulty: "Final",
        description: "Track mechanical energy across a rough segment before the spring stores the remaining energy.",
        prompt: "A 2 kg block starts from rest at height 2.0 m, descends a frictionless track, crosses a 4.0 m rough horizontal section with \\(\\mu_k=0.25\\), then compresses a spring of \\(k=100\\,N/m\\). Use \\(g=10\\,m/s^2\\). Maximum compression is approximately:",
        options: {A:"0.45 m", B:"0.63 m", C:"0.89 m", D:"1.26 m"},
        visual: {type:"energy-track", variant:"spring"}
      },
      {
        id: "fs-20", stage: "Final", timeLimitSec: 240, skill: "Loop dynamics · energy + Newton II", difficulty: "Final",
        description: "First obtain the speed at the top from energy; then use the radial force equation.",
        prompt: "A block starts from rest at height 3R above the bottom of a frictionless vertical loop of radius R. At the top of the loop, the normal force on the block is:",
        options: {A:"mg", B:"2mg", C:"3mg", D:"4mg"},
        visual: {type:"orbit", variant:"vertical-circle"}
      }
    ]
  });
})();
