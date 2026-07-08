### Start S3 Playground Examples Command

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/s3.mdx

Command to start the S3 playground examples.

```bash
npm run playground:s3
```

---

### Indentation Style Examples

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Examples of configuring indentation with spaces or tabs.

```typescript
// Use 4 spaces for indentation (default: 2 spaces)
Markdown.configure({
    indentation: { style: "space", size: 4 },
});

// Use tabs for indentation
Markdown.configure({
    indentation: { style: "tab", size: 1 },
});
```

---

### Basic Setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Add the Markdown extension to your Tiptap editor.

```typescript
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";

const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [StarterKit, Markdown],
    content: "<p>Hello World!</p>",
});
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Install the Markdown extension using your preferred package manager.

```bash
npm install @tiptap/markdown
```

---

### Minimal setup with only three extensions

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/configure.mdx

This example shows the minimal setup for a Tiptap editor using Document, Paragraph, and Text extensions.

```js
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

new Editor({
    element: document.querySelector(".element"),
    extensions: [Document, Paragraph, Text],
});
```

---

### Basic Setup Example

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/slash-dropdown-menu.mdx

A simple example demonstrating the integration of SlashDropdownMenu into an editor.

```tsx
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu";

function MyEditor() {
    return (
        <div>
            <EditorContent editor={editor} />
            <SlashDropdownMenu editor={editor} />
        </div>
    );
}
```

---

### Install Tiptap and Hocuspocus dependencies

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/provider/examples.mdx

Install the required extensions for Tiptap with Hocuspocus.

```bash
npm install @hocuspocus/provider @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-caret yjs y-prosemirror
```

---

### Quick Start Development Setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/s3.mdx

Command to set up a complete local development environment with MinIO.

```bash
# Set up complete development environment
npm run dev:setup
```

---

### Tiptap editor setup (after migration)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-editorjs.mdx

Example of how to initialize a Tiptap editor, replacing the Editor.js setup, using the core Editor and StarterKit extension.

```ts
// Tiptap (after)
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
});
```

---

### Initialize Hocuspocus Server

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/usage.mdx

Example of initializing and starting the built-in Hocuspocus server.

```js
import { Server } from "@hocuspocus/server";

const server = new Server({
    port: 1234,
});

server.listen();
```

---

### Initial Content as Markdown

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Load Markdown content when creating the editor instance.

```typescript
const editor = new Editor({
    extensions: [StarterKit, Markdown],
    content: "# Hello World\n\nThis is **Markdown**!",
    contentType: "markdown",
});
```

---

### Minimal Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/task-list.mdx

Example of a minimal installation, importing TaskList directly from its specific path.

```js
import { Editor } from "@tiptap/core";
import { TaskList } from "@tiptap/extension-list/task-list";

new Editor({
    extensions: [TaskList],
});
```

---

### Verifying Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Check if the Markdown manager is available and try parsing/serializing Markdown.

```typescript
// Check if Markdown manager is available
console.log(editor.markdown); // Should log the MarkdownManager instance

// Try parsing
const json = editor.markdown.parse("# Hello");
console.log(json);
// { type: 'doc', content: [...] }

// Try serializing
const markdown = editor.markdown.serialize(json);
console.log(markdown);
// # Hello
```

---

### Configure and Start Hocuspocus Server (JavaScript)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/configuration.mdx

This snippet demonstrates the basic setup and configuration of a Hocuspocus server, including common options like port, timeout, and WebSocket payload limits. Call server.listen() to start the server.

```js
import { Server } from "@hocuspocus/server";

const server = new Server({
    name: "hocuspocus-fra1-01",
    port: 1234,
    timeout: 60000,
    debounce: 5000,
    maxDebounce: 30000,
    quiet: true,
    websocketOptions: { maxPayload: 1024 * 1024 },
});

server.listen();
```

---

### Minimal Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/table.mdx

Minimal installation example for the Table extension.

```js
import { Editor } from "@tiptap/core";
import { Table } from "@tiptap/extension-table/table";

new Editor({
    extensions: [Table],
});
```

---

### Migrating from Lexical editor setup to Tiptap

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-lexical.mdx

This example demonstrates how to replace a basic Lexical editor setup with a Tiptap editor, showing the before (Lexical) and after (Tiptap) configurations.

```tsx
// Lexical (before)
import { createEditor } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError: console.error,
};

function MyLexicalEditor() {
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<div>Enter some text...</div>}
            />
        </LexicalComposer>
    );
}

