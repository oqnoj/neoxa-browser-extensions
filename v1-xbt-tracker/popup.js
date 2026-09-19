async function fetchPriceDirectly() {
  const display = document.getElementById("price-display");
  display.innerText = "Fetching...";
  
  try {
    let response = await fetch("https://neoxa.exchange/api/prices");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    let data = await response.json();
    let pricesMap = data.prices || {};
    let btcB2Price = pricesMap["BTCB2"] || pricesMap["btcb2"];

    if (btcB2Price) {
      // Changed to .toFixed(2) for a clean two-decimal price format
      display.innerText = "$" + Number(btcB2Price).toFixed(2);
    } else {
      display.innerText = "Price not found";
    }
  } catch (err) {
    console.error("Popup fetch error:", err);
    display.innerText = "Connection Error";
  }
}

// Run when popup DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchPriceDirectly();
  
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", fetchPriceDirectly);
  }
});