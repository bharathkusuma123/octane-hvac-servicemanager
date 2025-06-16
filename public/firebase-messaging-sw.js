importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
 apiKey: "AIzaSyDVp-QW_qn6chS_ymv0jZsY42nNVg3bOj8",
  authDomain: "hvac-d1f0f.firebaseapp.com",
  projectId: "hvac-d1f0f",
  storageBucket: "hvac-d1f0f.firebasestorage.app",
  messagingSenderId: "68719274682",
  appId: "1:68719274682:web:8faa0757d78eeaadc77083"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.image || '/logo192.png',
    data: {
      url: payload.data?.url || '/',
      notificationId: payload.data?.notificationId || 'default-id',
    },
    actions: JSON.parse(payload.data?.actions || '[]'), // Parse actions
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle button clicks
self.addEventListener('notificationclick', (event) => {
  if (event.action === 'accept') {
    console.log('User clicked Accept');
    // Send to backend (e.g., fetch('/handle-accept'))
  } else if (event.action === 'reject') {
    console.log('User clicked Reject');
    // Send to backend (e.g., fetch('/handle-reject'))
  } else {
    // Default click behavior (open URL)
    clients.openWindow(event.notification.data.url);
  }
  event.notification.close();
});

// Handle notification click (main action)
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const matchingClient = windowClients.find(client => client.url === urlToOpen);
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(urlToOpen);
    })
  );
});

// Handle notification action buttons (Accept/Reject)
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification);
});

self.addEventListener('notificationaction', (event) => {
  console.log('Notification action:', event.action);

  const notificationId = event.notification.data?.notificationId;
  const action = event.action;

  event.notification.close();

  // Send the action response to the server
  event.waitUntil(
    fetch('http://localhost:5000/handle-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId,
        action // 'accept' or 'reject'
      })
    })
    .then(response => response.json())
    .then(data => console.log('Action response:', data))
    .catch(err => console.error('Error sending action:', err))
  );

  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const urlToOpen = event.notification.data?.url || '/';
      const matchingClient = windowClients.find(client => client.url === urlToOpen);
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(urlToOpen);
    })
  );
});