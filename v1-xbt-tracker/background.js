async function updateBadge() {
  try {
    let response = await fetch("https://neoxa.exchange/api/prices");
    if (!response.ok) return;
    
    let data = await response.json();
    let pricesMap = data.prices || {};
    let btcB2Price = pricesMap["BTCB2"] || pricesMap["btcb2"];

    if (btcB2Price) {
      let badgeText = Math.round(Number(btcB2Price)).toString();
      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: "#202225" });
    }
  } catch (error) {
    console.error("Background badge error:", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
  chrome.alarms.create("badgeAlarm", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "badgeAlarm") {
    updateBadge();
  }
});

updateBadge();