// Tiptap (after)
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
});
```

---

### Install Pro Extension globally

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/pro-extensions.mdx

Example of installing a Tiptap Pro extension after global authentication is configured.

```bash
npm install --save @tiptap-pro/extension-comments
```

---

### Marked Options

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Pass 'marked' options directly to the extension.

```typescript
Markdown.configure({
    markedOptions: {
        gfm: true, // GitHub Flavored Markdown
        breaks: false, // Convert \n to <br>
        pedantic: false, // Strict Markdown mode
    },
});
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/database.mdx

Install the database extension like this:

```bash
npm install @hocuspocus/extension-database
```

---

### Minimal Tiptap Placeholder extension installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/placeholder.mdx

Import and use the Placeholder extension directly for a minimal setup without additional configuration.

```js
import { Editor } from "@tiptap/core";
import { Placeholder } from "@tiptap/extensions/placeholder";

new Editor({
    extensions: [Placeholder],
});
```

---

### onSuggestionCreate

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for the onSuggestionCreate callback.

```js
TrackedChanges.configure({
    onSuggestionCreate: (suggestion) => {
        console.log("New suggestion created:", suggestion);
        // Update your UI, notify other users, etc.
    },
});
```

---

### Custom Marked Instance

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Use a custom version of 'marked' or pre-configure it.

```typescript
import { marked } from "marked";

// Configure marked
marked.setOptions({
    gfm: true,
    breaks: true,
});

// Use custom marked instance
Markdown.configure({
    marked: marked,
});
```

---

### onSuggestionAccept

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for the onSuggestionAccept callback.

```js
TrackedChanges.configure({
    onSuggestionAccept: (id) => {
        console.log("Suggestion accepted:", id);
    },
});
```

---

### TypeScript Errors Configuration

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/getting-started/installation.mdx

Example `tsconfig.json` configuration for resolving TypeScript errors.

```json
{
    "compilerOptions": {
        "moduleResolution": "node",
        "esModuleInterop": true
    }
}
```

---

### Usage

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/provider/install.mdx

Example demonstrating how to create a Y.js document and connect it to the Hocuspocus provider.

```js
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

const ydoc = new Y.Doc();

const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: "example-document",
    document: ydoc,
});
```

---

### Minimal example

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vanilla-javascript.mdx

Load Tiptap directly from a CDN using ES module imports for a setup without a build tool.

```html
<script type="module">
    import { Editor } from "https://esm.sh/@tiptap/core";
    import StarterKit from "https://esm.sh/@tiptap/starter-kit";

    new Editor({
        element: document.querySelector(".element"),
        extensions: [StarterKit],
        content: "<p>Hello from CDN!</p>",
    });
</script>

<div class="element"></div>
```

---

### Client-Side Tiptap Editor Setup for Tracked Changes (TSX)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/server-ai-toolkit/agents/tracked-changes.mdx

This example demonstrates how to configure a Tiptap editor on the client to display server-side AI tracked changes. It requires installing and adding the `ServerAiToolkit` and `TrackedChanges` extensions.

```tsx
import { useChat } from "@ai-sdk/react";
import { Collaboration } from "@tiptap/extension-collaboration";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    TrackedChanges,
    findSuggestions,
} from "@tiptap-pro/extension-tracked-changes";
import { TiptapCollabProvider } from "@tiptap-pro/provider";
import { ServerAiToolkit, getEditorContext } from "@tiptap/server-ai-toolkit";

export default function Page() {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ undoRedo: false }),
            Collaboration.configure({ document: doc }),
            TrackedChanges.configure({ enabled: false }),
            ServerAiToolkit,
        ],
    });

    // ... render editor and chat UI
}
```

---

### Using StarterKit

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/configure.mdx

Example of initializing the editor with the StarterKit.

```js
import StarterKit from "@tiptap/starter-kit";

new Editor({
    extensions: [StarterKit],
});
```

---

### Minimal Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/table-cell.mdx

Example of directly installing the TableCell extension.

```js
import { Editor } from "@tiptap/core";
import { TableCell } from "@tiptap/extension-table/cell";

new Editor({
    extensions: [TableCell],
});
```

---

### userMetadata

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for setting user metadata.

```js
TrackedChanges.configure({
    userId: "user-123",
    userMetadata: {
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
        role: "editor",
    },
});
```

---

### Installation for new projects

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/templates/simple-editor.mdx

Command to initialize a new project with the simple-editor template.

```bash
npx @tiptap/cli@latest init simple-editor
```

---

### Install Tiptap StarterKit

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/starterkit.mdx

Use npm to add the StarterKit package to your project dependencies.

```bash
npm install @tiptap/starter-kit
```

---

### onSuggestionReject

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for the onSuggestionReject callback.

```js
TrackedChanges.configure({
    onSuggestionReject: (id) => {
        console.log("Suggestion rejected:", id);
    },
});
```

---

### Minimal Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/color.mdx

