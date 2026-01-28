# Portfolio Website

A premium, high-performance portfolio website designed for a UI/UX Designer & Front-End Developer.

## 🛠 Tech Stack & Features
- **Core**: HTML5, CSS3, Vanilla JavaScript.
- **Layout**: Bootstrap 5 (Rows/Cols only).
- **Animations**: GSAP (ScrollTrigger) & Custom CSS.
- **Scrolling**: Lenis Smooth Scroll.
- **Design System**: Neumorphic touches, glassmorphism, and strong typography (Outfit/Inter).

## 📂 Folder Structure
```
/
├── index.html       # Home Page (Hero, Skills, Work Stack, FAQ)
├── about.html       # About Page (Bio, Journey)
├── works.html       # Works Page (Case Studies/Projects)
├── contact.html     # Contact Page (Form -> WhatsApp)
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/      # Add your project images here
```

## 🚀 How to Run
1. **Local Server (Recommended)**:
   - Use VS Code extension "Live Server".
   - Or run `python -m http.server`.
   - Smooth scrolling and GSAP Pinning work best in a server environment rather than file:// protocol.

2. **Customization**:
   - **Images**: Visuals are currently CSS gradients. Replace the `.card-img-col` divs or `img` tags with your actual project screenshots.
   - **Contact Form**: The form currently redirects to WhatsApp with a pre-filled message.
   - **Links**: Update the `href` for Social Links and Resume download.
