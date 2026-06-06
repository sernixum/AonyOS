const windowsContainer = document.getElementById('windows');
const desktopIcons = document.querySelectorAll('.desktop-icon');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const startSearch = document.getElementById('start-search');
const startApps = document.querySelectorAll('.start-app');
const quickLaunch = document.querySelectorAll('.panel-icon');
const taskbar = document.getElementById('taskbar');
const clock = document.getElementById('clock');
const topbarClock = document.getElementById('topbar-clock');
const template = document.getElementById('window-template');
let zIndexCounter = 10;
const workspaceButtons = document.querySelectorAll('#workspace-switcher .ws');
const desktop = document.getElementById('desktop');
const desktopContext = document.getElementById('desktop-context');

const apps = {
  terminal: {
    icon: '🖥️',
    title: 'Auk Terminal',
    render: () => {
      const container = document.createElement('div');
      container.className = 'terminal';
      const output = document.createElement('div');
      output.className = 'terminal-output';
      output.textContent = 'Auk Saurian Terminal\nKernel: Auk Browser Recode\nDE: warship\nType `help` to get started.\nUse `grabshell` to show host info and puffin art.\n';

      const input = document.createElement('input');
      input.className = 'command-input';
      input.placeholder = 'Enter command...';
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        const value = input.value.trim();
        if (!value) return;
        if (value.toLowerCase() === 'clear') {
          output.textContent = '';
        } else {
          const promptBefore = getPrompt();
          const result = runCommand(value);
          const promptAfter = getPrompt();
          output.textContent += `\n${promptBefore} ${value}\n${result}`;
          if (promptAfter !== promptBefore) {
            output.textContent += `\n${promptAfter} `;
          }
        }
        input.value = '';
        output.scrollTop = output.scrollHeight;
      });

      container.append(output, input);
      return container;
    }
  },
  tty: {
    title: 'Auk TTY',
    render: () => {
      const container = document.createElement('div');
      container.className = 'tty-terminal';
      const output = document.createElement('pre');
      output.className = 'tty-output';
      output.textContent = 'Auk Saurian TTY\nKernel: Auk Browser Recode\nDE: warship\nPress Enter to run a command.\n';

      const input = document.createElement('input');
      input.className = 'command-input tty-input';
      input.placeholder = 'tty$ ';
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        const value = input.value.trim();
        if (!value) return;
        if (value.toLowerCase() === 'clear') {
          output.textContent = '';
        } else {
          const prompt = 'tty$';
          const result = runCommand(value);
          output.textContent += `\n${prompt} ${value}\n${result}`;
        }
        input.value = '';
        output.scrollTop = output.scrollHeight;
      });

      container.append(output, input);
      return container;
    }
  },
  browser: {
    icon: '🌐',
    title: 'Auk Browser',
    render: () => {
      const container = document.createElement('div');
      container.className = 'browser-frame';
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.value = 'https://browser.rammerhead.org/';

      const goButton = document.createElement('button');
      goButton.textContent = 'Go';
      goButton.addEventListener('click', () => {
        const url = normalizeUrl(urlInput.value);
        if (url) frame.src = url;
      });

      urlInput.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        const url = normalizeUrl(urlInput.value);
        if (url) frame.src = url;
      });

      const frame = document.createElement('iframe');
      frame.src = 'https://browser.rammerhead.org/';
      const controlBar = document.createElement('div');
      controlBar.className = 'browser-controls';
      controlBar.append(urlInput, goButton);
      container.append(controlBar, frame);
      return container;
    }
  },
  files: {
    icon: '🗂',
    title: 'Auk Files',
    render: () => {
      const container = document.createElement('div');
      container.className = 'files-list';
      container.innerHTML = `
        <h3>Local workspace</h3>
        <ul>
          <li>index.html</li>
          <li>styles.css</li>
          <li>script.js</li>
          <li>README.md</li>
        </ul>
      `;
      return container;
    }
  },
  settings: {
    icon: '⚙️',
    title: 'Auk Settings',
    render: () => {
      const container = document.createElement('div');
      container.className = 'settings-panel';
      container.innerHTML = `
        <h3>System Settings</h3>
        <ul>
          <li><label><input type="checkbox" checked disabled /> Dark mode enabled</label></li>
          <li><label><input type="checkbox" disabled /> Notifications off</label></li>
          <li><label><input type="checkbox" disabled /> Auto-update disabled</label></li>
        </ul>
      `;
      return container;
    }
  }
  ,
  blm: {
    icon: '📦',
    title: 'BLM Package Manager',
    render: () => {
      const container = document.createElement('div');
      container.className = 'blm-manager';
      container.innerHTML = `
        <h3>BLM Package Manager (.crt)</h3>
        <div class="blm-controls">
          <input id="blm-search" placeholder="Search packages..." />
          <button id="blm-refresh">Refresh</button>
        </div>
        <div id="blm-list" class="blm-list"></div>
      `;
      setTimeout(() => renderBlmList(container.querySelector('#blm-list')) , 50);
      return container;
    }
  }
};

