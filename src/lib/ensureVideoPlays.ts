/**
 * Guarantee a muted background <video> starts playing — including on iPhones in
 * Low Power Mode, where iOS blocks muted autoplay system-wide (frozen first
 * frame / play-button overlay). A muted play() issued inside a REAL user gesture
 * is still honored in LPM, so the module-level backstop below kicks every
 * registered video on the first touchstart/scroll.
 *
 * Scope: this helper only handles STARTING playback. Each component keeps its own
 * IntersectionObserver / inView pause-and-resume logic exactly as-is.
 */

// Videos that have not yet been confirmed playing, shared across all callers so a
// single first-gesture handler can kick every one of them at once.
const pending = new Set<HTMLVideoElement>();
let gestureArmed = false;

function fireGesture() {
  // First real user gesture — the LPM-legal moment to start every pending video.
  for (const v of pending) void v.play().catch(() => {});
  disarmGesture();
}

function disarmGesture() {
  if (!gestureArmed) return;
  gestureArmed = false;
  window.removeEventListener("touchstart", fireGesture);
  window.removeEventListener("scroll", fireGesture);
}

function armGesture() {
  if (gestureArmed || typeof window === "undefined") return;
  gestureArmed = true;
  window.addEventListener("touchstart", fireGesture, { passive: true });
  window.addEventListener("scroll", fireGesture, { passive: true });
}

const RETRY_EVENTS = ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"];

export function ensureVideoPlays(video: HTMLVideoElement): () => void {
  // iOS inline + muted, in BOTH property and attribute form (Safari honors the
  // attribute for autoplay eligibility; the property for runtime mute state).
  video.muted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  // Nothing buffered yet — nudge the network fetch so the retry events can fire.
  if (video.readyState === 0) {
    try {
      video.load();
    } catch {
      /* ignore */
    }
  }

  let played = false;

  const attempt = () => {
    if (played) return;
    void video.play().catch(() => {});
  };

  const detach = () => {
    for (const ev of RETRY_EVENTS) video.removeEventListener(ev, attempt);
    video.removeEventListener("playing", onPlaying);
  };

  function onPlaying() {
    // Confirmed playing — stop retrying and drop out of the gesture registry.
    played = true;
    detach();
    pending.delete(video);
    if (pending.size === 0) disarmGesture();
  }

  for (const ev of RETRY_EVENTS) video.addEventListener(ev, attempt);
  video.addEventListener("playing", onPlaying);

  // Try right now (works when autoplay is allowed; harmlessly rejects in LPM)...
  attempt();
  // ...and register for the first-gesture backstop that defeats LPM.
  pending.add(video);
  armGesture();

  return () => {
    detach();
    pending.delete(video);
    if (pending.size === 0) disarmGesture();
  };
}
