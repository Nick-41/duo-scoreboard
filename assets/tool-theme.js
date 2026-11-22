(() => {
  const key = 'duo-hub-theme-v1';
  const system = matchMedia('(prefers-color-scheme: dark)');
  function refreshTheme() {
    let saved;
    try { saved = localStorage.getItem(key); } catch {}
    const dark = saved === 'dark' || (saved !== 'light' && system.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = dark ? '#171124' : '#f7f5fc';
  }
  refreshTheme();
  system.addEventListener('change', refreshTheme);
  window.addEventListener('pageshow', refreshTheme);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) refreshTheme();
  });
})();
