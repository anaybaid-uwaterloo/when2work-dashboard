document.getElementById('toggleBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        if (typeof window.toggleW2WDashboard === 'function') {
          window.toggleW2WDashboard();
        }
      }
    });
    window.close();
  });
});
