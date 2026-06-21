// ============================================================
// AUREATE — Shop Display Controller
// Single passive screen, auto-refreshing. Meant for a TV/monitor.
// ============================================================

function render() {
  document.getElementById('app').innerHTML = renderShopDisplay();
}

// Auto-refresh every second so times/queues stay live
setInterval(render, 1000);

render();