Minimal setup for the Color extension.

```js
import { Editor } from "@tiptap/core";
import { Color } from "@tiptap/extension-text-style/color";

new Editor({
    extensions: [Color],
});
```

---

### Vanilla JS Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/guides/collaborative-editing.mdx

Install dependencies for Vanilla JS setup with Tiptap and Hocuspocus.

```bash
npm install @tiptap/extension-collaboration @hocuspocus/provider y-prosemirror yjs
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/mention-dropdown-menu.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add mention-dropdown-menu
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/marks/highlight.mdx

Installation command for the Highlight extension.

```bash
npm install @tiptap/extension-highlight
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/utils-components/suggestion-menu.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add suggestion-menu
```

---

### Using onListen hook with new signature

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/getting-started/upgrade.mdx

An example demonstrating how to configure the `onListen` hook within the server's configuration to handle listen events with the new `.listen()` signature.

```js
import { Server } from "@hocuspocus/server";

const server = new Server({
    async onListen(data) {
        console.log(`Server is listening on port "${data.port}"!`);
    },
});

server.listen();
```

---

### Initialize Content Properly

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/getting-started/install.mdx

Example demonstrating how to use the onSynced callback with setContent() to ensure initial editor content is added only once in a collaborative Tiptap editor.

```tsx
import "./styles.scss";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import * as Y from "yjs";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect } from "react";

import { TiptapCollabProvider } from "@tiptap-pro/provider";

const doc = new Y.Doc();

export default () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Collaboration.configure({
                document: doc,
            }),
        ],
        // Remove the automatic content addition on editor initialization.
    });

    useEffect(() => {
        const provider = new TiptapCollabProvider({
            name: "document.name", // Unique document identifier for syncing. This is your document name.
            appId: "7j9y6m10", // Your document server ID from the Cloud dashboard, or use `baseURL` for on-premises
            token: "notoken", // Your JWT
            document: doc,

            // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
            onSynced() {
                if (
                    !doc.getMap("config").get("initialContentLoaded") &&
                    editor
                ) {
                    doc.getMap("config").set("initialContentLoaded", true);

                    editor.commands.setContent(`
          <p>This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.</p>
          <p>The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.</p>
          `);
                }
            },
        });
    }, []);

    return <EditorContent editor={editor} />;
};
```

---

### Install Core Tiptap and AI SDK Packages

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/server-ai-toolkit/agents/ai-agent-chatbot.mdx

Install essential Tiptap packages, collaboration extensions, and the Vercel AI SDK for OpenAI integration.

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap-pro/provider ai @ai-sdk/react @ai-sdk/openai zod uuid yjs jose
```

---

### Tokenizer `start` function example

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/advanced-usage/custom-tokenizer.mdx

Example of an optional `start` function to optimize tokenizer performance by indicating where a token might begin.

```typescript
{
  start: (src) => {
    // Find where '==' appears in the source
    return src.indexOf('==')
  },
  // ...
}
```

---

### Initialize Tiptap Project with CLI

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/getting-started/cli.mdx

Use this command to initialize a new project or configure an existing one, installing dependencies and copying components. Run it in an empty directory to scaffold a new project or in an existing one to configure it.

```bash
npx @tiptap/cli@latest init
```

---

### Install Pro Extension with environment variable

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/pro-extensions.mdx

Example of installing a Tiptap Pro extension using an environment variable for the authentication token.

```bash
TIPTAP_PRO_TOKEN=actual-auth-token npm install --save @tiptap-pro/extension-comments
```

---

### enabled

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for enabling Tracked Changes mode.

```js
TrackedChanges.configure({
    enabled: true,
});
```

---

### Minimal Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/table-header.mdx

Minimal example of initializing Tiptap Editor with only the TableHeader extension.

```js
import { Editor } from "@tiptap/core";
import { TableHeader } from "@tiptap/extension-table/header";

new Editor({
    extensions: [TableHeader],
});
```

---

### Install Floating UI

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/agents/review-changes/suggestions-with-comments.mdx

No description

```bash
npm install @floating-ui/dom
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/primitives/combobox.mdx

Install the Combobox primitive via Tiptap CLI.

```bash
npx @tiptap/cli@latest add combobox
```

---

### Minimal Install of CharacterCount Extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/character-count.mdx

Import and initialize the CharacterCount extension using its specific package path for a minimal setup.

```js
import { Editor } from "@tiptap/core";
import { CharacterCount } from "@tiptap/extension-character-count";

