---

title: Vue 3 with Bastyon SDK
description: A Vue 3 project integrating Bastyon SDK for decentralized application interactions
tags:
  - Node
  - Vue 3
  - Vite
  - TypeScript
  - Bastyon SDK

---

<p align='center'>
  <img src='./logo.png' alt='PocketNet' width='200'/>
</p>

<h6 align='center'>
<a href="https://github.com/DaniilKimlb/bastyon-miniapp-vue-template">GitHub Repository</a>
</h6>

<h5 align='center'>
<b>Integrate Bastyon SDK in Vue 3 for Decentralized Applications</b>
</h5>

---

## Features

- 🚀 [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/) - Fast and modern front-end tools.
- 🌐 [Bastyon SDK](https://bastyon.com/application?id=app.pocketnet.docs&p=6465762f617070732f6d696e69617070732f73646b2e68746d6c) - Decentralized, censorship-resistant platform integration.
- 📂 [File-based routing](./src/pages) - Auto-configured routing.
- 📥 [Components auto importing](./src/components) - Automatically import components.

---

## **Directory Structure**

```bash
src/
├── composables/
│   ├── sdkService.ts  # Contains logic for interacting with the Bastyon SDK
│   ├── dark.ts        # Handles dark mode toggle functionality
│   └── index.ts       # Exports utilities and composables from the directory
├── components/
│   ├── TheFooter.vue  # Footer component for the app
│   ├── TheCounter.vue # Counter component
│   └── TheInput.vue   # Input component for handling user inputs
├── pages/
│   ├── index.vue      # Main page of the application
│   ├── [...all].vue   # Catch-all route handler
│   └── hi/[name].vue  # Dynamic route for user-specific pages
├── router/
│   └── index.ts       # Vue Router configuration
├── styles/
│   └── main.css       # Global styles for the application
├── App.vue            # Root Vue component
└── main.ts            # Entry point of the application
```

---

## **Bastyon SDK**

This project includes Bastyon SDK integration, which is essential for building mini-applications that interact with the decentralized Bastyon platform. The SDK enables your application to:

- Access and use the Bastyon API for various functionalities.
- Manage application state and listen to platform events.
- Perform secure interactions, such as RPC calls and user actions.

The SDK is the primary tool for integrating mini-applications into the Bastyon ecosystem, allowing seamless communication between your app and the platform.

### **TypeScript Support**

The Bastyon SDK offers full TypeScript support through a dedicated type definitions package. These definitions provide strongly typed interfaces for SDK events, methods, and responses, allowing you to:

- Write safer and more predictable code.
- Detect potential issues during development.
- Enjoy a smoother integration process with Bastyon API.

For detailed information about available types and how to use them, refer to the official type definitions package:

- 📘 [Type Definitions for Bastyon SDK](https://github.com/DaniilKimlb/types-bastyon-sdk/blob/master/README.md)

### **Learn More**:

- 📘 [Bastyon SDK Reference Documentation](https://bastyon.com/application?id=app.pocketnet.docs&p=6465762f617070732f6d696e69617070732f73646b2e68746d6c)
- 📘 [How to Create Web Applications on Bastyon](https://bastyon.com/application?id=app.pocketnet.docs)

---

## **Example Usage**

### **Initialization of Bastyon SDK**

The Bastyon SDK must be initialized at the very beginning of your application lifecycle to ensure the platform recognizes your mini-application as ready.

#### Example in `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import { SdkService } from './composables/sdkService'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

app.use(router)
app.mount('#app')

// Initialize the Bastyon SDK
SdkService.init()
```

Once initialized, the SDK automatically emits the `loaded` event to notify the platform that the app is ready.

---

### **Basic SDK Methods**

After initialization, you can use the following methods to interact with the Bastyon platform:

1. **Opening an External Link**:

   ```typescript
   SdkService.openExternalLink('https://example.com')
   ```

2. **Fetching Application Information**:

   ```typescript
   SdkService.getAppInfo().then((info) => {
     console.log('App Info:', info)
   })
   ```

3. **Performing an RPC Call**:

   ```typescript
   SdkService.rpc('getnodeinfo').then((info) => {
     console.log('Node Info:', info)
   }).catch((error) => {
     console.error('RPC Call Failed:', error)
   })
   ```

4. **Adding Event Listeners**:

   ```typescript
   SdkService.on('balance', (data) => {
     console.log('Balance updated:', data)
   })
   ```

5. **Requesting Permissions**:
   ```typescript
   SdkService.checkAndRequestPermissions(['account', 'payment']).then(() => {
     console.log('Permissions granted')
   }).catch((error) => {
     console.error('Permission request failed:', error)
   })
   ```

---

## **Important Note for Publication**

When publishing your project, ensure that the following files are included in the **`public`** directory:

1. **[`b_manifest`](https://docs.bastyon.com/dev/apps/miniapps/get-started.html#b-manifest-json)** – This file is essential for describing your mini-application and its settings. You can find more information about the structure and requirements of this file [here](https://docs.bastyon.com/dev/apps/miniapps/get-started.html#b-manifest-json).
2. **[`b_icon.png`](https://docs.bastyon.com/dev/apps/miniapps/get-started.html#b-icon-png)** – This icon will be displayed as the app icon within the platform. Learn about its specifications [here](https://docs.bastyon.com/dev/apps/miniapps/get-started.html#b-icon-png).

For general guidelines and a complete overview, refer to the official Bastyon documentation on [mini-app setup](https://docs.bastyon.com/dev/apps/miniapps/get-started.html#step-1-domain-preparation).

Bastyon requires all applications, including those tested locally, to run on **HTTPS**. This ensures secure connections and compliance with platform requirements, even during development.

1. **Use Self-Signed SSL Certificates:** To meet the HTTPS requirement for local testing, you can set up self-signed SSL certificates. This is a simple and effective way to enable HTTPS on your local server.
2. **Specify a Dev Domain:** If you plan to use a local domain for testing, it is **mandatory to specify a Dev Domain** during the setup process. Without filling in the Dev Domain field, adding a local domain will not be possible. This ensures compatibility with Bastyon's domain-related requirements.

### How to Generate Self-Signed Certificates:

1. **Generate Certificates Using OpenSSL**:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes
   ```

2. **Trust the Certificate** (optional, to avoid browser warnings):

   - **Mac**: Add the `.pem` file to Keychain and set it to "Always Trust."
   - **Windows**: Import the certificate into "Trusted Root Certification Authorities."
   - **Linux**: Add the `.pem` file to `/usr/local/share/ca-certificates/` and run:
     ```bash
     sudo update-ca-certificates
     ```

3. **Configure Vite for HTTPS**:

   ```typescript
   import fs from 'node:fs'
   import { defineConfig } from 'vite'

   export default defineConfig({
     server: {
       https: {
         key: fs.readFileSync('./localhost-key.pem'),
         cert: fs.readFileSync('./localhost.pem'),
       },
     },
   })
   ```

---

### **Example Directory Structure**

```bash
project-root/
├── public/
│   ├── b_manifest      # Mini-app metadata
│   ├── b_icon.png      # Application icon
├── src/
├── dist/
├── localhost-key.pem   # Self-signed private key for HTTPS
├── localhost.pem       # Self-signed certificate for HTTPS
└── package.json
```

These files ensure smooth deployment and visibility of your app on the Bastyon platform while also enabling secure local testing.

## Additional Tools

### UI Frameworks

- 🛠️ [UnoCSS](https://github.com/antfu/unocss) - Instant on-demand atomic CSS engine for efficient styling.

### Icons

- 🎨 [Iconify](https://iconify.design) - Use icons from any icon sets.
- 🔍 [Icônes](https://icones.netlify.app/) - Search and use icons from multiple icon sets.
- 💻 Pure CSS Icons via UnoCSS - Style icons directly with CSS using UnoCSS.

### Plugins

- 🗺️ [Vue Router](https://github.com/vuejs/vue-router) - Manages app routing.
- 🗂️ [`unplugin-vue-router`](https://github.com/posva/unplugin-vue-router) - File system-based routing for easy route management.
- 🔧 [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Automatically import Vue Composition API and other utilities without manually importing.
- 🧩 [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - Automatically import components, simplifying usage across the app.
- 🔨 [`unplugin-vue-macros`](https://github.com/sxzz/unplugin-vue-macros) - Extend macros and add more syntax sugar to Vue.
- 🧰 [VueUse](https://github.com/antfu/vueuse) - A collection of useful Vue Composition APIs to enhance functionality.

## How to Run

To start developing with this project, install the dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

Build the project for production:

```bash
pnpm run build
```

The production build will be available in the `dist/` folder.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for more information.

---
