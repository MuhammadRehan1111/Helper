// ─── Notification Utilities ──────────────────────────────────────────────────

export const requestPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    console.error('Notification permission error:', e);
    return false;
  }
};

export const showLocalNotification = (title: string, body: string, _url?: string) => {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Try service worker notification first
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
          vibrate: [200, 100, 200],
        } as any);
      }).catch(() => {
        // Fallback to basic notification
        new Notification(title, { body, icon: '/icons/icon-192.png' });
      });
    } else {
      // Fallback to basic notification
      new Notification(title, { body, icon: '/icons/icon-192.png' });
    }
  } catch (e) {
    console.error('showLocalNotification error:', e);
  }
};

export const sendBookingConfirmation = (booking: {
  id: string;
  workerName: string;
  date: string;
  time: string;
  workerId: string;
}) => {
  showLocalNotification(
    '✅ Booking Confirmed!',
    `Booking ID: ${booking.id} - Helper aa raha hai!`,
    '/jobs'
  );
};

export const scheduleReminder = (booking: {
  date: string;
  time: string;
  workerName: string;
  workerId: string;
}) => {
  try {
    const appointmentTime = new Date(`${booking.date}T${booking.time}`);
    const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        showLocalNotification(
          '⏰ Helper Coming Soon!',
          `${booking.workerName} 1 ghante mein aa raha hai!`,
          '/tracking/' + booking.workerId
        );
      }, delay);
    }
  } catch (e) {
    console.error('Reminder schedule failed:', e);
  }
};

export const sendStatusUpdate = (message: string) => {
  showLocalNotification('📍 Status Update', message, '/jobs');
};

export const sendCompletionNotification = (_bookingId: string) => {
  showLocalNotification(
    '⭐ Service Complete!',
    'Apna experience rate karein!',
    '/jobs'
  );
};
