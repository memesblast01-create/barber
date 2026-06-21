// ============================================================
// AUREATE — Screen Templates
// Each function returns an HTML string for a screen.
// Screens are rendered into #app by app.js based on current route.
// ============================================================

function iconBtn(icon) {
  return `<span class="material-symbols-outlined">${icon}</span>`;
}

// ---------- SCREEN: Splash (app launch moment) ----------
function renderSplash() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center bg-background px-margin" style="min-height:100dvh;">
      <div class="flex flex-col items-center" style="animation: splashIn 0.9s ease forwards;">
        <h1 class="font-display-lg text-5xl tracking-[0.15em] text-primary uppercase" style="text-shadow: 0 0 32px rgba(242,202,80,0.35);">AUREATE</h1>
        <div class="w-10 h-px bg-primary-container mt-4 mb-3"></div>
        <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.25em]">Grooming Lounge</p>
      </div>
    </div>
    <style>
      @keyframes splashIn {
        0% { opacity: 0; transform: scale(0.92) translateY(6px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
    </style>
  `;
}

function topBar(activeTab) {
  return `
  <header class="fixed top-0 w-full h-20 bg-background border-b border-outline-variant shadow-sm z-40 flex justify-between items-center px-margin">
    <div class="cursor-pointer active:opacity-80 transition-colors hover:text-primary-container">
      <span class="material-symbols-outlined text-primary">menu</span>
    </div>
    <h1 class="font-display-lg text-2xl md:text-display-lg tracking-widest text-primary uppercase">AUREATE</h1>
    <div class="h-10 w-10 rounded-full border border-outline-variant overflow-hidden cursor-pointer active:opacity-80">
      <img class="w-full h-full object-cover" src="${Store.CUSTOMER_AVATAR}"/>
    </div>
  </header>`;
}

function bottomNav(active) {
  const items = [
    { key: 'lounge', icon: 'chair_alt', label: 'Lounge', route: 'shopHome' },
    { key: 'book', icon: 'calendar_month', label: 'Book', route: 'barberSelect' },
    { key: 'queue', icon: 'hourglass_empty', label: 'Queue', route: 'myQueueDemo' },
    { key: 'account', icon: 'person', label: 'Account', route: 'shopHome' },
  ];
  return `
  <nav class="fixed bottom-0 w-full flex justify-around items-center h-20 px-4 pb-safe bg-surface-container-low border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-40">
    ${items.map(it => `
      <div class="nav-item flex flex-col items-center justify-center gap-1 ${active === it.key ? 'is-active font-bold' : 'text-on-surface-variant'} hover:text-secondary-fixed transition-all active:scale-95"
           onclick="navigate('${it.route}')">
        <span class="material-symbols-outlined" ${active === it.key ? `style="font-variation-settings: 'FILL' 1;"` : ''}>${it.icon}</span>
        <span class="font-label-sm text-label-sm">${it.label}</span>
      </div>
    `).join('')}
  </nav>`;
}

// ---------- SCREEN: Shop Home (barber list) ----------
function renderShopHome() {
  const rows = Store.barbers.map(b => {
    const isLive = b.status === 'live';
    const q = Store.queueForBarber(b.id);
    const wait = isLive ? Store.estimateWaitForNewBooking(b.id) : null;
    const waitPct = wait ? Math.min(100, Math.round((wait / 60) * 100)) : 0;

    return `
    <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md luxury-shadow mb-md cursor-pointer active:scale-[0.98] transition-transform"
         onclick="${isLive ? `selectBarber('${b.id}')` : ''}">
      <div class="flex items-center justify-between mb-sm">
        <div class="flex items-center gap-3">
          <div class="relative w-14 h-14 rounded-full overflow-hidden border border-primary-container flex-shrink-0">
            <img class="w-full h-full object-cover" src="${b.photo}"/>
          </div>
          <div>
            <div class="font-headline-md text-headline-md text-primary leading-tight">${b.name}</div>
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide flex items-center gap-1 mt-1">
              ${isLive ? `<span class="w-2 h-2 rounded-full bg-secondary-container pulse-amber inline-block"></span> ${q.length} in line` : `<span class="material-symbols-outlined text-[14px]">block</span> Not accepting queue`}
            </div>
          </div>
        </div>
        <div class="text-right font-label-md text-label-md text-on-surface-variant uppercase">${b.title}</div>
      </div>
      <div class="flex items-center justify-between mt-sm">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Estimated Wait</span>
        <span class="font-display-lg text-2xl ${isLive ? 'text-primary-container' : 'text-on-surface-variant opacity-50'}">${isLive ? wait + ' MIN' : 'N/A'}</span>
      </div>
      <div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-sm">
        ${isLive ? `<div class="h-full animate-shimmer rounded-full" style="width:${Math.max(waitPct, 8)}%"></div>` : ''}
      </div>
    </div>`;
  }).join('');

  return `
    ${topBar()}
    <main class="pt-24 pb-24 px-margin max-w-lg mx-auto">
      <div class="relative w-full h-40 rounded-xl overflow-hidden mb-lg luxury-shadow border border-outline-variant" style="background: radial-gradient(circle at 30% 30%, #2d2a21, #16130b 75%);">
        <div class="absolute inset-0 flex flex-col justify-end p-md">
          <span class="font-label-sm text-label-sm text-primary uppercase tracking-[0.25em] mb-1">Est. 2024 &bull; Dubai</span>
          <h2 class="font-display-lg text-2xl text-on-surface leading-tight">Precision Grooming,<br/>Without the Wait</h2>
        </div>
        <div class="absolute top-3 right-3 flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur px-3 py-1 rounded-full border border-outline-variant">
          <div class="w-1.5 h-1.5 rounded-full bg-secondary-container pulse-amber"></div>
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">${Store.barbers.filter(b => b.status === 'live').length} Live Now</span>
        </div>
      </div>

      <h2 class="font-display-lg text-3xl md:text-display-lg text-on-surface mb-1">Select Your Artisan</h2>
      <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Exceptional craft, tailored for the modern gentleman.</p>
      ${rows}
    </main>
    ${bottomNav('lounge')}
  `;
}

// ---------- SCREEN: Barber Select (same listing as home, framed as the booking entry point) ----------
function renderBarberSelect() {
  return renderShopHome();
}

// ---------- SCREEN: Booking ----------
function renderBooking(barberId) {
  const barber = Store.getBarber(barberId);
  const state = AppState.booking;

  const serviceRows = Store.services.map(s => {
    const selected = state.serviceIds.includes(s.id);
    return `
    <div class="w-full bg-surface-container-low border ${selected ? 'border-primary' : 'border-outline-variant'} rounded-xl p-md mb-sm cursor-pointer active:scale-[0.98] transition-all"
         onclick="toggleService('${s.id}')">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-body-lg text-body-lg text-on-surface font-semibold">${s.name}</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant mt-1">${s.duration}m &bull; ${s.desc}</div>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-body-lg text-body-lg text-primary">AED ${s.price}</span>
          <div class="w-6 h-6 rounded-full border-2 ${selected ? 'bg-primary-container border-primary-container' : 'border-outline'} flex items-center justify-center flex-shrink-0">
            ${selected ? '<span class="material-symbols-outlined text-[16px] text-on-primary">check</span>' : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const hasSelection = state.serviceIds.length > 0;
  const wait = hasSelection ? Store.estimateWaitForNewBooking(barberId) + Store.serviceDuration(state.serviceIds) : 0;
  const position = Store.positionForNewBooking(barberId);
  const totalPrice = Store.servicePrice(state.serviceIds);

  return `
    ${topBar()}
    <main class="pt-24 pb-32 px-margin max-w-lg mx-auto">
      <button onclick="navigate('barberSelect')" class="flex items-center gap-1 text-on-surface-variant mb-md font-label-sm text-label-sm uppercase tracking-widest">
        <span class="material-symbols-outlined text-[18px]">arrow_back</span> Back
      </button>
      <h2 class="font-display-lg text-3xl md:text-display-lg text-on-surface mb-lg">Secure Your Spot</h2>

      <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-center gap-3 mb-lg">
        <div class="w-12 h-12 rounded-full overflow-hidden border border-primary-container">
          <img class="w-full h-full object-cover" src="${barber.photo}"/>
        </div>
        <div>
          <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">Your Barber</div>
          <div class="font-headline-md text-headline-md text-on-surface">${barber.name}</div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-sm">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Select Services</span>
        <span class="font-label-sm text-label-sm text-primary uppercase tracking-widest">Multi-Select Enabled</span>
      </div>
      ${serviceRows}

      ${hasSelection ? `
      <div class="w-full bg-surface-container-low border border-primary-container/40 rounded-xl p-md text-center mt-lg luxury-shadow">
        <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Queue Position</div>
        <div class="font-display-lg text-3xl text-primary mb-sm">#${position} <span class="text-base text-on-surface-variant font-body-md">in line</span></div>
        <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Est. Wait Time</div>
        <div class="font-display-lg text-2xl text-on-surface">⏳ ${wait} min</div>
        <div class="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-sm">
          <div class="h-full bg-primary-container rounded-full" style="width:${Math.min(100, position * 20)}%"></div>
        </div>
      </div>` : ''}

      <div class="mt-lg">
        <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">Final Details</div>
        <label class="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Full Name</label>
        <input id="custName" type="text" placeholder="e.g. Julian Vane"
          class="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface mb-md focus:border-primary focus:outline-none"/>
        <label class="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Phone Number</label>
        <input id="custPhone" type="tel" placeholder="+971 5X XXX XXXX"
          class="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface mb-lg focus:border-primary focus:outline-none"/>
      </div>

      <button onclick="confirmBooking('${barberId}')" ${!hasSelection ? 'disabled' : ''}
        class="w-full ${hasSelection ? 'bg-primary-container text-on-primary' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'} font-bold py-md rounded-lg luxury-shadow active:scale-95 transition-transform uppercase tracking-widest text-label-md">
        Confirm Booking
      </button>
    </main>
  `;
}

// ---------- SCREEN: My Queue Status (customer view after booking) ----------
function renderQueueStatus(entryId) {
  const entry = Store.getEntry(entryId);
  if (!entry) return renderShopHome();
  const barber = Store.getBarber(entry.barberId);
  const myQueue = Store.queueForBarber(entry.barberId);
  const myIndex = myQueue.findIndex(q => q.id === entry.id);
  const position = myIndex === -1 ? 1 : myIndex + 1;

  // recompute wait ahead of this entry
  let waitAhead = 0;
  for (let i = 0; i < myIndex; i++) {
    const e = myQueue[i];
    if (e.status === 'in-progress') {
      const elapsedMin = (Date.now() - e.startedAt) / 60000;
      waitAhead += Math.max(Store.serviceDuration(e.serviceIds) - elapsedMin, 5);
    } else {
      waitAhead += Store.serviceDuration(e.serviceIds);
    }
  }
  waitAhead = Math.max(Math.round(waitAhead), 1);

  const totalForRing = 60; // ring maxes out visually at 60 min
  const pct = Math.max(0, Math.min(1, 1 - waitAhead / totalForRing));
  const circumference = 301.59;
  const dashOffset = Math.round(circumference * (1 - pct));

  const minutes = Math.floor(waitAhead);
  const startTime = new Date(Date.now() + waitAhead * 60000);
  const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const serviceNames = entry.serviceIds.map(id => Store.getService(id).name).join(' + ');
  const totalPrice = Store.servicePrice(entry.serviceIds);

  return `
    ${topBar()}
    <main class="pt-24 pb-24 px-margin max-w-lg mx-auto flex flex-col items-center">
      <div class="flex items-center gap-2 mb-base">
        <div class="w-2 h-2 rounded-full bg-secondary-container pulse-amber"></div>
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Barber is Live</span>
      </div>

      <section class="relative w-72 h-72 flex flex-col items-center justify-center my-lg">
        <div class="absolute inset-0 rounded-full border-[1px] border-outline-variant opacity-30"></div>
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" stroke-width="1" class="text-outline-variant"></circle>
          <circle cx="50" cy="50" fill="none" r="48" stroke="#d4af37" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" stroke-linecap="round" stroke-width="3"
            style="transition: stroke-dashoffset 0.6s ease;"></circle>
        </svg>
        <div class="text-center z-10">
          <span class="font-label-md text-label-md text-primary uppercase tracking-[0.2em] block mb-2">Wait Time</span>
          <div class="font-display-lg text-[64px] text-on-surface leading-none mb-2">${minutes}</div>
          <span class="font-display-lg text-headline-lg-mobile text-primary-container opacity-90">MINS</span>
        </div>
      </section>

      <div class="w-full mb-lg text-center">
        <div class="font-headline-md text-headline-md text-on-surface mb-xs">${position === 1 ? "You're next" : ordinal(position) + ' in line'}</div>
        <div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-sm">
          <div class="h-full animate-shimmer rounded-full" style="width:${Math.max(15, 100 - position * 20)}%"></div>
        </div>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-sm">Estimated start time: ${startTimeStr}</p>
      </div>

      <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md luxury-shadow mb-lg">
        <h3 class="font-label-md text-label-md text-primary uppercase tracking-widest mb-md border-b border-outline-variant pb-base">Reservation Details</h3>
        <div class="flex items-center gap-md mb-md">
          <div class="w-14 h-14 rounded-full overflow-hidden border border-primary-container flex-shrink-0">
            <img class="w-full h-full object-cover" src="${barber.photo}"/>
          </div>
          <div>
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">${barber.title}</div>
            <div class="font-headline-md text-headline-md text-on-surface">${barber.name}</div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">Service</div>
            <div class="font-body-lg text-body-lg text-on-surface font-semibold">${serviceNames}</div>
          </div>
          <div class="text-right">
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">Cost</div>
            <div class="font-body-lg text-body-lg text-primary">AED ${totalPrice}.00</div>
          </div>
        </div>
      </div>

      <div class="w-full space-y-md">
        <button class="w-full bg-primary-container text-on-primary font-bold py-md rounded-lg luxury-shadow active:scale-95 transition-transform duration-200 uppercase tracking-widest text-label-md flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">qr_code</span> Check-in Code
        </button>
        <button onclick="leaveQueue(${entry.id})" class="w-full bg-transparent border border-error text-error font-bold py-md rounded-lg active:scale-95 transition-transform duration-200 uppercase tracking-widest text-label-md hover:bg-error/10">
          Leave Queue
        </button>
      </div>
    </main>
    ${bottomNav('queue')}
  `;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---------- SCREEN: Barber Dashboard ----------
function renderBarberDashboard(barberId) {
  barberId = barberId || 'b-julian';
  const barber = Store.getBarber(barberId);
  const q = Store.queueForBarber(barberId);
  const inProgress = q.find(e => e.status === 'in-progress');
  const waiting = q.filter(e => e.status === 'waiting');

  const inProgressHtml = inProgress ? (() => {
    const elapsedMin = Math.floor((Date.now() - inProgress.startedAt) / 60000);
    const elapsedSec = Math.floor(((Date.now() - inProgress.startedAt) % 60000) / 1000);
    const dur = Store.serviceDuration(inProgress.serviceIds);
    const pct = Math.min(100, Math.round((elapsedMin / dur) * 100));
    const finishTime = new Date(inProgress.startedAt + dur * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const svcNames = inProgress.serviceIds.map(id => Store.getService(id).name).join(' & ');
    return `
    <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md luxury-shadow mb-lg">
      <div class="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2">In The Chair</div>
      <div class="flex items-center gap-3 mb-md">
        <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-on-surface-variant">person</span>
        </div>
        <div>
          <div class="font-headline-md text-headline-md text-on-surface">${inProgress.customerName}</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant">${svcNames} &bull; ${dur} min</div>
        </div>
      </div>
      <div class="flex gap-sm mb-md">
        <button onclick="completeEntry(${inProgress.id})" class="flex-1 bg-primary-container text-on-primary font-bold py-sm rounded-lg uppercase tracking-widest text-label-sm flex items-center justify-center gap-1 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-[18px]">check_circle</span> Complete
        </button>
        <button onclick="noShowEntry(${inProgress.id})" class="flex-1 bg-transparent border border-outline text-on-surface-variant font-bold py-sm rounded-lg uppercase tracking-widest text-label-sm flex items-center justify-center gap-1 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-[18px]">cancel</span> No Show
        </button>
      </div>
      <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
        <span>Elapsed: ${elapsedMin}:${elapsedSec.toString().padStart(2, '0')}</span>
        <span>Estimated Finish: ${finishTime}</span>
      </div>
      <div class="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
        <div class="h-full bg-primary-container rounded-full" style="width:${pct}%"></div>
      </div>
    </div>`;
  })() : `
    <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-lg luxury-shadow mb-lg text-center">
      <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">chair_alt</span>
      <div class="font-body-md text-body-md text-on-surface-variant">Chair is empty. Start the next customer below.</div>
    </div>`;

  const waitingHtml = waiting.map((e, i) => {
    const dur = Store.serviceDuration(e.serviceIds);
    const svcNames = e.serviceIds.map(id => Store.getService(id).name).join(' + ');
    const isNext = i === 0;
    return `
    <div class="flex items-center gap-3 py-sm border-b border-outline-variant ${isNext ? 'border-l-2 border-l-primary pl-2' : ''}">
      <div class="w-16 font-label-sm text-label-sm ${isNext ? 'text-primary' : 'text-on-surface-variant'} uppercase">${isNext ? 'Next Up' : ''}</div>
      <div class="flex-1">
        <div class="font-body-md text-body-md text-on-surface font-medium flex items-center gap-2">
          ${e.customerName}
          <span class="text-[10px] px-2 py-0.5 rounded-full ${e.source === 'walk-in' ? 'bg-secondary-container/30 text-secondary' : 'bg-tertiary-container/20 text-tertiary'} uppercase tracking-wide">${e.source === 'walk-in' ? 'Walk-in' : 'Online'}</span>
        </div>
        <div class="font-label-sm text-label-sm text-on-surface-variant">${svcNames} &bull; ${dur} min</div>
      </div>
      ${isNext ? `<button onclick="startEntry(${e.id})" class="bg-primary-container text-on-primary rounded-full w-9 h-9 flex items-center justify-center active:scale-95 transition-transform"><span class="material-symbols-outlined text-[20px]">play_arrow</span></button>`
               : `<div class="bg-surface-container-high text-on-surface-variant rounded-full w-9 h-9 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">lock</span></div>`}
    </div>`;
  }).join('');

  const servicedToday = 12; // mock running total for demo
  const shiftPct = Math.min(100, Math.round(((servicedToday) / (servicedToday + waiting.length + (inProgress ? 1 : 0))) * 100));

  return `
    ${topBar()}
    <main class="pt-24 pb-32 px-margin max-w-lg mx-auto">
      <div class="flex items-center justify-between mb-lg">
        <h2 class="font-display-lg text-2xl md:text-display-lg text-on-surface">${barber.name}</h2>
        <select onchange="switchBarberDashboard(this.value)" class="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface-variant text-sm">
          ${Store.barbers.map(b => `<option value="${b.id}" ${b.id === barberId ? 'selected' : ''}>${b.name}</option>`).join('')}
        </select>
      </div>

      ${inProgressHtml}

      <div class="flex items-center justify-between mb-sm">
        <h3 class="font-headline-md text-headline-md text-primary flex items-center gap-2">
          <span class="material-symbols-outlined">hourglass_top</span> Upcoming Queue
        </h3>
        <span class="bg-surface-container-high text-on-surface-variant text-xs px-3 py-1 rounded-full">${waiting.length} Waiting</span>
      </div>
      <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md luxury-shadow mb-lg">
        ${waiting.length ? waitingHtml : '<div class="text-on-surface-variant font-body-md py-4 text-center">No one waiting right now.</div>'}
      </div>

      <div class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md luxury-shadow mb-lg">
        <h3 class="font-headline-md text-headline-md text-primary mb-md flex items-center gap-2">
          <span class="material-symbols-outlined">person_add</span> Quick Entry
        </h3>
        <label class="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Customer Name</label>
        <input id="walkinName" type="text" placeholder="e.g. John Smith"
          class="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm text-on-surface mb-md focus:border-primary focus:outline-none"/>
        <label class="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">Service Selection</label>
        <div id="walkinServices" class="grid grid-cols-2 gap-2 mb-md">
          ${Store.services.slice(0, 4).map(s => `
            <button type="button" data-svc="${s.id}" onclick="toggleWalkinService('${s.id}', this)"
              class="walkin-svc-btn bg-surface-container border border-outline-variant rounded-lg py-2 px-2 text-on-surface-variant text-sm">
              ${s.name}
            </button>`).join('')}
        </div>
        <div class="flex justify-between items-center mb-md font-label-sm text-label-sm">
          <span class="text-on-surface-variant uppercase">Estimated Wait</span>
          <span id="walkinEta" class="text-primary font-semibold">— Minutes</span>
        </div>
        <button onclick="addWalkin('${barberId}')" class="w-full bg-primary-container text-on-primary font-bold py-md rounded-lg uppercase tracking-widest text-label-md active:scale-95 transition-transform">Add to Queue</button>
      </div>

      <div class="flex items-center justify-between mb-2">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Shift Progress</span>
        <span class="font-label-sm text-label-sm text-on-surface-variant">${shiftPct}%</span>
      </div>
      <div class="flex gap-sm">
        <div class="flex-1 bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
          <div class="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Serviced</div>
          <div class="font-display-lg text-2xl text-primary">${servicedToday}</div>
        </div>
        <div class="flex-1 bg-surface-container-low border border-outline-variant rounded-xl p-md text-center">
          <div class="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Pending</div>
          <div class="font-display-lg text-2xl text-on-surface">${waiting.length + (inProgress ? 1 : 0)}</div>
        </div>
      </div>
    </main>
    <div class="fixed bottom-24 right-margin">
      <button class="bg-primary-container w-14 h-14 rounded-full flex items-center justify-center luxury-shadow active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-on-primary">add</span>
      </button>
    </div>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-on-surface-variant text-xs uppercase tracking-widest opacity-60">Staff Dashboard</div>
  `;
}

// ---------- SCREEN: Shop Display (TV / kiosk view) ----------
function renderShopDisplay() {
  const cols = Store.barbers.map(b => {
    const q = Store.queueForBarber(b.id);
    const inProgress = q.find(e => e.status === 'in-progress');
    const waiting = q.filter(e => e.status === 'waiting');
    const isLive = b.status === 'live';

    return `
    <div class="flex-1 min-w-[220px] bg-surface-container-low border border-outline-variant rounded-xl p-md ${!isLive ? 'opacity-60' : ''}">
      <div class="flex items-center gap-3 mb-md">
        <div class="w-14 h-14 rounded-lg overflow-hidden border border-primary-container flex-shrink-0">
          <img class="w-full h-full object-cover" src="${b.photo}"/>
        </div>
        <div>
          <div class="font-headline-md text-xl text-on-surface leading-tight">${b.name}</div>
          <div class="font-label-sm text-label-sm ${isLive ? 'text-secondary' : 'text-on-surface-variant'} uppercase tracking-wide flex items-center gap-1">
            <span class="w-2 h-2 rounded-full ${isLive ? 'bg-secondary-container pulse-amber' : 'bg-outline'} inline-block"></span> ${isLive ? 'Live Now' : 'Away'}
          </div>
        </div>
      </div>

      ${isLive && inProgress ? `
      <div class="bg-surface-container-high border-l-4 border-primary-container rounded-lg p-3 mb-md">
        <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Now Serving</div>
        <div class="font-display-lg text-2xl text-primary leading-tight">${firstNameLast(inProgress.customerName)}<span class="text-on-surface-variant text-sm"> #${String(inProgress.id).padStart(3, '0')}</span></div>
      </div>` : !isLive ? `
      <div class="bg-surface-container-high rounded-lg p-3 mb-md relative overflow-hidden">
        <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Returning At</div>
        <div class="font-display-lg text-2xl text-on-surface">15:15</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="border border-outline text-outline px-3 py-1 text-xs uppercase tracking-widest -rotate-12">On Break</span>
        </div>
      </div>` : `<div class="bg-surface-container-high rounded-lg p-3 mb-md text-on-surface-variant text-sm">No one in chair</div>`}

      <div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Up Next</div>
      <div class="space-y-2">
        ${waiting.slice(0, 3).map(e => `
          <div class="flex justify-between text-sm border-b border-outline-variant/50 pb-1">
            <span class="text-on-surface">${firstNameLast(e.customerName)}</span>
            <span class="text-on-surface-variant">#${String(e.id).padStart(3, '0')}</span>
          </div>`).join('') || '<div class="text-on-surface-variant text-sm">Queue is clear</div>'}
      </div>
    </div>`;
  }).join('');

  const totalWaiting = Store.barbers.reduce((sum, b) => sum + Store.queueForBarber(b.id).filter(e => e.status === 'waiting').length, 0);
  const avgWait = Math.round(Store.barbers.filter(b => b.status === 'live').reduce((sum, b) => sum + Store.estimateWaitForNewBooking(b.id), 0) / Math.max(1, Store.barbers.filter(b => b.status === 'live').length));
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return `
    <div class="min-h-screen bg-background p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-display-lg text-4xl text-primary tracking-widest" style="text-shadow: 0 0 24px rgba(242,202,80,0.35);">AUREATE</h1>
        <div class="flex items-center gap-8">
          <div class="text-right">
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">Est. Wait Time</div>
            <div class="font-display-lg text-2xl text-on-surface">${avgWait} MIN</div>
          </div>
          <div class="w-px h-10 bg-outline-variant"></div>
          <div class="text-right">
            <div class="font-label-sm text-label-sm text-on-surface-variant uppercase">Local Time</div>
            <div class="font-display-lg text-2xl text-on-surface">${now}</div>
          </div>
          <div class="w-12 h-12 rounded-full border border-primary-container flex items-center justify-center bg-surface-container-low">
            <span class="font-display-lg text-xl text-primary">A</span>
          </div>
        </div>
      </div>
      <div class="flex gap-6 flex-wrap">${cols}</div>
      <div class="fixed bottom-6 right-6 text-on-surface-variant text-xs opacity-30">Aureate Lounge Display</div>
    </div>
  `;
}

function firstNameLast(fullName) {
  const parts = fullName.split(' ');
  if (parts.length < 2) return fullName;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
