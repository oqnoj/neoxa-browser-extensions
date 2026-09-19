async function loadPrices() {
  const container = document.getElementById("prices-container");
  container.innerHTML = "Fetching...";

  try {
    let response = await fetch("https://neoxa.exchange/api/prices");
    let data = await response.json();
    let pricesMap = data.prices || {};

    chrome.storage.sync.get(["selectedTickers"], (settings) => {
      let selected = settings.selectedTickers || ["BTCB2", "NEOX", "RVN", "USDC"];
      
      if (selected.length === 0) {
        container.innerHTML = "<div style='text-align:center; color:#888; font-size:12px;'>No tickers selected.<br>Open Settings to add tokens.</div>";
        return;
      }

      container.innerHTML = "";
      selected.forEach(token => {
        let price = pricesMap[token];
        let formattedPrice = price !== undefined ? "$" + Number(price).toFixed(price < 1 ? 6 : 2) : "N/A";

        let row = document.createElement("div");
        row.className = "price-row";
        row.innerHTML = `<span class="token-name">${token}</span><span class="token-price">${formattedPrice}</span>`;
        container.appendChild(row);
      });
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<div style='color:#ff6b6b; text-align:center;'>Connection Error</div>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPrices();

  document.getElementById("refresh-btn").addEventListener("click", loadPrices);
  document.getElementById("settings-btn").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  });
});