new Editor({
    extensions: [CharacterCount],
});
```

---

### Usage in React or Next.js

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/templates/simple-editor.mdx

Example of how to use the SimpleEditor component after installation.

```jsx
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function App() {
    return <SimpleEditor />;
}
```

---

### Install Mention Extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/mention.mdx

Install the Mention extension using npm.

```bash
npm install @tiptap/extension-mention
```

---

### userId

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/getting-started/install.mdx

Example configuration for setting the user ID.

```js
TrackedChanges.configure({
    userId: "user-123",
});
```

---

### Example shorthand we'll support

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/guides/create-a-emoji-inline-block.mdx

An example of the Markdown shorthand for emojis that the guide will enable.

```md
Hello :smile: world!
```

---

### Example

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/api-reference/execute-tool.mdx

This example shows how to get the AI toolkit, set the active selection to the current editor selection, set it to a specific range, and clear it.

```ts
const toolkit = getAiToolkit(editor);
// Set the active selection to the current selection
toolkit.setActiveSelection(editor.state.selection);

// Set the active selection to a specific range
toolkit.setActiveSelection({ from: 10, to: 50 });

// Clear the active selection
toolkit.setActiveSelection(null);
```

---

### Example

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/markdown/api/editor.mdx

Get the current content of the editor as Markdown.

```js
const markdown = editor.getMarkdown();
```

---

### Install Tiptap AI Toolkit Pro Packages

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/workflows/template.mdx

Installs the Tiptap AI Toolkit, a pro package, requiring prior setup for access to the private NPM registry.

```bash
npm install @tiptap-pro/ai-toolkit @tiptap-pro/ai-toolkit-tool-definitions
```

---

### Configure Tiptap Editor with Collaboration Provider

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/getting-started/install.mdx

Example code to set up a Tiptap editor with the Collaboration extension and `TiptapCollabProvider`, connecting to a document server.

```tsx
import "./styles.scss";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";

// Importing the provider and useEffect
import { useEffect } from "react";
import { TiptapCollabProvider } from "@tiptap-pro/provider";

const doc = new Y.Doc();

export default () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Collaboration.configure({
                document: doc,
            }),
        ],
        content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
    });

    // Connect to your Collaboration server
    useEffect(() => {
        const provider = new TiptapCollabProvider({
            name: "document.name", // Unique document identifier for syncing. This is your document name.
            appId: "7j9y6m10", // Your document server ID from the Cloud dashboard, or use `baseURL` for on-premises
            token: "notoken", // Your JWT
            document: doc,
        });
    }, []);

    return <EditorContent editor={editor} />;
};
```

---

### Set up the development environment commands

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/getting-started/contributing.mdx

Commands to clone the repository, install dependencies, build packages, and start the development environment for Hocuspocus.

```sh
git clone git@github.com:ueberdosis/hocuspocus.git
npm install
npm run build:packages
npm run start
```

---

### Get document range

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/advanced-guides/concepts.mdx

Example of how to get the range covering the entire document.

```ts
const range = { from: 0, to: editor.doc.content.size };
```

---

### Install Static Renderer

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/output-json-html.mdx

Command to install the @tiptap/static-renderer package.

```bash
npm install @tiptap/static-renderer
```

---

### Installing Node Extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/custom-extensions/create-new/node.mdx

How to install a custom Node extension into a Tiptap editor instance, applicable for core, React, or Vue setups.

```typescript
import { Editor } from "@tiptap/core";

new Editor({
    extensions: [CustomNode],
});

// Or if using React or Vue

const editor = useEditor({
    extensions: [CustomNode],
});
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/marks/bold.mdx

Install the Bold extension.

```bash
npm install @tiptap/extension-bold
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/primitives/input.mdx

Instructions to add the Input primitive using Tiptap CLI.

```bash
npx @tiptap/cli@latest add input
```

---

### Get document NodeRange

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/advanced-guides/concepts.mdx

Example of how to get the NodeRange covering all top-level nodes in the document.

```ts
const nodeRange = { from: 0, to: editor.state.doc.childCount };
```

---

### Install Tiptap Editor

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/getting-started/install.mdx

Command to install basic Tiptap Editor and necessary extensions for React.

```bash
npm install @tiptap/extension-document @tiptap/extension-paragraph @tiptap/extension-text @tiptap/react
```

---

### Get selection range

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/advanced-guides/concepts.mdx

Example of how to get the range of the current selection from the editor state.

```ts
const range = {
    from: editor.state.selection.from,
    to: editor.state.selection.to,
};
```

---

### Initialize New Project with Notion-like Editor (Bash)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/templates/notion-like-editor.mdx

Use this command to create a new project initialized with the Notion-like editor template.

```bash
npx @tiptap/cli@latest init notion-like-editor
```

---

### Update index.jsx

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/getting-started/install.mdx

Example index.jsx file showing how to import and configure the Collaboration extension with Y.Doc.

```tsx
import "./styles.scss";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";

