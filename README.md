# Auk Saurian

A browser-based desktop environment built with HTML, CSS, and vanilla JavaScript.
This project simulates a retro browser OS with movable desktop icons, resizable windows, a shell, and a package manager.

## Run locally

Option 1: Python 3

```bash
cd /home/larp/Videos
python3 -m http.server 8000
```

Option 2: Node.js

```bash
cd /home/larp/Videos
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## Features

- Desktop-style UI with draggable icons and start menu
- Resizable app windows with drag and resize handles
- Auk Terminal and TTY shell with custom commands
- Embedded browser app with URL navigation
- BLM package manager for `.crt` packages
- Installed package apps appear on the desktop and in the Start menu
- Mountains wallpaper package sets the desktop background image
- Desktop context menu with wallpaper toggle and reboot
- FINIT bootloader overlay and topbar clock
- Retro / XFCE-inspired styling and app chrome

## Usage

- Click desktop icons, quick-launch buttons, or Start menu entries to open apps
- Drag windows by the title bar and resize them with the bottom-right handle
- In the terminal, run `help`, `uname`, `uptime`, `clear`, `grabshell`, `whoami`, `hash`, and `blm`
- Use `blm search`, `blm install`, `blm remove`, `blm list`, and `blm info`
- Install `mountains-wallpaper.crt` and open its app to change the desktop wallpaper

## Notes

- This project is a front-end browser demo and uses simulated OS behavior.
- The main files are `index.html`, `styles.css`, and `script.js`.
- No backend is required btw, everything runs in the browser.
