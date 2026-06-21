// ============================================================
// AUREATE — Customer App Controller
// Routes: shopHome -> booking -> queueStatus
// ============================================================

const AppState = {
  route: 'splash',
  selectedBarberId: null,
  booking: { serviceIds: [] },
  myEntryId: null,
};

function navigate(route, params) {
  AppState.route = route;
  if (params) Object.assign(AppState, params);
  render();
  window.scrollTo(0, 0);
}

function render() {
  const app = document.getElementById('app');
  switch (AppState.route) {
    case 'splash':
      app.innerHTML = renderSplash();
      break;
    case 'shopHome':
    case 'barberSelect':
      app.innerHTML = renderShopHome();
      break;
    case 'booking':
      app.innerHTML = renderBooking(AppState.selectedBarberId);
      break;
    case 'queueStatus':
    case 'myQueueDemo':
      if (!AppState.myEntryId) {
        const demo = Store.addBooking({
          barberId: 'b-julian', customerName: 'You', customerPhone: '',
          serviceIds: ['svc-cut'], source: 'online',
        });
        AppState.myEntryId = demo.id;
      }
      app.innerHTML = renderQueueStatus(AppState.myEntryId);
      break;
    default:
      app.innerHTML = renderShopHome();
  }
}

function selectBarber(barberId) {
  AppState.selectedBarberId = barberId;
  AppState.booking = { serviceIds: [] };
  navigate('booking');
}

function toggleService(serviceId) {
  const idx = AppState.booking.serviceIds.indexOf(serviceId);
  if (idx === -1) AppState.booking.serviceIds.push(serviceId);
  else AppState.booking.serviceIds.splice(idx, 1);
  render();
}

function confirmBooking(barberId) {
  const name = document.getElementById('custName')?.value.trim() || 'Guest';
  const phone = document.getElementById('custPhone')?.value.trim() || '';
  if (AppState.booking.serviceIds.length === 0) return;

  const entry = Store.addBooking({
    barberId, customerName: name, customerPhone: phone,
    serviceIds: [...AppState.booking.serviceIds], source: 'online',
  });
  AppState.myEntryId = entry.id;

  const position = Store.queueForBarber(barberId).findIndex(e => e.id === entry.id) + 1;
  document.getElementById('toastPosition').textContent = '#' + position;
  document.getElementById('confirmToast').classList.add('show');
}

function closeToastAndGoToQueue() {
  document.getElementById('confirmToast').classList.remove('show');
  navigate('queueStatus');
}

function leaveQueue(entryId) {
  Store.setStatus(entryId, 'no-show');
  AppState.myEntryId = null;
  navigate('shopHome');
}

// Live ticking so the countdown/queue position feels alive
setInterval(() => {
  if (AppState.route === 'queueStatus' || AppState.route === 'myQueueDemo') render();
}, 1000);

render();

// Register service worker so the app is installable as a PWA
// ("Add to Home Screen" on mobile, with no browser bar when launched)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Auto-advance from splash to the shop home after a brief brand moment
if (AppState.route === 'splash') {
  setTimeout(() => {
    if (AppState.route === 'splash') navigate('shopHome');
  }, 1800);
}