function getHostInfo() {
  const hostname = window.location.hostname || 'localhost';
  const platform = navigator.platform || 'web';
  return `${hostname} (${platform})`;
}

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).href;
  } catch {
    try {
      return new URL(`https://${trimmed}`).href;
    } catch {
      return null;
    }
  }
}

function getPrompt() {
  return sessionStorage.getItem('auk_root') === '1' ? 'auk ~ #' : '$';
}

function simulateBrowserOSDelete() {
  const desktop = document.getElementById('desktop');
  if (!desktop) return;
  desktop.style.display = 'none';
  let overlay = document.getElementById('os-delete-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'os-delete-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = '#000';
    overlay.style.color = '#c0c0c0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '1rem';
    overlay.style.textAlign = 'center';
    overlay.textContent = 'OS deleted in browser memory. Reload the page to restore Auk Saurian.';
    document.body.appendChild(overlay);
  }
}

function runCommand(command) {
  const parts = command.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '';
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === 'help') return 'Available commands: help, uname, uptime, clear, grabshell, whoami, hash, hash -d dir/sys/boot/kern/% ns-y, blm';
  if (cmd === 'uname') return 'Auk Saurian 1.0';
  if (cmd === 'uptime') return 'System has been running in the browser since load.';
  if (cmd === 'whoami') return sessionStorage.getItem('auk_root') === '1' ? 'root' : 'user';
  if (cmd === 'hash') {
    if (args.join(' ') === '-d dir/sys/boot/kern/% ns-y') {
      simulateBrowserOSDelete();
      return 'Deleting OS in browser memory...\nIt will return when this page reloads.';
    }
    if (sessionStorage.getItem('auk_root') === '1') return 'Already have root (simulated).';
    sessionStorage.setItem('auk_root', '1');
    return 'Root access granted (simulated)';
  }
  if (cmd === 'grabshell') {
    return `host: ${getHostInfo()}\nKernel: Auk Browser Recode\nDE: warship\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠔⠒⡒⢠⣩⣍⣁⠂⠠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⢀⠔⣡⣴⣾⣽⣹⣿⣿⣿⣿⣿⣦⡈⢂⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⢀⣤⣃⣶⣟⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⡆⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⡠⠒⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡅⢸⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⢀⣜⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣜⢨⠄⠀⠀⠀⠀⠀⠀\n` +
      `⢀⣞⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⢸⠀⠀⠀⠀⠀⠀⠀\n` +
      `⣾⠿⠛⠛⠛⡝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢢⡇⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣹⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⢿⣿⡿⠟⠛⣿⣿⣿⣿⣿⡳⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣯⡆⠀⠀⢻⣿⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡿⡗⠀⠀⣼⣿⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣧⠁⠀⠀⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⢹⠀⠀⠀⢿⣿⢳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣾⠤⡄⣀⣚⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠈⠻⠿⠿⠷⠾⢥⣬⣴⣿⢿⣿⡟⢿⠉⠛⢻⡽⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⢀⡠⢊⣡⠞⠉⠿⣌⢷⡂⢼⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⢀⠔⣡⠔⠋⠀⠀⠀⠀⠘⢦⣝⣾⣿⣽⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⣴⡡⠊⠀⠀⠀⠀⠀⢀⣀⢤⣔⣽⣿⡟⣷⣮⣔⡢⢄⡀⡀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⣶⣖⣶⠭⠿⠶⠛⠛⠉⠁⢸⠅⡇⠀⠈⠙⠛⠳⠶⢯⣵⣲⠠\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n` +
      `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡧⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n`;
  }

  if (cmd === 'blm') {
    // blm subcommands: help, search, list, install, remove, info
    const sub = (args[0] || 'help').toLowerCase();
    if (sub === 'help') return 'blm: help, search <term>, list, install <name.crt>, remove <name>';
    if (sub === 'search') {
      const term = args.slice(1).join(' ').toLowerCase();
      const found = crtRepo.filter(p => p.name.includes(term) || p.desc.toLowerCase().includes(term));
      return found.length ? found.map(p => `${p.name} - ${p.desc}`).join('\n') : 'No packages found.';
    }
    if (sub === 'list') {
      const installed = loadInstalledPackages();
      return installed.length ? installed.map(p => `${p.name} - ${p.desc}`).join('\n') : 'No packages installed.';
    }
    if (sub === 'install') {
      const pkgName = args[1] || args[0];
      if (!pkgName) return 'Usage: blm install <name.crt>';
      return installPackage(pkgName);
    }
    if (sub === 'remove') {
      const pkgName = args[1] || args[0];
      if (!pkgName) return 'Usage: blm remove <name>';
      return removePackage(pkgName);
    }
    if (sub === 'info') {
      const pkgName = args[1] || args[0];
      if (!pkgName) return 'Usage: blm info <name>';
      const p = crtRepo.find(x => x.name === pkgName || x.name.replace('.crt','') === pkgName);
      return p ? `${p.name} - ${p.desc}` : 'Package not found.';
    }
    return 'Unknown blm command. Use `blm help`.';
  }

  return `Command not found: ${command}`;
}

