<img src="preview/preview.jpg" width="830">   

### [VIENA PLAYER](https://viena.vercel.app/) is a lightweight, modern web radio player.     
  
- Instant one-click radio  
- Responsive & Retina-ready    
- Tailwind v4   
- Vanilla JS  
- Customize stations   
- Live audio visualizer   
- Full keyboard control   
- Easy station switching   
- Built-in live clock   
- Fast and lightweight    

<img alt="" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" height="20"/><img alt="" src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" height="20"/><img alt="" src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" height="20"/><img alt="" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" height="20"/><img alt="" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" height="20"/><img alt="" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" height="20"/>
  
#### 🎧 VIENA PLAYER 

It combines smooth UI interactions, cover-driven theming, and a living waveform visualizer designed to *breathe* rather than aggressively react.

Built with simplicity, performance, and atmosphere in mind — ideal for radio stations, ambient music, and long-form audio streams.   

#### ✨ Features

#### 🔊 Audio & Playback
- HTML5 Audio with lazy `AudioContext` initialization
- Play / pause toggle with proper suspended context handling
- Track navigation (previous / next) with looped playlist
- Keyboard controls:
  - `Space` — Play / Pause  
  - `← / →` — Previous / Next track
- Preload enabled with cross-origin support
- No autoplay (user-gesture safe)

#### 🎵 Track & Metadata
- JSON-based playlist loading (`tracks.json`)
- Dynamic track title & artist display
- Instant track switching without page reload
- Per-track cover artwork

#### 🎨 Visual Experience
- Dominant color extraction from cover images
- Smooth color interpolation between tracks
- Waveform color adapts automatically to artwork
- Soft glow and gradient rendering

#### 🌊 Waveform Visualizer  
**VIENA Waveform**
- Ambient waveform animation (non-aggressive, radio-friendly)
- Heart-rate–inspired pulse system
- Center-weighted dynamics with airy edges
- Rounded bars with subtle shadows
- FPS-limited rendering for low CPU usage
- Fully responsive canvas resizing

#### 💿 Cover Interaction
- Rotating cover animation during playback
- Smooth reset on track change
- Visual sync with play / pause state

#### 🧠 UX Details
- Cursor-aware hover effects on play button
- Smooth animation state recovery
- Input-safe keyboard handling (won’t hijack typing)
- Minimal DOM footprint