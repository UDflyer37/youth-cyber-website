"use client";

import type { BlazeFaceModel, NormalizedFace } from "@tensorflow-models/blazeface";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

type Status = "idle" | "loading" | "running" | "error";

const PALETTE = ["#ff4d6d", "#ffb703", "#2ec4b6", "#4dabf7", "#b197fc", "#5c5470"];

/** The paint is kept in face-space, so it can be re-projected every frame. */
const PAINT_SIZE = 640;

type FaceBox = { x: number; y: number; w: number; h: number; angle: number };

function toFaceBox(prediction: NormalizedFace | undefined): FaceBox | null {
  if (!prediction) return null;
  const start = prediction.topLeft as [number, number];
  const end = prediction.bottomRight as [number, number];
  const landmarks = prediction.landmarks as [number, number][];
  const rightEye = landmarks[0];
  const leftEye = landmarks[1];
  return {
    x: start[0],
    y: start[1],
    w: Math.max(end[0] - start[0], 1),
    h: Math.max(end[1] - start[1], 1),
    angle:
      rightEye && leftEye
        ? Math.atan2(leftEye[1] - rightEye[1], leftEye[0] - rightEye[0])
        : 0,
  };
}

/**
 * Paints the current frame's faces: the drawing first (so it sits under the
 * guides), then the dashed box and the landmark dots.
 */
function drawFaces(
  context: CanvasRenderingContext2D,
  predictions: NormalizedFace[],
  paint: HTMLCanvasElement | null,
) {
  for (const prediction of predictions) {
    const box = toFaceBox(prediction);
    if (!box) continue;

    if (paint) {
      context.save();
      context.translate(box.x + box.w / 2, box.y + box.h / 2);
      context.rotate(box.angle);
      context.drawImage(paint, -box.w / 2, -box.h / 2, box.w, box.h);
      context.restore();
    }

    context.strokeStyle = "#5ce1c3";
    context.lineWidth = 4;
    context.setLineDash([14, 10]);
    context.strokeRect(box.x, box.y, box.w, box.h);
    context.setLineDash([]);

    for (const landmark of prediction.landmarks as [number, number][]) {
      context.beginPath();
      context.arc(landmark[0], landmark[1], 4, 0, Math.PI * 2);
      context.fillStyle = "#ffd166";
      context.fill();
      context.strokeStyle = "rgba(23,23,46,0.65)";
      context.lineWidth = 1.5;
      context.stroke();
    }
  }
}

const PIPELINE = [
  { icon: "camera" as const, label: "Camera", caption: "reads frames locally" },
  { icon: "blocks" as const, label: "Light pixels", caption: "a grid of numbers" },
  { icon: "sparkles" as const, label: "Trained model", caption: "looks for patterns" },
  { icon: "face" as const, label: "Landmarks", caption: "a guess, not a measurement" },
];

const HOW_IT_WORKS = [
  {
    title: "A model is a pattern finder",
    body: "This model was trained on thousands of face photos. It learned which arrangements of light and dark usually mean “face”, and it looks for those arrangements in your video.",
  },
  {
    title: "Landmarks are guesses",
    body: "The dots mark the eyes, nose, ears, and mouth. They aren't measured. They are the model's best guess, which is why they can wobble.",
  },
  {
    title: "Nothing leaves this device",
    body: "The video is read straight from your camera into this browser tab. There is no upload, no recording, and no server involved.",
  },
];

