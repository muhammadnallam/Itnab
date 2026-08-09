# Error Handling Convention (HTTP API)

## Goal

Errors are thrown once as **domain error classes** (`server/lib/errors.js`) and
converted to responses by **one global Express middleware** in `server.js`.
Routes are thin and never wrap service calls in try/catch — they let errors bubble
to the global handler.

## Error classes (`server/lib/errors.js`)

| Class                 | Status | Purpose                                             |
| --------------------- | ------ | --------------------------------------------------- |
| `ValidationError`     | 400    | Invalid input (bad params/body). Optional `field`.  |
| `AuthenticationError` | 401    | No/invalid session.                                 |
| `AuthorizationError`  | 403    | Authenticated but not allowed (e.g. not the owner). |
| `NotFoundError`       | 404    | Resource does not exist.                            |
| `InternalError`       | 500    | Known-but-unexpected server failure.                |

All extend `Error`, each carries a numeric `.status`.

## Global error middleware (`server/server.js`)

```js
app.use((err, req, res, next) => {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
});
Shaped errors → { error } with their status; anything else is logged once and
returns the generic 500 message.
Reaching the middleware
- Wrap every async handler with asyncErrorHandler — it catch(next)s rejections.
- requireAuth (plain async middleware) calls next(new AuthenticationError("بيانات الدخول غير صالحة")).
Service conventions
- Throw the domain classes; never throw new Error(...).
- Map Prisma errors, rethrow everything else:
- P2002 (unique) → ValidationError
- P2025 (not found) → NotFoundError
- Do not console.error in services (the global middleware logs once).
- Use findUniqueOrThrow + P2025 mapping when a missing row should 404.
import { Prisma } from "../../lib/generated/prisma/client.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";

try {
    return await prisma.user.findUniqueOrThrow({ where: { email } });
} catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new NotFoundError("المستخدم غير موجود");
    }
    throw e;
}
Route conventions
- Thin handlers: const x = await service(...); res.json(x);.
- Validate with zod safeParse; on failure throw ValidationError so it flows
through the global handler:
const parsed = schema.safeParse(req.body);
if (!parsed.success)
    throw new ValidationError(parsed.error.issues[0].message);
- (Legacy variants exist: some user routes return res.status(400).json({ error })
directly; some middleware call next(new ValidationError(...)). Both yield the
same 400 { error } shape — prefer throwing/next for consistency going forward.)
API envelope (the client contract)
- Success: whatever the handler returns.
- Error: always { "error": "<message>" } + its status.
- client/lib/api.js reads json.error and throws Error(json.error) — keep it consistent.
Checklist for new modules
1. *.schema.js — zod schemas (body + query params).
2. *.service.js — throw ValidationError/NotFoundError; map P2002/P2025; rethrow the rest; no logging.
3. *.routes.js — thin handlers in asyncErrorHandler; throw ValidationError on bad input.
4. Mount in server.js. No inline try/catch around service calls.
```