// ----- BLM package manager simulation -----
const crtRepo = [
  { name: 'retro-term.crt', desc: 'A retro terminal theme package' },
  { name: 'mountains-wallpaper.crt', desc: 'Extra mountain wallpapers' },
  { name: 'puffin-cursor.crt', desc: 'Cute puffin cursor theme' }
];

function loadInstalledPackages() {
  try { return JSON.parse(localStorage.getItem('blm_installed') || '[]'); } catch(e) { return []; }
}

function saveInstalledPackages(list) { localStorage.setItem('blm_installed', JSON.stringify(list)); }

function installPackage(name) {
  const pkgName = name.endsWith('.crt') ? name : name + '.crt';
  const pkg = crtRepo.find(p => p.name === pkgName);
  if (!pkg) return `Package not found in repository: ${pkgName}`;
  const installed = loadInstalledPackages();
  if (installed.find(p => p.name === pkg.name)) return `${pkg.name} is already installed.`;
  installed.push(pkg);
  saveInstalledPackages(installed);
  applyPackageEffects(pkg);
  return `Installed ${pkg.name}`;
}

function removePackage(name) {
  const key = name.replace('.crt','');
  let installed = loadInstalledPackages();
  const idx = installed.findIndex(p => p.name === name || p.name.replace('.crt','') === key);
  if (idx === -1) return `Package not installed: ${name}`;
  const pkg = installed.splice(idx,1)[0];
  saveInstalledPackages(installed);
  removePackageEffects(pkg);
  return `Removed ${pkg.name}`;
}

function setDesktopWallpaper(url) {
  const wallpaper = document.querySelector('.wallpaper');
  if (!wallpaper) return;
  if (url) {
    wallpaper.style.backgroundImage = `url('${url}')`;
    wallpaper.style.backgroundSize = 'cover';
    wallpaper.style.backgroundPosition = 'center center';
    wallpaper.style.backgroundRepeat = 'no-repeat';
    wallpaper.classList.remove('alt');
  } else {
    wallpaper.style.backgroundImage = '';
  }
}

