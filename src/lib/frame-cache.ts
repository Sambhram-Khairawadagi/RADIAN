/** Direction-aware, bounded bitmap cache with at most three concurrent loads. */
export class FrameCache {
  private images = new Map<number, ImageBitmap>();
  private queue: number[] = [];
  private pending = new Map<number, AbortController>();
  private retryAfter = new Map<number, number>();
  private active = 0;
  private disposed = false;
  private direction = 1;
  private displayed = -1;
  private requestedAt = 0;
  private loadMs = 80;
  target = 0;
  constructor(
    private base: string,
    private count: number,
    private limit: number,
    private ready: () => void,
  ) {}
  request(index: number) {
    if (this.disposed) return;
    const next = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    if (next === this.target && this.requestedAt !== 0) return;
    const now = performance.now();
    const elapsed = now - this.requestedAt;
    const velocity = elapsed > 0 && elapsed < 200 ? (next - this.target) / elapsed : 0;
    if (next !== this.target) this.direction = Math.sign(next - this.target);
    this.requestedAt = now;
    this.target = next;
    // Keep a small reverse buffer, but spend most of the cache on the direction
    // of travel. Rebuild priorities on every seek rather than draining old work.
    const lead = Math.min(this.limit - 4, Math.ceil(Math.abs(velocity) * this.loadMs));
    const predicted = next + lead * this.direction;
    const order = [next, predicted];
    for (let step = 1; step < this.limit - 3; step++) {
      order.push(predicted + step * this.direction, next + step * this.direction);
      if (step <= 3) order.push(next - step * this.direction);
    }
    this.queue = [...new Set(order)].filter(i =>
      i >= 0 && i < this.count && Math.abs(i - next) < this.limit && !this.images.has(i) &&
      !this.pending.has(i) && (this.retryAfter.get(i) ?? 0) <= now,
    );
    // A large jump must not wait for unrelated downloads to finish.
    for (const [i, controller] of this.pending) {
      if (Math.abs(i - next) >= this.limit) controller.abort();
    }
    this.pump();
  }
  closest() {
    let best: ImageBitmap | undefined;
    let distance = Infinity;
    let index = -1;
    for (const [i, img] of this.images) {
      // Never show an out-of-order completion that moves away from the target
      // or overshoots it. Hold the last painted image until progress is possible.
      const from = this.displayed < 0 ? 0 : this.displayed;
      if (i !== this.target && this.displayed >= 0 && (i - from) * this.direction < 0) continue;
      if (i < Math.min(from, this.target) || i > Math.max(from, this.target)) continue;
      const d = Math.abs(i - this.target);
      if (d < distance) {
        distance = d;
        best = img;
        index = i;
      }
    }
    return { image: best, index };
  }
  markDisplayed(index: number) {
    this.displayed = index;
  }
  get size() {
    return this.images.size;
  }
  private pump() {
    while (!this.disposed && this.active < 3 && this.queue.length) {
      const index = this.queue.shift()!;
      if (this.images.has(index) || this.pending.has(index)) continue;
      this.active++;
      const controller = new AbortController();
      const startedAt = performance.now();
      this.pending.set(index, controller);
      fetch(`${this.base}/frame-${String(index).padStart(4, "0")}.webp`, {
        signal: controller.signal,
        cache: "force-cache",
      })
        .then((r) => {
          if (!r.ok) throw new Error("Frame unavailable");
          return r.blob();
        })
        .then((blob) => createImageBitmap(blob))
        .then((bitmap) => {
          if (this.disposed || controller.signal.aborted) {
            bitmap.close();
            return;
          }
          this.retryAfter.delete(index);
          this.loadMs = this.loadMs * 0.7 + (performance.now() - startedAt) * 0.3;
          this.images.set(index, bitmap);
          while (this.images.size > this.limit) {
            const farthest = [...this.images.keys()]
              .filter(i => i !== this.displayed)
              .sort((a, b) => Math.abs(b - this.target) - Math.abs(a - this.target))[0];
            this.images.get(farthest)?.close();
            this.images.delete(farthest);
          }
          this.ready();
        })
        .catch(() => {
          // Missing/corrupt frames must not cause a retry storm on every scroll.
          if (!controller.signal.aborted) this.retryAfter.set(index, performance.now() + 5000);
        })
        .finally(() => {
          this.active--;
          this.pending.delete(index);
          // A seek can return to an aborted frame before its promise settles.
          // Requeue the current target once its old request releases the slot.
          if (!this.disposed && !this.images.has(this.target) &&
              !this.pending.has(this.target) && !this.queue.includes(this.target) &&
              (this.retryAfter.get(this.target) ?? 0) <= performance.now()) {
            this.queue.unshift(this.target);
          }
          this.pump();
        });
    }
  }
  dispose() {
    this.disposed = true;
    this.pending.forEach(c => c.abort());
    this.images.forEach(img => img.close());
    this.images.clear();
    this.queue = [];
    this.retryAfter.clear();
  }
}
