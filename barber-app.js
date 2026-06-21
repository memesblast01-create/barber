// ============================================================
// AUREATE — Barber/Staff App Controller
// Single route: barberDashboard (with a barber switcher dropdown)
// ============================================================

const AppState = {
  route: 'barberDashboard',
  currentBarberDash: 'b-julian',
  walkinSelected: [],
};

function navigate(route, params) {
  AppState.route = route;
  if (params) Object.assign(AppState, params);
  render();
  window.scrollTo(0, 0);
}

function render() {
  document.getElementById('app').innerHTML = renderBarberDashboard(AppState.currentBarberDash);
}

function switchBarberDashboard(barberId) {
  AppState.currentBarberDash = barberId;
  render();
}

function startEntry(entryId) {
  Store.setStatus(entryId, 'in-progress');
  render();
}

function completeEntry(entryId) {
  Store.setStatus(entryId, 'done');
  render();
}

function noShowEntry(entryId) {
  Store.setStatus(entryId, 'no-show');
  render();
}

function toggleWalkinService(serviceId, btnEl) {
  const idx = AppState.walkinSelected.indexOf(serviceId);
  if (idx === -1) {
    AppState.walkinSelected.push(serviceId);
    btnEl.classList.add('bg-primary-container', 'text-on-primary', 'border-primary-container');
    btnEl.classList.remove('bg-surface-container', 'text-on-surface-variant', 'border-outline-variant');
  } else {
    AppState.walkinSelected.splice(idx, 1);
    btnEl.classList.remove('bg-primary-container', 'text-on-primary', 'border-primary-container');
    btnEl.classList.add('bg-surface-container', 'text-on-surface-variant', 'border-outline-variant');
  }
  const eta = Store.serviceDuration(AppState.walkinSelected);
  const etaEl = document.getElementById('walkinEta');
  if (etaEl) etaEl.textContent = AppState.walkinSelected.length ? eta + ' Minutes' : '— Minutes';
}

function addWalkin(barberId) {
  const name = document.getElementById('walkinName')?.value.trim();
  if (!name || AppState.walkinSelected.length === 0) {
    alert('Enter a name and select at least one service.');
    return;
  }
  Store.addBooking({
    barberId, customerName: name, serviceIds: [...AppState.walkinSelected], source: 'walk-in',
  });
  AppState.walkinSelected = [];
  render();
}

// Live ticking so elapsed time / chair timer updates in real time
setInterval(render, 1000);

render();