function applyPackageEffects(pkg) {
  // Create a simple app entry for the package in start menu and desktop
  const appKey = `pkg-${pkg.name.replace(/[^a-z0-9]/gi,'')}`;
  const appTitle = pkg.name === 'mountains-wallpaper.crt' ? 'Mountains Wallpaper' : pkg.name;
  const appIcon = pkg.name === 'mountains-wallpaper.crt' ? '🏞️' : '🧩';

  apps[appKey] = {
    icon: appIcon,
    title: appTitle,
    onOpen: pkg.name === 'mountains-wallpaper.crt' ? () => setDesktopWallpaper('mountains-wallpaper.jpg') : undefined,
    render: () => {
      const c = document.createElement('div');
      c.innerHTML = `<h3>${appTitle}</h3><p>${pkg.desc}</p><p>Installed via BLM (.crt)</p>`;
      return c;
    }
  };
  createStartMenuApp(appKey, appTitle);
  createDesktopIconForApp(appKey, appTitle);
}

function removePackageEffects(pkg) {
  const appKey = `pkg-${pkg.name.replace(/[^a-z0-9]/gi,'')}`;
  delete apps[appKey];
  // remove start-menu entry & desktop icon
  const btn = document.querySelector(`.start-app[data-app="${appKey}"]`);
  if (btn) btn.remove();
  const icon = document.querySelector(`.desktop-icon[data-app="${appKey}"]`);
  if (icon) icon.remove();
}

function createStartMenuApp(appKey, title) {
  const container = document.querySelector('.start-menu-apps');
  const btn = document.createElement('button');
  btn.className = 'start-app';
  btn.dataset.app = appKey;
  const icon = apps[appKey]?.icon || '📦';
  btn.innerHTML = `<span class="app-icon">${icon}</span>${title}`;
  container.appendChild(btn);
}

function createDesktopIconForApp(appKey, title) {
  const container = document.querySelector('.desktop-icons');
  const btn = document.createElement('button');
  btn.className = 'desktop-icon';
  btn.dataset.app = appKey;
  btn.style.left = '212px';
  btn.style.top = '302px';
  const icon = apps[appKey]?.icon || '📦';
  btn.innerHTML = `<span class="app-icon">${icon}</span><span class="icon-label">${title}</span>`;
  container.appendChild(btn);
  makeIconDraggable(btn);
}

function renderBlmList(target) {
  if (!target) return;
  target.innerHTML = '';
  crtRepo.forEach(p => {
    const row = document.createElement('div');
    row.className = 'blm-row';
    row.innerHTML = `<strong>${p.name}</strong> - ${p.desc} <button data-pkg="${p.name}">Install</button>`;
    row.querySelector('button').addEventListener('click', () => {
      const out = installPackage(p.name);
      alert(out);
    });
    target.appendChild(row);
  });
}

function openApp(appKey) {
  const app = apps[appKey];
  if (!app) return;

  const existingTask = taskbar.querySelector(`[data-app="${appKey}"]`);
  if (existingTask) {
    const windowElement = document.querySelector(`.window[data-app="${appKey}"]`);
    if (windowElement) {
      focusWindow(windowElement);
      windowElement.classList.remove('hidden');
    }
    return;
  }

  const windowElement = template.content.firstElementChild.cloneNode(true);
  windowElement.dataset.app = appKey;
  const title = windowElement.querySelector('.window-title');
  const content = windowElement.querySelector('.window-content');
  if (app.icon) {
    title.innerHTML = `<span class="window-title-icon">${app.icon}</span>${app.title}`;
  } else {
    title.textContent = app.title;
  }
  const closeButton = windowElement.querySelector('.close-window');
  const minimizeButton = windowElement.querySelector('.minimize-window');
  const maximizeButton = windowElement.querySelector('.maximize-window');

  content.appendChild(app.render());
  if (typeof app.onOpen === 'function') {
    app.onOpen();
  }

  closeButton.addEventListener('click', () => {
    windowElement.remove();
    removeTaskItem(appKey);
  });

  minimizeButton.addEventListener('click', () => {
    windowElement.classList.toggle('hidden');
  });

  maximizeButton.addEventListener('click', () => {
    windowElement.classList.toggle('window-maximized');
  });

  windowElement.style.zIndex = ++zIndexCounter;
  windowElement.addEventListener('mousedown', () => {
    focusWindow(windowElement);
  });

  makeDraggable(windowElement, windowElement.querySelector('.window-header'));
  makeResizable(windowElement, windowElement.querySelector('.resize-handle'));
  windowsContainer.appendChild(windowElement);
  addTaskItem(appKey, app.title, windowElement);
}

