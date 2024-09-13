self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png', // path to your notification icon
      badge: '/badge.png' // path to your notification badge
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  