const doc = new Y.Doc(); // Initialize Y.Doc for shared editing

export default () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Collaboration.configure({
                document: doc, // Configure Y.Doc for collaboration
            }),
        ],
        content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
    });

    return <EditorContent editor={editor} />;
};
```

---

### Tiptap CLI init Command Options

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/getting-started/cli.mdx

This snippet displays the available options for the `init` command, allowing customization of the framework, working directory, and output verbosity.

```bash
Usage: @tiptap/cli@latest init [options] [components...]

Options:
-f, --framework <framework>   The framework to use (next, vite)
-c, --cwd <cwd>               The working directory (defaults to current directory)
-s, --silent                  Mute output
--src-dir                     Use the src directory when creating a new project
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/documents/snapshot-compare.mdx

Install the Snapshot Compare extension from Tiptap’s private npm registry.

```bash
npm install @tiptap-pro/extension-snapshot-compare
```

---

### Get first and last document position

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/advanced-guides/concepts.mdx

Example of how to get the first and last position in a Tiptap document.

```ts
const position = 0;
const lastPosition = editor.state.doc.content.size;
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/background-color.mdx

Install the extension using npm.

```bash
npm install @tiptap/extension-text-style
```

---

### Basic editor setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-tinymce.mdx

Comparison of TinyMCE initialization with Tiptap editor setup.

```ts
// TinyMCE (before)
tinymce.init({
    selector: "#editor",
    plugins: "lists link image table code",
    toolbar: "undo redo | bold italic | bullist numlist | link image",
});

// Tiptap (after)
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
});
```

---

### Basic setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/tracked-changes.mdx

Example of configuring the Tracked Changes extension with an editor instance.

```js
import { Editor } from "@tiptap/core";
import { TrackedChanges } from "@tiptap-pro/extension-tracked-changes";

const editor = new Editor({
    extensions: [
        TrackedChanges.configure({
            enabled: true,
            userId: "user-123",
            userMetadata: { name: "John Doe" },
        }),
    ],
});
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/slash-dropdown-menu.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add slash-dropdown-menu
```

---

### Get Tiptap Project Information with CLI

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/getting-started/cli.mdx

Use this command to retrieve details about your project's configuration and setup. It provides an overview of your current Tiptap environment.

```bash
npx @tiptap/cli@latest info
```

---

### Use the selectTextblockStart command

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/commands/select-textblock-start.mdx

Example of how to use the `selectTextblockStart` command in the Tiptap editor.

```js
editor.commands.selectTextblockStart();
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/copy-to-clipboard-button.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add copy-to-clipboard-button
```

---

### Start comparing changes with another document

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/api-reference/diff-utility.mdx

Example of how to initiate document comparison using the toolkit.

```ts
// Start comparing changes with another document
toolkit.startComparingDocuments({
    otherDoc,
});
```

---

### Initialize a new project

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/drag-context-menu.mdx

Command to initialize a new Tiptap project using the CLI.

```bash
npx @tiptap/cli@latest init
```

---

### Install Dependencies

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/conversion/content-types/structures-and-media/math-equations.mdx

Command to install the Mathematics extension and KaTeX.

```bash
npm install @tiptap/extension-mathematics katex
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/node-components/heading-node.mdx

You can add the node component via Tiptap CLI

```bash
npx @tiptap/cli@latest add heading-node
```

---

### Full AI Agent Demo with Tiptap-Pro Review UI

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/agents/review-changes/suggestions.mdx

This comprehensive example demonstrates how to set up an AI agent using @ai-sdk/react with Tiptap-Pro's AiToolkit. It includes handling AI tool calls, rendering custom UI for suggestion review (accept/reject buttons), and collecting user feedback on the changes.

