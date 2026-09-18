# Davide Lombardi — Pianist Portfolio

<div align="left">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
</div>

A minimalist, high-performance professional portfolio website designed for the Italian classical pianist Davide Lombardi. The project features an elegant dark theme, robust typography, interactive elements (including musical Easter eggs), and a lightweight custom Static Site Generation (SSG) system.

## 🌟 Features

- **Custom Static Site Generator:** A lightweight `build.js` script dynamically injects HTML components (`head`, `hero`, `nav`, `portfolio`, `resume`, `footer`) into the main `index.html`, eliminating the need for heavy frameworks while keeping the code maintainable.
- **Embedded YouTube Player:** Seamless integration of YouTube video performances with a custom theater-mode layout.
- **Musical Easter Eggs:** Hidden interactive musical notes scattered throughout the site that, when clicked, play famous classical piano concertos and sonatas (Tchaikovsky, Beethoven, Chopin, Rachmaninoff, Mozart) via a custom hidden mini-player.
- **Responsive & Fluid Design:** The layout adapts flawlessly to mobile, tablet, and desktop screens using modern CSS Grid and Flexbox techniques.
- **Typography-Driven UI:** A blend of `Playfair Display` for elegant serif headings and `Inter` for clean sans-serif readability, colored in a bespoke palette (Surface Navy, Paper White, Brass).
- **Direct Contact Links:** Instant action links for Email and WhatsApp.

## 🚀 Getting Started

### Prerequisites

You only need **Node.js** installed on your machine to build the site. No other heavy dependencies are required.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AeSoul0/mvp_davide.git
   cd mvp_davide
   ```

2. To compile the site from the components, run the build script:
   ```bash
   node build.js
   ```
   *(Or you can use `npm run build` if you prefer).*

3. The `build.js` script will read the files inside `src/components/` and generate the final `index.html` in the root folder.

### Local Development

Because the site uses embedded YouTube iframes that require strict origin policies (to prevent Error 153 "Video Unavailable"), **do not open `index.html` directly via the `file:///` protocol.**

Instead, serve the directory using a local HTTP server. For example:
- **VS Code:** Use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
- **Python:** Run `python -m http.server 8000` in the terminal.
- **Node:** Run `npx serve .`

## 📁 Project Structure

```
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet (variables, layout, animations)
│   ├── js/
│   │   └── main.js         # Interactivity (scroll, easter eggs player, animations)
│   └── images/             # Optimised profile and gallery images
├── src/
│   ├── index.html          # Master template with <!-- INCLUDE: ... --> markers
│   └── components/         # HTML partials (hero.html, footer.html, etc.)
├── build.js                # Custom Node.js script to compile the SSG
├── index.html              # GENERATED output file (do not edit directly)
└── README.md
```

## 🛠 Deployment

This project is entirely static (HTML, CSS, JS) and is optimized for zero-config deployments. 

To deploy on **Vercel** or **Netlify**:
1. Connect your GitHub repository.
2. Set the Build Command to `node build.js` (or `npm run build`).
3. Set the Output Directory to the root folder (or leave it blank).

## 👨‍💻 Developed By

Designed and developed by **[ÆSoul](https://github.com/AeSoul0)**.