function focusWindow(windowElement) {
  windowElement.style.zIndex = ++zIndexCounter;
  windowElement.classList.remove('hidden');
}

function addTaskItem(appKey, title, windowElement) {
  const item = document.createElement('button');
  item.className = 'task-item';
  item.dataset.app = appKey;
  item.textContent = title;
  item.addEventListener('click', () => {
    if (windowElement.classList.contains('hidden')) {
      windowElement.classList.remove('hidden');
    }
    focusWindow(windowElement);
  });
  taskbar.appendChild(item);
}

function removeTaskItem(appKey) {
  const item = taskbar.querySelector(`[data-app="${appKey}"]`);
  if (item) item.remove();
}

function makeDraggable(element, handle) {
  let isDragging = false;
  let originX = 0;
  let originY = 0;
  let startX = 0;
  let startY = 0;

  handle.addEventListener('mousedown', event => {
    if (event.target.closest('.window-button')) return;
    isDragging = true;
    originX = event.clientX;
    originY = event.clientY;
    const rect = element.getBoundingClientRect();
    startX = rect.left;
    startY = rect.top;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', event => {
    if (!isDragging) return;
    element.style.left = `${startX + event.clientX - originX}px`;
    element.style.top = `${startY + event.clientY - originY}px`;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}

function makeResizable(element, handle) {
  if (!handle) return;
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  handle.addEventListener('mousedown', event => {
    event.stopPropagation();
    isResizing = true;
    startX = event.clientX;
    startY = event.clientY;
    const rect = element.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', event => {
    if (!isResizing) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    element.style.width = `${Math.max(320, startWidth + deltaX)}px`;
    element.style.height = `${Math.max(220, startHeight + deltaY)}px`;
  });

  window.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = '';
  });
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const value = `${hours}:${minutes}`;
  clock.textContent = value;
  if (topbarClock) topbarClock.textContent = value;
}

function showBootMenu() {
  const boot = document.getElementById('bootloader');
  const bootScreen = boot.querySelector('.boot-screen');
  const progressWrapper = boot.querySelector('.boot-progress-wrapper');
  boot.classList.remove('hidden');
  bootScreen.classList.remove('hidden');
  progressWrapper.classList.add('hidden');
}

function startBoot() {
  const boot = document.getElementById('bootloader');
  const bootScreen = boot.querySelector('.boot-screen');
  const progressWrapper = boot.querySelector('.boot-progress-wrapper');
  const bar = boot.querySelector('.boot-progress-bar');
  const progressText = boot.querySelector('.boot-progress-text');

  bootScreen.classList.add('hidden');
  progressWrapper.classList.remove('hidden');
  bar.style.width = '0%';
  progressText.textContent = 'Booting Auk Saurian...';

  let pct = 0;
  const id = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) {
      pct = 100;
      bar.style.width = '100%';
      progressText.textContent = 'Boot complete.';
      clearInterval(id);
      setTimeout(() => boot.classList.add('hidden'), 600);
    } else {
      bar.style.width = pct + '%';
      progressText.textContent = 'Loading modules... ' + Math.floor(pct) + '%';
    }
  }, 220);
}

const bootStartBtn = document.getElementById('boot-start');
const bootCancelBtn = document.getElementById('boot-cancel');
const bootEntries = document.querySelectorAll('.boot-entry');

const bootEntriesArray = Array.from(bootEntries);

function selectBootEntry(index) {
  if (!bootEntriesArray.length) return;
  const normalized = ((index % bootEntriesArray.length) + bootEntriesArray.length) % bootEntriesArray.length;
  bootEntriesArray.forEach((entry, idx) => {
    entry.classList.toggle('selected', idx === normalized);
  });
}

function getSelectedBootIndex() {
  return bootEntriesArray.findIndex(entry => entry.classList.contains('selected')) || 0;
}

