/**
 * Bounding box with points as follows:
 *
 * (x, y) ---------- (x + w, y)
 *    |                   |
 *    |                   |
 *    |                   |
 *    |                   |
 *    |                   |
 *    |                   |
 *    |                   |
 * (x, y + h) ----- (x + w, y + h)
 */
interface BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;
}