```tsx
// app/page.tsx
'use client'

import { useChat } from '@ai-sdk/react'
import { Decoration } from '@tiptap/pm/view'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { AiToolkit, getAiToolkit, type SuggestionFeedbackEvent } from '@tiptap-pro/ai-toolkit'
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { useRef, useState } from 'react'
import './suggestions.css'

export default function Page() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, AiToolkit],
    content: `<h1>AI agent demo</h1><p>Ask the AI to improve this.</p>`,
  })

  const [reviewState, setReviewState] = useState({
    // Whether to display the review UI
    isReviewing: false,
    // Data for the tool call result
    tool: '',
    toolCallId: '',
    output: null as unknown,
    // Feedback events collected from user actions
    userFeedback: [] as SuggestionFeedbackEvent[],
  })

  const acceptButtonRef = useRef<HTMLButtonElement>(null)
  const rejectButtonRef = useRef<HTMLButtonElement>(null)

  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (!editor) return

      const { toolName, input, toolCallId } = toolCall

      // Use the AI Toolkit to execute the tool
      const toolkit = getAiToolkit(editor)
      const result = toolkit.executeTool({
        toolName,
        input,
        reviewOptions: {
          mode: 'preview',
          displayOptions: {
            renderDecorations(options) {
              return [
                ...options.defaultRenderDecorations(),

                // Accept button
                Decoration.widget(options.range.to, () => {
                  const element = document.createElement('button')
                  element.textContent = 'Accept'
                  element.addEventListener('click', () => {
                    const result = toolkit.acceptSuggestion(options.suggestion.id)
                    // Collect feedback events using functional update
                    setReviewState((prev) => ({
                      ...prev,
                      userFeedback: [...prev.userFeedback, ...result.aiFeedback.events],
                    }))
                    if (toolkit.getSuggestions().length === 0) {
                      acceptButtonRef.current?.click()
                    }
                  })
                  return element
                }),

                // Reject button
                Decoration.widget(options.range.to, () => {
                  const element = document.createElement('button')
                  element.textContent = 'Reject'
                  element.addEventListener('click', () => {
                    const result = toolkit.rejectSuggestion(options.suggestion.id)
                    // Collect feedback events using functional update
                    setReviewState((prev) => ({
                      ...prev,
                      userFeedback: [...prev.userFeedback, ...result.aiFeedback.events],
                    }))
                    if (toolkit.getSuggestions().length === 0) {
                      rejectButtonRef.current?.click()
                    }
                  })
                  return element
                }),
              ]
            },
          },
        },
      })

      // Continue the conversation right away
      addToolOutput({ tool: toolName, toolCallId, output: result.output })

      // If the tool call modifies the document, also show a review UI
      if (result.docChanged) {
        setReviewState({
          isReviewing: true,
          tool: toolName,
          toolCallId,
          output: result.output,
          userFeedback: [],
        })
      }
    },
  })

  const [input, setInput] = useState('Replace the last paragraph with a short story about Tiptap')

  if (!editor) return null

  return (
    <div>
      <EditorContent editor={editor} />
      {messages?.map((message) => (
        <div key={message.id} style={{ whiteSpace: 'pre-wrap' }}>
          <strong>{message.role}</strong>
          <br />
          {message.parts
            .filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('\n')}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage({ text: input })
            setInput('')
          }
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
      {reviewState.isReviewing && (
        <div>
          <h2>Reviewing Changes</h2>
          <button
            ref={acceptButtonRef}
            onClick={() => {
              const toolkit = getAiToolkit(editor)

```

---

### Available Development Scripts

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/s3.mdx

A list of development scripts for environment setup, S3 configuration testing, and playground examples.

```bash
# Environment setup
npm run dev:setup         # Complete setup (.env + Docker services)
npm run dev:env           # Create .env file from template
npm run dev:services      # Start Docker services (Redis + MinIO)
npm run dev:services:down # Stop Docker services
npm run dev:services:reset # Reset services and data

# S3 configuration testing
npm run dev:test-s3        # Test complete S3 configuration
npm run dev:test-s3:minio  # Test MinIO connection only
npm run dev:test-s3:nodejs # Test Node.js S3 client only

# Playground examples
npm run playground:s3      # S3 extension examples (ports 8000-8003)
npm run playground:s3-redis # S3 + Redis scaling examples
```

---

### Basic Agent Setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/agents/tools/mastra.mdx

Example showing how to initialize a Mastra Agent with Tiptap AI Toolkit tool definitions.

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { toolDefinitions } from "@tiptap-pro/ai-toolkit-ai-sdk";

const agent = new Agent({
    name: "Tiptap AI Agent",
    instructions:
        "You are an AI assistant that can read and edit Tiptap documents.",
    model: openai("gpt-5.4-mini"),
    tools: toolDefinitions(),
});

const result = await agent.generate("Read the document and summarize it");
```

---

### Example: Add a Specific Tiptap Component

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/getting-started/cli.mdx

This example demonstrates how to add a single Tiptap UI component, such as a 'button', to your project using the `add` command.

```bash
npx @tiptap/cli@latest add button
```

---

### Start Vite development server

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/install/vite.mdx

Run this command in your terminal to start the local development server and view your application with the Tiptap editor.

```bash
npm run dev
```

---

### getSuggestionAtPosition()

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/tracked-changes/api-reference/utilities.mdx

Example of getting the suggestion at a specific document position.

```js
import { getSuggestionAtPosition } from "@tiptap-pro/extension-tracked-changes";

const suggestion = getSuggestionAtPosition(editor, 42);
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/heading.mdx

Command to install the Heading extension.

