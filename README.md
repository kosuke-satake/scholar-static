# 🎓 ScholarStatic

Welcome to **ScholarStatic**! This is a lightning-fast, ultra-lightweight academic portfolio template. 

It is uniquely designed to give you the **best of both worlds**:
1. **The Live Website:** Pure, blazing-fast HTML, CSS (Tailwind), and vanilla JavaScript. No heavy backend servers, no React overhead on the frontend, and incredibly fast loading times for your visitors.
2. **The Editor (CMS):** A powerful, beautiful local content management system powered by **Keystatic**. You can easily add publications, edit your biography, and upload images without ever touching a line of code or messing up a JSON file.

---

## 🚀 How to Create Your Own Portfolio (The Workflow)

If you found this repository and want to use it to build your own personal portfolio, follow these steps exactly!

### Step 1: Get Your Own Copy (Do not just download!)
You want to keep a link to this original code, but you need your own separate repository to host *your* portfolio. 
1. Go to this repository on GitHub.
2. Click the green **"Use this template"** button (or click **"Fork"**).
3. Name your new repository something like `my-portfolio` or `kosuke-satake.github.io`.
4. You now have your very own version of the code that you can freely modify!

### Step 2: Set Up Your Local Environment
To edit the site and preview it on your Mac/PC, you need to download it and install the tools.

1. Open your terminal and clone *your* new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME
   ```
2. Install Node.js dependencies. We use `nvm` (Node Version Manager) to ensure you are using the correct version of Node (`v24.14.1`).
   ```bash
   nvm use     # Tells your terminal to use Node v24
   npm install # Installs the Keystatic CMS engine into the editor/ folder
   ```

### Step 3: Editing Your Content Locally
You don't need to edit code to update your portfolio! 

1. Start the Keystatic CMS:
   ```bash
   npm run editor
   ```
2. Open your browser and go to `http://localhost:4321/keystatic`.
3. You will see a beautiful dashboard with tabs for your English and Japanese content. 
4. Edit your bio, add publications, or upload a new profile picture. When you click **Save**, it instantly updates the raw JSON files in `editor/public/data/`.

### Step 4: Previewing the Live Site
To see exactly what your visitors will see:
1. Open a new terminal window in the project folder.
2. Start the local static server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000`. You will see your blazing-fast portfolio!

### Step 5: Save Your Changes
Once you are happy with your edits:
```bash
git add .
git commit -m "Update my biography and added a new publication"
git push
```

---

## 🌍 Deploying to the Internet & Editing from Anywhere

If you use Cloudflare Pages (highly recommended!), you can host this site for free AND configure it so you can log into the editor from any computer (like an iPad or a library computer) without using your terminal!

### 1. Deploy to Cloudflare Pages
1. Log into your Cloudflare Dashboard -> **Pages**.
2. Click **Connect to Git** and select your new portfolio repository.
3. Configure the Build Settings:
   - **Framework Preset:** `None`
   - **Build command:** *(Leave completely empty)*
   - **Build output directory:** `/` *(Just a forward slash)*
4. Click **Save and Deploy**. Your site is now live on the internet!

### 2. Enable Keystatic "GitHub Mode" (Edit from Anywhere)
Right now, Keystatic is in "Local Mode" (it saves files to your Mac). To edit from your live Cloudflare URL, we must switch it to "GitHub Mode" so it saves files directly to your GitHub repo.

1. Open `editor/keystatic.config.tsx` in your code editor.
2. Find the `storage:` block at the very bottom of the file.
3. Change the `repo:` string from `'YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME'` to your actual GitHub info (e.g., `'kosuke-satake/my-portfolio'`).
4. Save the file, commit it, and push it to GitHub.
5. Create a GitHub App for Keystatic: Go to [https://keystatic.com/docs/github-mode](https://keystatic.com/docs/github-mode) and follow the instructions to link your GitHub account to your live Cloudflare URL (`your-site.pages.dev/keystatic`).

Now, if you visit `your-site.pages.dev/keystatic`, you will be prompted to log in with GitHub. Any changes you make there will automatically create a commit to your repository, which will instantly trigger Cloudflare to update your live website!

---

## 🎨 Customization Guide (For Developers)

ScholarStatic is designed to be fully customizable because nothing is hidden behind a complex framework.

*   **HTML Structure:** Open `index.html`. You can add new CSS libraries, change the `<head>` tags, or modify the footer structure directly.
*   **Styling (Tailwind CSS):** Open `css/style.css`. We use a compiled Tailwind file. If you want to change core colors or rebuild the CSS, you can install Tailwind CLI and watch the `tailwind.config.js` file.
*   **Logic & Rendering:** Open `js/main.js`. This is where the magic happens. The `RENDERERS` object controls exactly how the JSON data is converted into HTML. If you want your "Projects" cards to look different, simply edit the `renderCardGrid` function!

### 🧩 Understanding the "Layout & Navigation" Tab

One of the most powerful features of ScholarStatic is the **Layout & Navigation** tab in Keystatic. This tab controls *what* sections appear on your live site and in *what order*. 

Each layout block has four settings (configured as simple dropdowns to prevent typos):
1. **Section ID:** The internal HTML anchor link (e.g., `#teaching`).
2. **Navigation Label:** The actual text shown in your top menu (e.g., "Courses").
3. **Renderer Function:** Which visual style to use (e.g., Timeline, Card Grid, List).
4. **Data Key:** Which Keystatic content tab to pull data from (e.g., `teaching`).

**What happens if I delete a section?**
If you delete "Teaching" from the Layout tab, it will instantly disappear from your live website and your top navigation menu! However, **the "Teaching" tab will still remain in the Keystatic sidebar**. This is intentional! Keystatic acts as a permanent database for *all* your content. The Layout tab simply decides which of that content is currently "published." If you don't need a tab, you can simply ignore it.

Enjoy your lightning-fast, highly-organized academic portfolio!