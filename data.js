// ============================================================
// AUREATE — Mock Data Store
// Simulates a live backend in-memory so all screens (customer,
// barber, shop display) read/write the same shared state.
// Swap this file out for real Supabase/Firebase calls later —
// every other screen only talks to the functions below, never
// touches raw arrays directly, so the swap is contained here.
// ============================================================

const Store = (function () {
  let nextQueueId = 100;

  const services = [
    { id: 'svc-cut', name: 'The Signature Cut', duration: 30, price: 240, desc: 'Expert fading & styling' },
    { id: 'svc-beard', name: 'Beard Sculpt', duration: 20, price: 130, desc: 'Hot towel & razor finish' },
    { id: 'svc-royal', name: 'The Royal Flush', duration: 45, price: 310, desc: 'Cut, wash, and charcoal mask' },
    { id: 'svc-shave', name: 'Classic Royal Shave', duration: 45, price: 260, desc: 'Full face straight-razor shave' },
    { id: 'svc-facial', name: 'Executive Facial', duration: 35, price: 400, desc: 'Deep pore cleansing & rehydration' },
  ];

  const barbers = [
    { id: 'b-julian', name: 'Julian Vane', title: 'Master Artisan', status: 'live', photo: 'avatar-julian.png' },
    { id: 'b-elena', name: 'Elena Rossi', title: 'Style Specialist', status: 'live', photo: 'avatar-elena.png' },
    { id: 'b-marcus', name: 'Marcus Thorne', title: 'Senior Barber', status: 'off', photo: 'avatar-marcus.png' },
    { id: 'b-soren', name: 'Soren K.', title: 'Artisan', status: 'live', photo: 'avatar-soren.png' },
  ];

  const CURRENCY = 'AED';

  // Each queue entry references a barberId, a list of serviceIds, status, and source.
  // status: 'in-progress' | 'waiting' | 'done' | 'no-show'
  // source: 'online' | 'walk-in'
  let queue = [
    { id: 1, barberId: 'b-julian', customerName: 'Marcus Sterling', serviceIds: ['svc-royal'], status: 'in-progress', source: 'online', startedAt: Date.now() - 28 * 60000 },
    { id: 2, barberId: 'b-julian', customerName: 'Liam Henderson', serviceIds: ['svc-cut'], status: 'waiting', source: 'online' },
    { id: 3, barberId: 'b-julian', customerName: 'David Chen', serviceIds: ['svc-cut', 'svc-beard'], status: 'waiting', source: 'walk-in' },
    { id: 4, barberId: 'b-julian', customerName: 'Sarah Miller', serviceIds: ['svc-royal'], status: 'waiting', source: 'online' },
    { id: 5, barberId: 'b-elena', customerName: 'Arthur Wright', serviceIds: ['svc-cut'], status: 'in-progress', source: 'walk-in', startedAt: Date.now() - 8 * 60000 },
    { id: 6, barberId: 'b-elena', customerName: 'Nathan Drake', serviceIds: ['svc-beard'], status: 'waiting', source: 'online' },
    { id: 7, barberId: 'b-soren', customerName: 'Garry Singh', serviceIds: ['svc-royal', 'svc-shave'], status: 'in-progress', source: 'online', startedAt: Date.now() - 15 * 60000 },
    { id: 8, barberId: 'b-soren', customerName: 'Liam Johnson', serviceIds: ['svc-cut'], status: 'waiting', source: 'walk-in' },
    { id: 9, barberId: 'b-soren', customerName: 'Robert Park', serviceIds: ['svc-cut', 'svc-beard'], status: 'waiting', source: 'online' },
  ];

  const CUSTOMER_AVATAR = 'avatar-customer.png';

  function getService(id) {
    return services.find(s => s.id === id);
  }

  function serviceDuration(serviceIds) {
    return serviceIds.reduce((sum, id) => sum + (getService(id)?.duration || 0), 0);
  }

  function servicePrice(serviceIds) {
    return serviceIds.reduce((sum, id) => sum + (getService(id)?.price || 0), 0);
  }

  function queueForBarber(barberId) {
    return queue
      .filter(q => q.barberId === barberId && (q.status === 'waiting' || q.status === 'in-progress'))
      .sort((a, b) => a.id - b.id);
  }

  // Estimated wait (minutes) before a NEW booking with given services would start
  function estimateWaitForNewBooking(barberId) {
    const active = queueForBarber(barberId);
    let total = 0;
    active.forEach(entry => {
      if (entry.status === 'in-progress') {
        const elapsedMin = (Date.now() - entry.startedAt) / 60000;
        const remaining = Math.max(serviceDuration(entry.serviceIds) - elapsedMin, 5);
        total += remaining;
      } else {
        total += serviceDuration(entry.serviceIds);
      }
    });
    return Math.round(total);
  }

  function positionForNewBooking(barberId) {
    return queueForBarber(barberId).length + 1;
  }

  function addBooking({ barberId, customerName, customerPhone, serviceIds, source }) {
    const entry = {
      id: nextQueueId++,
      barberId, customerName, customerPhone, serviceIds,
      status: 'waiting',
      source: source || 'online',
    };
    queue.push(entry);
    return entry;
  }

  function setStatus(entryId, status) {
    const entry = queue.find(q => q.id === entryId);
    if (!entry) return;
    entry.status = status;
    if (status === 'in-progress') entry.startedAt = Date.now();
  }

  function getEntry(entryId) {
    return queue.find(q => q.id === entryId);
  }

  function getBarber(barberId) {
    return barbers.find(b => b.id === barberId);
  }

  return {
    services, barbers, CUSTOMER_AVATAR, CURRENCY,
    getService, getBarber, getEntry,
    serviceDuration, servicePrice,
    queueForBarber, estimateWaitForNewBooking, positionForNewBooking,
    addBooking, setStatus,
  };
})();
