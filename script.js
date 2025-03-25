const img = document.getElementById("secretImage");

// Fallback threshold
const brightnessThreshold = 50;

// GSAP animation setup
function revealImage() {
  gsap.to(img, { opacity: 1, duration: 1.5, ease: "power2.out" });
}

// Ambient Light Sensor (if supported)
if ('AmbientLightSensor' in window) {
  try {
    const sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', () => {
      if (sensor.illuminance > brightnessThreshold) {
        revealImage();
      }
    });
    sensor.addEventListener('error', (event) => {
      console.error("Ambient Light Sensor error:", event.error.name);
    });
    sensor.start();
  } catch (err) {
    console.warn("Ambient Light Sensor not usable:", err);
  }
} else {
  // Fallback: simulate check based on contrast detection trick
  const testBrightness = () => {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    const [r, g, b] = bg.match(/\d+/g).map(Number);
    const perceivedBrightness = Math.sqrt(
      0.299 * r * r + 0.587 * g * g + 0.114 * b * b
    );
    if (perceivedBrightness < 30) {
      // Prompt user interaction or time-based trigger
      setTimeout(() => revealImage(), 6000); // Slow reveal
    }
  };

  // Call on load
  testBrightness();

  // Also allow user to click anywhere as a trigger
  document.body.addEventListener("click", () => {
    revealImage();
  });
}