export function FaceLab() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const faceRef = useRef<FaceBox | null>(null);
  const modelRef = useRef<BlazeFaceModel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const drawingRef = useRef({ active: false, x: 0.5, y: 0.5 });
  const activeRef = useRef(false);
  const sessionRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [faces, setFaces] = useState(0);
  const [color, setColor] = useState(PALETTE[0]);
  const [size, setSize] = useState(10);
  const [erasing, setErasing] = useState(false);

  const colorRef = useRef(color);
  const sizeRef = useRef(size);
  const erasingRef = useRef(erasing);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);
  useEffect(() => {
    erasingRef.current = erasing;
  }, [erasing]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stop() {
    activeRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (paintRef.current) {
      paintRef.current.getContext("2d")?.clearRect(0, 0, PAINT_SIZE, PAINT_SIZE);
    }
    faceRef.current = null;
    setFaces(0);
    setStatus("idle");
    setMessage("");
  }

  async function start() {
    setStatus("loading");
    setMessage("Waking up the AI model…");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      if (!modelRef.current) {
        const tf = await import("@tensorflow/tfjs");
        await tf.ready();
        const blazeface = await import("@tensorflow-models/blazeface");
        modelRef.current = await blazeface.load({
          maxFaces: 4,
          inputWidth: 128,
          inputHeight: 128,
        });
      }

      setMessage("Waiting for camera permission…");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("missing-elements");

      video.srcObject = stream;
      await video.play();

      await new Promise<void>((resolve) => {
        if (video.readyState >= 1 && video.videoWidth > 0) {
          resolve();
          return;
        }
        video.onloadedmetadata = () => resolve();
      });

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      // The canvases only exist in the running state, so switch to it first and
      // wait one frame for React to commit before touching their refs.
      setStatus("running");
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const canvas = canvasRef.current;
      const drawCanvas = drawCanvasRef.current;
      if (!canvas || !drawCanvas) throw new Error("missing-elements");

      canvas.width = width;
      canvas.height = height;
      drawCanvas.width = width;
      drawCanvas.height = height;

      if (!paintRef.current) {
        const paint = document.createElement("canvas");
        paint.width = PAINT_SIZE;
        paint.height = PAINT_SIZE;
        paintRef.current = paint;
      }

      setMessage("Tracking. Draw something and it will follow your face.");

      // One pass per animation frame: draw the video and the paint from the
      // previous predictions first, then run inference. Painting before the
      // await is what stops the drawing from blinking, and stopping at one
      // inference per frame keeps the page responsive on slow machines.
      let predictions: NormalizedFace[] = [];
      const session = ++sessionRef.current;
      activeRef.current = true;

      const tick = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !activeRef.current || sessionRef.current !== session) return;

        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          drawFaces(context, predictions, paintRef.current);
        }

        const model = modelRef.current;
        if (model) {
          try {
            predictions = await model.estimateFaces(video, false);
            setFaces((current) => (current === predictions.length ? current : predictions.length));
            faceRef.current = toFaceBox(predictions[0]);
          } catch {
            // A dropped frame is fine; the next pass tries again.
          }
        }

        if (activeRef.current && sessionRef.current === session) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      const unsupported = error instanceof Error && error.message === "unsupported";
      let detail =
        "Something got in the way of starting the camera. Check your browser permissions and try again.";

      if (unsupported) {
        detail = "This browser can't reach a camera from a web page. Try Chrome, Edge, Firefox, or Safari.";
      } else if (name === "NotAllowedError" || name === "SecurityError") {
        detail =
          "Camera access was blocked. Click the camera icon in your browser's address bar, allow access, then press the button again.";
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        detail = "No camera was found on this device. A laptop with a webcam works best.";
      } else if (name === "NotReadableError") {
        detail = "Your camera is busy in another app or tab. Close it and try again.";
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStatus("error");
      setMessage(detail);
    }
  }

  function positionOnDrawCanvas(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  /**
   * Screen point → face-space point. The face box is drawn rotated by the eye
   * line, so the same rotation is undone here; otherwise a tilted head would
   * make the brush land away from the cursor.
   */
  function toFaceSpace(x: number, y: number) {
    const face = faceRef.current;
    if (!face) return null;
    const centerX = face.x + face.w / 2;
    const centerY = face.y + face.h / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const cos = Math.cos(-face.angle);
    const sin = Math.sin(-face.angle);
    const ux = dx * cos - dy * sin;
    const uy = dx * sin + dy * cos;
    const nx = 0.5 + ux / face.w;
    const ny = 0.5 + uy / face.h;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return null;
    return { nx, ny };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic or already-released pointers cannot be captured; drawing
      // still works without it.
    }
    const point = positionOnDrawCanvas(event);
    const mapped = toFaceSpace(point.x, point.y);
    if (!mapped) {
      drawingRef.current.active = false;
      return;
    }
    drawingRef.current = { active: true, x: mapped.nx, y: mapped.ny };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current.active) return;
    const paint = paintRef.current;
    const face = faceRef.current;
    const context = paint?.getContext("2d");
    if (!paint || !context || !face) return;

    const point = positionOnDrawCanvas(event);
    const mapped = toFaceSpace(point.x, point.y);
    if (!mapped) return;

    // Keep the stroke a consistent width on screen, whatever the face size:
    // one texture pixel covers face.w / PAINT_SIZE screen pixels.
    const brush =
      (erasingRef.current ? sizeRef.current * 2.5 : sizeRef.current) * (PAINT_SIZE / face.w);

    context.globalCompositeOperation = erasingRef.current ? "destination-out" : "source-over";
    context.beginPath();
    context.moveTo(drawingRef.current.x * PAINT_SIZE, drawingRef.current.y * PAINT_SIZE);
    context.lineTo(mapped.nx * PAINT_SIZE, mapped.ny * PAINT_SIZE);
    context.strokeStyle = colorRef.current;
    context.lineWidth = Math.min(120, Math.max(1.5, brush));
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    drawingRef.current = { active: true, x: mapped.nx, y: mapped.ny };
  }

  function handlePointerUp() {
    drawingRef.current.active = false;
  }

  function clearDrawing() {
    const paint = paintRef.current;
    const context = paint?.getContext("2d");
    if (paint && context) context.clearRect(0, 0, paint.width, paint.height);
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="camera-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="camera-heading"
            className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            The webcam lab
          </h2>
          <span className="tag">
            <Icon name="lock" className="size-3.5" /> Video never leaves this device
          </span>
        </div>

        <div className="mail-window mt-4">
          <div className="mail-chrome">
            <span className="chrome-dot" />
            <span className="chrome-dot" />
            <span className="chrome-dot" />
            <p className="ml-2 flex-1 text-[0.68rem] font-bold text-ink/45">camera · local only</p>
            {status === "running" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-paper">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-80" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                </span>
                {faces > 0 ? `${faces} face${faces > 1 ? "s" : ""}` : "searching"}
              </span>
            ) : null}
          </div>

          {status === "running" ? (
            <>
              <div className="relative aspect-[4/3] w-full bg-ink">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 size-full"
                  aria-label="Live camera feed with face detection boxes drawn on top"
                />
                <canvas
                  ref={drawCanvasRef}
                  className="draw-surface absolute inset-0 size-full"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  aria-label="Drawing canvas. Draw here to paint on top of the detected face."
                />
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-paper/80 backdrop-blur">
                  {faces > 0 ? "Draw on the dashed box" : "Looking for a face…"}
                </span>
              </div>

              <p className="border-t border-line bg-paper/70 px-4 py-2 text-[0.74rem] font-semibold text-muted">
                Paint inside the dashed box. It is stored on the face, so it travels with you and tilts when
                you tilt your head.
              </p>

              <div className="flex flex-col gap-3 border-t border-line bg-cream/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PALETTE.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => {
                        setColor(swatch);
                        setErasing(false);
                      }}
                      aria-label={`Use colour ${swatch}`}
                      aria-pressed={color === swatch && !erasing}
                      className={`size-8 rounded-full ring-2 transition-transform hover:scale-110 ${
                        color === swatch && !erasing ? "ring-ink" : "ring-white"
                      }`}
                      style={{ background: swatch, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
                    />
                  ))}
                  <span className="mx-0.5 h-6 w-px bg-line" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setErasing((current) => !current)}
                    aria-pressed={erasing}
                    className={`grid size-8 place-items-center rounded-full border transition-colors ${
                      erasing ? "border-ink bg-ink text-paper" : "border-line bg-white text-muted hover:text-ink"
                    }`}
                    aria-label="Eraser"
                  >
                    <Icon name="eraser" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={clearDrawing}
                    className="grid size-8 place-items-center rounded-full border border-line bg-white text-muted transition-colors hover:text-ink"
                    aria-label="Clear drawing"
                  >
                    <Icon name="refresh" className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <label htmlFor="brush" className="text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Brush
                  </label>
                  <input
                    id="brush"
                    type="range"
                    min={2}
                    max={40}
                    value={size}
                    onChange={(event) => setSize(Number(event.target.value))}
                    className="range w-24"
                  />
                  <button type="button" onClick={stop} className="btn btn--light btn--sm">
                    <Icon name="stop" className="size-3.5" />
                    Stop
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid gap-6 px-5 py-8 sm:grid-cols-[1fr_15rem] sm:items-center sm:px-7 sm:py-10">
              <div>
                <h3 className="display-lg">
                  {status === "error" ? "The camera didn't start" : "Let's see what the AI sees"}
                </h3>
                <p
                  className={`mt-2 max-w-md text-[0.98rem] leading-relaxed ${
                    status === "error" ? "text-coral" : "text-muted"
                  }`}
                  aria-live="polite"
                >
                  {status === "error"
                    ? message
                    : status === "loading"
                      ? message
                      : "Press start, allow the camera, then draw on your screen. Your drawing sticks to your face as you move."}
                </p>

                {status !== "loading" ? (
                  <button
                    type="button"
                    onClick={start}
                    className="btn btn--accent btn--lg mt-5"


                  >
                    <Icon name="camera" className="size-5" />
                    {status === "error" ? "Try again" : "Start the camera"}
                  </button>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky/10 px-4 py-2 text-sm font-bold text-sky">
                    <span className="size-2 animate-ping rounded-full bg-sky" />
                    Loading the model…
                  </span>
                )}

                <p className="mt-4 flex max-w-sm items-start gap-2 text-[0.7rem] font-semibold text-muted">
                  <Icon name="lock" className="mt-px size-3.5 shrink-0 text-teal" />
                  Nothing is uploaded, saved, or shared. Close the tab and the camera stops.
                </p>
              </div>

              <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-[15rem]" aria-hidden="true">
                <rect x="8" y="8" width="224" height="184" rx="22" fill="#fffdf9" stroke="var(--color-line)" />
                <path
                  d="M42 68V50a12 12 0 0112-12h18M198 68V50a12 12 0 00-12-12h-18M42 132v18a12 12 0 0012 12h18M198 132v18a12 12 0 01-12 12h-18"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <ellipse cx="120" cy="100" rx="40" ry="48" fill="var(--accent)" opacity="0.12" />
                <ellipse cx="120" cy="100" rx="40" ry="48" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 7" />
                {[
                  [102, 86],
                  [138, 86],
                  [120, 104],
                  [100, 118],
                  [140, 118],
                ].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="var(--accent)" />
                ))}
                <path d="M106 126c6 7 22 7 28 0" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                <path d="M24 152h192" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 8" opacity="0.5" />
              </svg>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="pipeline-heading">
        <h2
          id="pipeline-heading"
          className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-muted"
        >
          What happens to a frame
        </h2>
        <ol className="mt-3 flex flex-wrap items-stretch border-y border-line py-4">
          {PIPELINE.map((step, index) => (
            <li key={step.label} className="flex min-w-[9.5rem] flex-1 items-center gap-2.5 px-2 py-1.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky/10 text-sky">
                <Icon name={step.icon} className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[0.82rem] font-bold leading-tight">{step.label}</span>
                <span className="block text-[0.68rem] leading-snug text-muted">{step.caption}</span>
              </span>
              {index < PIPELINE.length - 1 ? (
                <Icon name="arrow-right" className="ml-auto hidden size-3.5 shrink-0 text-muted/50 lg:block" />
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {HOW_IT_WORKS.map((item, index) => (
          <div key={item.title} className="border-t border-line pt-4">
            <span className="numeral text-2xl text-sky/50">0{index + 1}</span>
            <h3 className="mt-1.5 font-display text-[1rem] font-bold leading-snug">{item.title}</h3>
            <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-line pt-8">
        <h2 className="display-lg">Why does AI need so much data?</h2>
        <p className="mt-2 max-w-2xl text-[0.96rem] leading-relaxed text-muted">
          A model doesn&apos;t understand faces the way you do. It learns from examples: show it millions of
          photos labelled “face” and “not a face” and it adjusts until it gets them right. The catch is that it
          also learns the biases in that data, which is why face recognition works better for some people than
          others, and why researchers spend so long checking training sets. This one is small enough to run on a
          phone, and it still gets things wrong.
        </p>
      </section>

      <video ref={videoRef} className="hidden" playsInline muted aria-hidden="true" />
    </div>
  );
}
