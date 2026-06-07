# 🚀 Project Setup: Astro + Svelte + Tailwind for Oblique Landing Page

We are building a highly optimized landing page for the mobile game "Oblique". 
The goal is a static website deployed on GitHub Pages with one dynamic "Island": A Live-Leaderboard component built with Svelte that fetches data from Supabase.

The current directory is completely empty and already linked to a GitHub repository.

## 🛠️ Tasks to execute

Please perform the following steps automated in the terminal and create the necessary files:

### 1. Initialize Astro Project
* Run the Astro installation wizard using defaults, tailored for a static website (SSG).
* Set up the project structure in the current directory (`.`).
* Use TypeScript (strict or recommended).

### 2. Add Integrations
Run the official Astro CLI commands to add:
* **Tailwind CSS:** `npx astro add tailwind` (Accept all defaults)
* **Svelte:** `npx astro add svelte` (Accept all defaults)

### 3. Install Supabase Client
* Install the official Supabase JS client via npm: `npm install @supabase/supabase-js`

### 4. Create Project Structure & Placeholder Files
Please generate a clean folder structure and create these files with basic boilerplate code:

* `src/layouts/Layout.astro` -> A base HTML5 wrapper with a dark slate background (`bg-slate-950 text-slate-100`), viewport tags, and a modern sans font.
* `src/pages/index.astro` -> The main page importing the Layout and placing a static Marketing Header, a Download Button, and the Leaderboard Component.
* `src/components/Leaderboard.svelte` -> A Svelte component containing a basic `onMount` hook placeholder that will later fetch the Top 1000 players from Supabase, rendering a clean, scrollable Tailwind table.

### 5. Environment Variables Setup
* Create a `.env` file in the root directory with placeholders for:
  `PUBLIC_SUPABASE_URL=your_supabase_url_here`
  `PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here`

Ensure that the `.env` file is automatically added to the `.gitignore`.

---
When you are done, provide a short summary of the created structure and the command to start the local development server.