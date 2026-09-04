export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };
