// Asignar nombre y version de la caché //
const CACHE_NAME = 'v1_cache_inventario_servicio_pwa';

// Fichero de caché en la app //
var urlsacache = [
	'./',
	'./CSS/styles.css',
	'./imagenes/siys2.png',
	'./imagenes/añadir.png',
	'./imagenes/buscar.png',
	'./imagenes/sacar.png',
	'./imagenes/siys 1024.png',
	'./imagenes/siys 128.png',
	'./imagenes/siys 192.png',
	'./imagenes/siys 256.png',
	'./imagenes/siys 32.png',
	'./imagenes/siys 384.png',
	'./imagenes/siys 512.png',
	'./imagenes/siys 64.png',
	'./imagenes/siys 96.png',
];

// Evento install -> Para instalar la app, almacena en caché los datos estáticos //
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				return cache.addAll(urlsacache)
							.then(() => {
								self.skipWaiting(); // Espera a que se guarden todos los archivos en la caché //
							});
			})
			.catch(error => console.log('No se ha registrado el caché', err))
	);
});

// Evento activate -> Activa la app para que funcione sin internet //
self.addEventListener('activate', e => {
	const cacheWhitelist = [CACHE_NAME];
	
	e.waitUntil( // Espera a que se realice el evento // 
		caches.keys() // Recoge los elementos de la cache que hay ahora //
			.then(cacheNames => { // Recoge resultados //
				return Promise.all(
					cacheNames.map(cacheName => { // Recorremos en la caché para buscar en el array // 
						
						if(cacheWhitelist.indexOf(cacheName) === -1){
							return caches.delete(cacheName); // Borrar elementos que no se necesitan //
						}
					})
				);
			})
			.then(() => {
				self.clients.claim(); // Activa cache //
			})
	);
});

// Evento fetch -> consigue la info desde el servidor para actualizar la app //
self.addEventListener('fetch', e => { // self se refiere a la pag/app // 
	e.respondWith(
		caches.match(e.request)
			.then(res => {
				if(res){
					return res; // Devuelve los datos desde cache // 
				}
				return fetch(e.request);
			})
	);
});