// Helper function to format large numbers for tiny badges (e.g., 81385 -> 81.3K, 1500000 -> 1.5M)
function formatBadgeNumber(num) {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return Math.round(num).toString();
}

async function updateBadge() {
  try {
    chrome.storage.sync.get(["badgeEnabled", "badgeTicker"], async (settings) => {
      if (!settings.badgeEnabled || !settings.badgeTicker) {
        chrome.action.setBadgeText({ text: "" });
        return;
      }

      let response = await fetch("https://neoxa.exchange/api/prices");
      if (!response.ok) return;
      
      let data = await response.json();
      let pricesMap = data.prices || {};
      let price = pricesMap[settings.badgeTicker];

      if (price !== undefined) {
        let badgeText = formatBadgeNumber(Number(price));
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: "#202225" });
      } else {
        chrome.action.setBadgeText({ text: "?" });
      }
    });
  } catch (error) {
    console.error("Background badge error:", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
  chrome.alarms.create("multiBadgeAlarm", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "multiBadgeAlarm") {
    updateBadge();
  }
});

updateBadge();