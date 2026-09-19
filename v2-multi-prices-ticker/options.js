async function initOptions() {
  const container = document.getElementById("tickers-container");
  const badgeSelect = document.getElementById("badge-select");
  const badgeToggle = document.getElementById("badge-toggle");
  
  try {
    let response = await fetch("https://neoxa.exchange/api/prices");
    let data = await response.json();
    let pricesMap = data.prices || {};
    let allTokens = Object.keys(pricesMap).sort();

    // Load saved settings
    chrome.storage.sync.get(["selectedTickers", "badgeEnabled", "badgeTicker"], (settings) => {
      let selected = settings.selectedTickers || ["BTCB2", "NEOX", "RVN", "USDC"];
      badgeToggle.checked = settings.badgeEnabled !== false;

      // Populate checkboxes
      container.innerHTML = "";
      badgeSelect.innerHTML = '<option value="">-- Choose Token --</option>';

      allTokens.forEach(token => {
        // Add to checklist
        let lbl = document.createElement("label");
        let chk = document.createElement("input");
        chk.type = "checkbox";
        chk.name = "ticker";
        chk.value = token;
        chk.checked = selected.includes(token);
        
        lbl.appendChild(chk);
        lbl.appendChild(document.createTextNode(token));
        container.appendChild(lbl);

        // Add to badge dropdown
        let opt = document.createElement("option");
        opt.value = token;
        opt.innerText = token;
        if (settings.badgeTicker === token) opt.selected = true;
        badgeSelect.appendChild(opt);
      });
    });
  } catch (err) {
    container.innerText = "Failed to load tokens from API.";
    console.error(err);
  }
}

document.getElementById("save-btn").addEventListener("click", () => {
  const chks = document.querySelectorAll("input[name='ticker']:checked");
  const selectedTickers = Array.from(chks).map(c => c.value);
  const badgeEnabled = document.getElementById("badge-toggle").checked;
  const badgeTicker = document.getElementById("badge-select").value;
  const status = document.getElementById("status");

  chrome.storage.sync.set({ selectedTickers, badgeEnabled, badgeTicker }, () => {
    status.innerText = "Settings saved successfully!";
    setTimeout(() => { status.innerText = ""; }, 2500);
    
    // Notify background worker to refresh badge
    chrome.runtime.reload();
  });
});

document.addEventListener("DOMContentLoaded", initOptions);