```bash
npm install @tiptap/extension-heading
```

---

### Install Node Components

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/drag-context-menu.mdx

Commands to install various node components for proper styling of blocks in the editor.

```bash
npx @tiptap/cli@latest add paragraph-node
npx @tiptap/cli@latest add heading-node
npx @tiptap/cli@latest add blockquote-node
npx @tiptap/cli@latest add code-block-node
npx @tiptap/cli@latest add list-node
npx @tiptap/cli@latest add horizontal-rule-node
```

---

### Get previous and next words for context

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/agents/review-changes/style-suggestions.mdx

Example showing how to use `getNextWord` and `getPreviousWord` utility functions to get contextual words around a suggestion.

```ts
import { getNextWord, getPreviousWord } from "@tiptap-pro/ai-toolkit";

// Get the previous word in the sentence.
const { previousWord } = getPreviousWord(editor, suggestion.range.from);
// Get the next word in the sentence and the punctuation mark that follows it, if it's the end of the sentence.
const { nextWord, punctuationMark } = getNextWord(editor, suggestion.range.to);
```

---

### Install Core Tiptap and Vercel AI SDK

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/workflows/template.mdx

Installs essential Tiptap packages and the Vercel AI SDK with OpenAI integration for AI capabilities.

```bash
npm install @tiptap/react @tiptap/starter-kit ai @ai-sdk/openai zod
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/throttle.mdx

Command to install the Throttle extension.

```bash
npm install @hocuspocus/extension-throttle
```

---

### Install Export EPUB Extension (npm)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/conversion/export/epub/editor-extension.mdx

Install the Tiptap Pro Export EPUB extension package from the private npm registry.

```bash
npm i @tiptap-pro/extension-export-epub
```

---

### Initialize Editor with StarterKit

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/starterkit.mdx

Import and pass the StarterKit extension directly to the Tiptap Editor to enable all its included features.

```js
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const editor = new Editor({
    content: "<p>Example Text</p>",
    extensions: [StarterKit],
});
```

---

### Full Example with Toggle Support

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/drag-handle-vue.mdx

A complete example demonstrating how to dynamically toggle the nested prop for the DragHandle component, including editor setup and performance best practices.

```vue
<template>
    <div v-if="editor">
        <button @click="nested = !nested">Toggle nested</button>
        <drag-handle :editor="editor" :nested="nestedOptions">
            <div class="drag-handle" />
        </drag-handle>
    </div>
    <editor-content :editor="editor" />
</template>

<script>
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";

// Define config as a constant OUTSIDE the component to prevent re-renders
const NESTED_CONFIG = { edgeDetection: { threshold: -16 } };

export default {
    components: {
        EditorContent,
        DragHandle,
    },
    data() {
        return {
            editor: null,
            nested: true,
        };
    },
    computed: {
        nestedOptions() {
            // Return the constant reference, not a new object
            return this.nested ? NESTED_CONFIG : false;
        },
    },
    mounted() {
        this.editor = new Editor({
            extensions: [StarterKit],
            content: "<ul><li>Item 1</li><li>Item 2</li></ul>",
        });
    },
    beforeUnmount() {
        this.editor?.destroy();
    },
};
</script>
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/reset-all-formatting-button.mdx

Add the component via the Tiptap CLI

```bash
npx @tiptap/cli@latest add reset-all-formatting-button
```

---

### Install dependencies

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/nextjs.mdx

Command to install the necessary Tiptap packages for a React project.

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/blockquote-button.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add blockquote-button
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/document.mdx

Install the Document extension using npm.

```bash
npm install @tiptap/extension-document
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/logger.mdx

Install the Logger package with:

```bash
npm install @hocuspocus/extension-logger
```

---

### Install dependencies

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vanilla-javascript.mdx

Install the core Tiptap packages required for the editor.

```bash
npm install @tiptap/core @tiptap/pm @tiptap/starter-kit
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/text.mdx

Install the Text extension using npm.

```bash
npm install @tiptap/extension-text
```

---

### Implement onListen Hook (JavaScript)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/hooks.mdx

Example demonstrating how to implement the `onListen` hook to log the port number after the Hocuspocus server starts accepting connections.

```js
import { Server } from "@hocuspocus/server";

const server = new Server({
    async onListen(data) {
        // Output some information
        console.log(`Server is listening on port "${data.port}"!`);
    },
});

server.listen();
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/marks/superscript.mdx

Install the Superscript extension.

```bash
npm install @tiptap/extension-superscript
```

---

### index.js

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/php.mdx

JavaScript setup for initializing the Tiptap editor with StarterKit and handling content updates for Livewire/Alpine.js.

```javascript
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

