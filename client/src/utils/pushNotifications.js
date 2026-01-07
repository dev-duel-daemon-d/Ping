import api from '../services/api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  return null;
};

export const subscribeUserToPush = async () => {
  if (!VAPID_PUBLIC_KEY) {
    console.error('VAPID Public Key not found');
    alert('Push notification configuration missing (VAPID Key). Please restart the development server.');
    return;
  }

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission denied. Please enable them in your browser settings.');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      console.log('Push Subscription:', subscription);

      // Send subscription to server
      await api.post('/notifications/subscribe', subscription);
      alert('Notifications enabled successfully!');

    } catch (error) {
      console.error('Error subscribing to push:', error);
      alert('Failed to enable notifications. Check console for details.');
    }
  } else {
    alert('Push notifications are not supported in this browser.');
  }
};