bootEntriesArray.forEach((entry, index) => {
  entry.addEventListener('click', () => {
    selectBootEntry(index);
  });
});

window.addEventListener('keydown', event => {
  const boot = document.getElementById('bootloader');
  const bootScreen = boot.querySelector('.boot-screen');
  if (boot.classList.contains('hidden') || bootScreen.classList.contains('hidden')) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const current = getSelectedBootIndex();
    const next = event.key === 'ArrowDown' ? current + 1 : current - 1;
    selectBootEntry(next);
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    startBoot();
  }
});

if (bootStartBtn) {
  bootStartBtn.addEventListener('click', () => startBoot());
}

if (bootCancelBtn) {
  bootCancelBtn.addEventListener('click', () => {
    const boot = document.getElementById('bootloader');
    const progressWrapper = boot.querySelector('.boot-progress-wrapper');
    const bootScreen = boot.querySelector('.boot-screen');
    bootScreen.classList.remove('hidden');
    progressWrapper.classList.add('hidden');
    boot.querySelector('.boot-progress-text').textContent = 'Boot cancelled. Select an option to continue.';
  });
}

const ctxReboot = document.getElementById('ctx-reboot');
if (ctxReboot) ctxReboot.addEventListener('click', () => { desktopContext.classList.add('hidden'); showBootMenu(); });

// Show GRUB-style boot menu on initial load
showBootMenu();

function toggleStartMenu() {
  startMenu.classList.toggle('hidden');
}

function closeStartMenu() {
  startMenu.classList.add('hidden');
}

function filterStartApps(value) {
  startApps.forEach(button => {
    const label = button.textContent.toLowerCase();
    button.style.display = label.includes(value.toLowerCase()) ? 'block' : 'none';
  });
}

function makeIconDraggable(icon) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let iconLeft = 0;
  let iconTop = 0;
  let moved = false;

  icon.addEventListener('mousedown', event => {
    if (event.button !== 0) return;
    isDragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    const rect = icon.getBoundingClientRect();
    iconLeft = rect.left;
    iconTop = rect.top;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', event => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      moved = true;
    }
    icon.style.left = `${Math.max(16, iconLeft + deltaX)}px`;
    icon.style.top = `${Math.max(16, iconTop + deltaY)}px`;
  });

  window.addEventListener('mouseup', event => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
    if (moved) {
      event.preventDefault();
    }
  });

  icon.addEventListener('click', event => {
    if (moved) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    openApp(icon.dataset.app);
  });
}

desktopIcons.forEach(button => {
  makeIconDraggable(button);
});

quickLaunch.forEach(button => {
  button.addEventListener('click', () => openApp(button.dataset.app));
});

startButton.addEventListener('click', event => {
  event.stopPropagation();
  toggleStartMenu();
});

// workspace switcher handlers
workspaceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    workspaceButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const idx = btn.dataset.ws;
    document.getElementById('workspace-label').textContent = `Workspace ${idx}`;
  });
});

// Desktop context menu
desktop.addEventListener('contextmenu', event => {
  event.preventDefault();
  const x = event.clientX;
  const y = event.clientY;
  desktopContext.style.left = `${x}px`;
  desktopContext.style.top = `${y}px`;
  desktopContext.classList.remove('hidden');
});

window.addEventListener('click', () => {
  desktopContext.classList.add('hidden');
});

document.getElementById('ctx-refresh').addEventListener('click', () => location.reload());
document.getElementById('ctx-toggle-wallpaper').addEventListener('click', () => {
  document.querySelector('.wallpaper').classList.toggle('alt');
  desktopContext.classList.add('hidden');
});

const startMenuAppsContainer = document.querySelector('.start-menu-apps');
startMenuAppsContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.start-app');
  if (!btn) return;
  openApp(btn.dataset.app);
  closeStartMenu();
});

startSearch.addEventListener('input', event => {
  filterStartApps(event.target.value);
});

window.addEventListener('click', event => {
  if (!startMenu.contains(event.target) && event.target !== startButton) {
    closeStartMenu();
  }
});

updateClock();
setInterval(updateClock, 10000);

window.addEventListener('keydown', event => {
  if (event.shiftKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    openApp('tty');
  }
});