window.setupEditor = function (content) {
    let editor;

    return {
        content: content,

        init(element) {
            editor = new Editor({
                element: element,
                extensions: [StarterKit],
                content: this.content,
                onUpdate: ({ editor }) => {
                    this.content = editor.getHTML();
                },
            });

            this.$watch("content", (content) => {
                // If the new content matches Tiptap's then we just skip.
                if (content === editor.getHTML()) return;

                /*
          Otherwise, it means that an external source
          is modifying the data on this Alpine component,
          which could be Livewire itself.
          In this case, we only need to update Tiptap's
          content and we're done.
          For more information on the `setContent()` method, see:
            https://www.tiptap.dev/api/commands/set-content
        */
                editor.commands.setContent(content, false);
            });
        },
    };
};
```

---

### Install ConvertKit and PageKit extensions

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/pages/guides/pagekit-usage.mdx

Install the necessary Tiptap Pro extensions for PageKit and ConvertKit using npm.

```bash
npm install @tiptap-pro/extension-convert-kit \
            @tiptap-pro/extension-pages-pagekit
```

---

### Install core Tiptap and Vercel AI SDK packages

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/ai-toolkit/workflows/proofreader.mdx

Command to install necessary Tiptap core packages, Vercel AI SDK, and other utilities.

```bash
npm install @tiptap/react @tiptap/starter-kit ai @ai-sdk/react @ai-sdk/openai zod uuid
```

---

### Install Tiptap Pro Markdown Export Extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/conversion/export/markdown/editor-extension.mdx

Install the `@tiptap-pro/extension-export-markdown` package using npm.

```bash
npm i @tiptap-pro/extension-export-markdown
```

---

### Installation

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/components/text-button.mdx

Add the component via the Tiptap CLI.

```bash
npx @tiptap/cli@latest add text-button
```

---

### Create a project (optional)

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/alpine.mdx

Commands to initialize a new Vite project with Vanilla JavaScript template, navigate into it, install dependencies, and start the development server.

```bash
npm init vite@latest my-tiptap-project -- --template vanilla
cd my-tiptap-project
npm install
npm run dev
```

---

### Basic Provider Setup

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/provider/integration.mdx

Example of connecting to the Collaboration backend using TiptapCollabProvider in a React useEffect hook.

```ts
const doc = new Y.Doc();

useEffect(() => {
    const provider = new TiptapCollabProvider({
        name: note.id, // Document identifier
        appId: "YOUR_APP_ID", // replace with your document server ID from the Cloud dashboard
        token: "YOUR_JWT", // Authentication token
        document: doc,
        user: userId,
    });
}, []);
```

---

### Initialize New Project with DOCX Editor

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/ui-components/templates/docx-editor.mdx

Use this command to create a new Tiptap project pre-configured with the DOCX Editor template.

```bash
npx @tiptap/cli@latest init docx
```

---

### Disable Default Undo/Redo

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/getting-started/install.mdx

Configuration example to disable the default Undo/Redo extension in Tiptap's StarterKit to avoid conflicts with collaborative history management.

```ts
const editor = useEditor({
    extensions: [
        StarterKit.configure({
            undoRedo: false, // Disables default Undo/Redo extension to use Collaboration's history management
        }),
    ],
});
```

---

### MinIO and Redis Setup for Local Development

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/hocuspocus/server/extensions/s3.mdx

Example of configuring Hocuspocus servers for local development using MinIO (S3-compatible) and Redis extensions.

```js
import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { Redis } from "@hocuspocus/extension-redis";
import { S3 } from "@hocuspocus/extension-s3";

// Development server setup with MinIO and Redis
const createServer = (name, port) =>
    new Server({
        name,
        port,
        extensions: [
            new Logger(),
            new Redis({
                host: "127.0.0.1",
                port: 6379,
            }),
            new S3({
                bucket: "hocuspocus-documents",
                endpoint: "http://localhost:9000",
                forcePathStyle: true,
                credentials: {
                    accessKeyId: "minioadmin",
                    secretAccessKey: "minioadmin",
                },
            }),
        ],
    });

// Start multiple instances
createServer("dev-server-1", 8001).listen();
createServer("dev-server-2", 8002).listen();
```

---

### Install ImportDocx Extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/conversion/import/docx/css-injection.mdx

Install the Tiptap Pro ImportDocx extension using npm.

```bash
npm i @tiptap-pro/extension-import-docx@^0.10.0
```

---

### Install

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/audio.mdx

Install the Tiptap Audio extension using npm.

```bash
npm install @tiptap/extension-audio
```

---

### Install FileHandler extension

Source: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/filehandler.mdx

Install the Tiptap FileHandler extension using npm.

```bash
npm install @tiptap/extension-file-handler
```
