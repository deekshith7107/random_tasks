const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project.firebaseio.com',
});

const database = admin.database();
const deviceTokensRef = database.ref('deviceTokens');

// Function to store a device token
const storeDeviceToken = (deviceToken) => {
  return deviceTokensRef.child(deviceToken).set(true);
};

// Function to remove a device token
const removeDeviceToken = (deviceToken) => {
  return deviceTokensRef.child(deviceToken).remove();
};

// Function to send push notification to all device tokens
const sendPushNotification = (notification) => {
  return deviceTokensRef.once('value')
    .then((snapshot) => {
      const deviceTokens = Object.keys(snapshot.val() || {});
      const messages = deviceTokens.map((token) => ({
        notification: {
          title: notification.title,
          body: notification.body,
        },
        token,
      }));

      return Promise.all(messages.map((message) => admin.messaging().send(message)));
    })
    .catch((error) => {
      console.error('Error sending push notifications:', error);
    });
};