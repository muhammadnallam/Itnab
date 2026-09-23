# Itnab

An Arabic-first publishing platform for readers and writers to share culture and knowledge.

## Overview

Itnab is a web platform where Arabic writers publish long-form articles and readers discover,
follow, and discuss them. It is built around a custom rich-text editor designed for Arabic
content, and is deployed in production at [itnab.com](https://itnab.com) for real users.

The project is a pnpm monorepo with three parts: a Next.js frontend, an Express API, and a set
of shared packages (editor schema, constants, and Arabic text normalization) consumed by both.

<img width="1024" height="728" alt="image" src="https://github.com/user-attachments/assets/e03ba378-213e-46a9-9a56-092d9c7623c9" />

## Features

- **Arabic-first rich-text editor** built on TipTap/ProseMirror, with a structured JSON document
  model rather than raw HTML.
- **Custom editor nodes**: a protected article title and description that cannot be deleted, an
  inline Quran-verse node, and a drag-and-drop image upload node with progress and cancellation.
- **Threaded comments** (up to three levels deep) with likes, editing, and soft deletion.
- **Social interactions**: follow authors, like/dislike, save, and share articles.
- **Reading lists** for organizing saved articles into collections.
- **Personalized feeds**: top-ranked, latest, topic-based, and a subscriptions feed.
- **Grouped notifications** for likes, follows, and comments.
- **Arabic-aware search** that normalizes diacritics and letter variants (alef, ta-marbuta,
  hamza) before matching.
- **PDF export** of articles, rendered server-side with Arabic typography.

## Design decisions

**Arabic-first, not Arabic-added.** Right-to-left layout is set at the document root and on
content containers, and the default text alignment in the editor is right-aligned. This means
the product reads naturally in Arabic by default instead of treating RTL as a translation layer
applied afterward.

**A structured editor over a simpler one.** The editor uses TipTap/ProseMirror because articles
need a structured document model. Storing content as JSON (not HTML) lets the server validate
the document against a schema, sanitize it, and render it consistently to both the web page and
a PDF. Custom nodes were written where the default extensions didn't fit the product: protected
title/description nodes, Quran verses, and image uploads.

**Shared packages to prevent drift.** The editor schema lives in `@itnab/tiptap` and is imported
by both the frontend and the API. The API uses the same schema to validate incoming articles, so
the document shape cannot diverge between the two sides.

**Optimistic interactions.** Likes, saves, and follows update the UI immediately and roll back on
failure, so common actions feel instant rather than waiting on a round trip.

**A relational database with typed access.** The data is heavily relational (follows, likes,
bookmarks, saved lists, nested comments), so PostgreSQL with Prisma was a natural fit — it gives
typed queries and a migration workflow.

**A library for authentication.** Sessions, password hashing, and cookies are handled by
BetterAuth rather than hand-rolled, which keeps security-sensitive code out of the application.

**Content ranking.** Articles are scored by a gravity-style formula that combines engagement
(views, likes, comments, shares, saves) with time decay and a cold-start multiplier, so the "top"
feed surfaces fresh, relevant content instead of pure chronology.

## Tech stack

**Frontend**

- Next.js 16 (App Router), React 19
- TanStack Query v5 for server state
- Tailwind CSS 4
- TipTap / ProseMirror for the editor
- BetterAuth client

**Backend**

- Express 5 (ESM)
- Prisma 7 with PostgreSQL
- BetterAuth for authentication
- Zod for request validation
- Cloudinary for image hosting
- Puppeteer for PDF generation
- `node-cron` for scheduled score recomputation

**Shared packages**

- `@itnab/tiptap` — editor extensions and custom node schemas
- `@itnab/constants` — shared topic tags
- `@itnab/normalize` — Arabic text normalization

**Tooling & deployment**

- pnpm workspaces (monorepo)
- Docker multi-stage builds (separate client and server images)
- Coolify for hosting, reverse proxying, and TLS

## Live demo

[itnab.com](https://itnab.com)

## Credits

Built by Mohamed Nasser. Arabic fonts provided by Google Fonts (Noto family, Cairo).
