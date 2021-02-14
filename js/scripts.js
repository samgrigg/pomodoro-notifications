
const main = async () => {
	console.log('ENTER MAIN');
	check();
	const permission = await requestNotificationPermission();
	const swRegistration = await registerServiceWorker();
	console.log('EXIT MAIN');
}

const check = () => {
	if (!('serviceWorker' in navigator)) {
		throw new Error('No Service Worker support');
	}
	if (!'PushManager' in window) {
		throw new Error('No Push API Support');
	}
}

const registerServiceWorker = async() => {
	console.log('REGISTERING SERVICE WORKER');
	const swRegistration = await navigator.serviceWorker.register('service.js');
	console.log('SERVICE WOKER REGISTERED');
	return swRegistration;
}

const requestNotificationPermission = async() => {
	console.log('REQUEST PERMISSION');
	//                       granted, default, denied
	const permission = await window.Notification.requestPermission();
	if (permission !== 'granted') {
		throw new Error('Permission not granted for notification');
	} else {
		console.log('Permission Granted :)');
	}

	return permission;
}
