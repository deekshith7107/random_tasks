import React, { useState, useEffect } from 'react';
import { messaging, database } from './firebase';

const PushNotifications = () => {
  const [permission, setPermission] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Request permission to use push notifications
    Notification.requestPermission()
      .then((permission) => {
        setPermission(permission);
        if (permission === 'granted') {
          // Subscribe the user to push notifications
          messaging.getToken()
            .then((token) => {
              setSubscription(token);
              console.log('Device token:', token);
              // Store the device token in the database
              storeDeviceToken(token);
            })
            .catch((error) => {
              console.error('Error getting device token:', error);
            });

          // Listen for incoming push notifications
          messaging.onMessage((payload) => {
            console.log('Received push notification:', payload);
            // Display the notification to the user
            new Notification(payload.notification.title, {
              body: payload.notification.body,
            });
          });

          // Clean up the device token when the component unmounts
          return () => {
            removeDeviceToken(subscription);
          };
        }
      })
      .catch((error) => {
        console.error('Error requesting permission:', error);
      });
  }, []);

  const storeDeviceToken = (deviceToken) => {
    database.ref(deviceTokens/${deviceToken}).set(true);
  };

  const removeDeviceToken = (deviceToken) => {
    database.ref(deviceTokens/${deviceToken}).remove();
  };

  return (
    <div>
      {permission === 'granted' ? (
        <p>Listening for push notifications...</p>
      ) : (
        <p>Requesting permission to send push notifications...</p>
      )}
    </div>
  );
};

export default PushNotifications;