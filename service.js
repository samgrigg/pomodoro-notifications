/**
 * =======================================
 * 
 * Public Key:
 * BIoUl2G-PbkvecRJaar5pDqO-prbySLN1iYrQ7M56PGXsKfObMt1YqYO-_dOSJ2xiM0nxbIV20R5udl6UwP-4AY
 * 
 * Private Key:
 * BHYCqr59feNZj-kFN-4vdUaf8T2UJic-QIpzAQ6HT_k
 * 
 * =======================================
 */

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
	const rawData = atob(base64)
	const outputArray = new Uint8Array(rawData.length)
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

const saveSubscription = async subscription => {
	const SERVER_URL = 'http://localhost:4000/save-subscription';
	const response = await fetch(SERVER_URL, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(subscription),
	});

	return response.json();
}

const showLocalNotification = (title, body, swRegistration) => {
	const options = {
		body,
	};
	swRegistration.showNotification(title, options);
}

self.addEventListener('activate', async () => {
	console.log('WORKER ACTIVATED');
	// This will be called only once when the service worker is activated.
	try {
		const applicationServerKey = urlB64ToUint8Array(
		  'BIoUl2G-PbkvecRJaar5pDqO-prbySLN1iYrQ7M56PGXsKfObMt1YqYO-_dOSJ2xiM0nxbIV20R5udl6UwP-4AY'
		)
		const options = { applicationServerKey, userVisibleOnly: true }
		const subscription = await self.registration.pushManager.subscribe(options)
		const response = await saveSubscription(subscription);

		console.log('SAVE SUBSCRIPTION RESPONSE', response);
	} catch (err) {
		console.log('Error', err)
	}
});

self.addEventListener('push', (event) => {
	if (event.data) {
		console.log('Push event!! ', event.data.text());
		showLocalNotification('Yooooo', event.data.text(), self.registration);
	} else {
		console.log('Push event but no data');
	}
});
