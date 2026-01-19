(function() {
  'use strict';

  // Extract data from When2Work page
  function extractData() {
    const data = {
      nextShift: null,
      newMessages: 0,
      trades: 0,
      shiftsPickedUp: 0,
      timeOffs: 0
    };

    // Find next shift info
    const nextShiftDiv = document.querySelector('.next-shift, .nextshift');
    if (nextShiftDiv) {
      const text = nextShiftDiv.textContent;
      data.nextShift = text.trim();
    } else {
      // Try to find it in the text content
      const bodyText = document.body.textContent;
      const shiftMatch = bodyText.match(/Next Shift[\s\S]*?([A-Z][a-z]{2}\s+[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})[\s\S]*?(\d{1,2}[ap]m-\d{1,2}[ap]m)/i);
      if (shiftMatch) {
        data.nextShift = {
          date: shiftMatch[1],
          time: shiftMatch[2],
          location: 'Check schedule for details'
        };
      }
    }

    // Extract notifications from "What's New" section
    const whatsNew = document.querySelector('.whatsnew, #whatsnew');
    if (whatsNew) {
      const text = whatsNew.textContent;
      
      const msgMatch = text.match(/(\d+)\s+new messages?/i);
      if (msgMatch) data.newMessages = parseInt(msgMatch[1]);
      
      const tradeMatch = text.match(/(\d+)\s+trades? completed/i);
      if (tradeMatch) data.trades = parseInt(tradeMatch[1]);
      
      const pickupMatch = text.match(/(\d+)\s+shifts? picked up/i);
      if (pickupMatch) data.shiftsPickedUp = parseInt(pickupMatch[1]);
      
      const timeoffMatch = text.match(/(\d+)\s+time offs? approved/i);
      if (timeoffMatch) data.timeOffs = parseInt(timeoffMatch[1]);
    }

    return data;
  }

  // Create dashboard overlay
  function createDashboard() {
    const data = extractData();
    
    const dashboard = document.createElement('div');
    dashboard.id = 'w2w-dashboard-overlay';
    dashboard.innerHTML = `
      <div class="w2w-dashboard-container">
        <div class="w2w-dashboard-header">
          <h2>📋 Your Dashboard</h2>
          <button id="w2w-close-btn" class="w2w-close-btn">×</button>
        </div>

        <div class="w2w-next-shift">
          <div class="w2w-shift-icon">📅</div>
          <div class="w2w-shift-details">
            <div class="w2w-shift-label">Next Shift</div>
            ${data.nextShift ? `
              <div class="w2w-shift-date">${typeof data.nextShift === 'string' ? data.nextShift : data.nextShift.date}</div>
              <div class="w2w-shift-time">${typeof data.nextShift === 'object' ? data.nextShift.time : ''}</div>
              <div class="w2w-shift-location">${typeof data.nextShift === 'object' ? data.nextShift.location : ''}</div>
            ` : `
              <div class="w2w-shift-date">No upcoming shifts</div>
            `}
          </div>
        </div>

        <div class="w2w-stats-grid">
          <div class="w2w-stat-card">
            <div class="w2w-stat-icon">💬</div>
            <div class="w2w-stat-number">${data.newMessages}</div>
            <div class="w2w-stat-label">New Messages</div>
          </div>
          <div class="w2w-stat-card">
            <div class="w2w-stat-icon">🔄</div>
            <div class="w2w-stat-number">${data.trades}</div>
            <div class="w2w-stat-label">Trades Done</div>
          </div>
          <div class="w2w-stat-card">
            <div class="w2w-stat-icon">✅</div>
            <div class="w2w-stat-number">${data.shiftsPickedUp}</div>
            <div class="w2w-stat-label">Shifts Picked Up</div>
          </div>
          <div class="w2w-stat-card">
            <div class="w2w-stat-icon">🏖️</div>
            <div class="w2w-stat-number">${data.timeOffs}</div>
            <div class="w2w-stat-label">Time Off Approved</div>
          </div>
        </div>

        <div class="w2w-quick-actions">
          <h3>Quick Actions</h3>
          <div class="w2w-action-grid">
            <button class="w2w-action-btn" data-link="/empschedule.htm">
              📅 My Schedule
            </button>
            <button class="w2w-action-btn" data-link="/emptime.htm">
              ⏰ Request Time Off
            </button>
            <button class="w2w-action-btn" data-link="/empshift.htm">
              🔄 Pick Up Shifts
            </button>
            <button class="w2w-action-btn" data-link="/empmessage.htm">
              ✉️ Message Manager
            </button>
            <button class="w2w-action-btn" data-link="/emptrade.htm">
              🤝 Trade Board
            </button>
            <button class="w2w-action-btn" data-link="/emppref.htm">
              ⚙️ My Preferences
            </button>
          </div>
        </div>

        <div class="w2w-keyboard-hints">
          <div class="w2w-hint">Press <kbd>Esc</kbd> to close</div>
          <div class="w2w-hint">Press <kbd>Alt+D</kbd> to toggle dashboard</div>
        </div>
      </div>
    `;

    document.body.appendChild(dashboard);

    // Add event listeners
    document.getElementById('w2w-close-btn').addEventListener('click', closeDashboard);
    
    // Quick action buttons
    document.querySelectorAll('.w2w-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const link = btn.getAttribute('data-link');
        if (link) {
          window.location.href = link;
        }
      });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('w2w-dashboard-overlay')) {
        closeDashboard();
      }
    });
  }

  function closeDashboard() {
    const dashboard = document.getElementById('w2w-dashboard-overlay');
    if (dashboard) {
      dashboard.remove();
    }
  }

  function toggleDashboard() {
    const existing = document.getElementById('w2w-dashboard-overlay');
    if (existing) {
      closeDashboard();
    } else {
      createDashboard();
    }
  }

  // Auto-show dashboard on page load
  if (window.location.pathname === '/' || window.location.pathname.includes('empindex')) {
    setTimeout(createDashboard, 500);
  }

  // Keyboard shortcut: Alt+D
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'd') {
      e.preventDefault();
      toggleDashboard();
    }
  });

  // Make toggle function globally accessible
  window.toggleW2WDashboard = toggleDashboard;
})();
