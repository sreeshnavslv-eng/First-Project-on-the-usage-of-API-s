const API_KEY = 'openuv-1ddg1crmsyhhqlf-io';
const btn = document.getElementById('btn');
const out = document.getElementById('out');

btn.onclick = () => {
  out.textContent = 'Getting location...';
  if (!navigator.geolocation) return void (out.textContent = 'Geolocation not supported');
  navigator.geolocation.getCurrentPosition(p => {
    const lat = p.coords.latitude, lng = p.coords.longitude;
    out.textContent = 'Checking UV...';
    fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, { headers: { 'x-access-token': API_KEY } })
      .then(r => r.json())
      .then(d => {
        const uv = d?.result?.uv ?? d?.result?.uv_max ?? null;
        if (uv == null) return void (out.textContent = 'UV data unavailable');
        const msg = uv < 3 ? `UV ${uv.toFixed(1)} — Low: sunscreen usually not needed.`
                  : uv < 6 ? `UV ${uv.toFixed(1)} — Moderate: consider sunscreen.`
                  : uv < 8 ? `UV ${uv.toFixed(1)} — High: apply sunscreen.`
                  : `UV ${uv.toFixed(1)} — Very high: use high-SPF and seek shade.`;
        out.textContent = msg;
      })
      .catch(e => out.textContent = 'API error: ' + (e.message || e));
  }, e => out.textContent = 'Location error: ' + (e.message || e.code), { timeout: 15000 });
};
