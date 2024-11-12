let videosVistos = [];

// Función para buscar videos
function searchVideos() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const suggestedVideos = document.querySelectorAll('.suggested-video');
  let resultsFound = false;

  suggestedVideos.forEach(video => {
    const title = video.querySelector('p').textContent.toLowerCase();
    if (title.includes(searchInput)) {
      video.style.display = 'block';
      resultsFound = true;
    } else {
      video.style.display = 'none';
    }
  });

  const noResults = document.getElementById('noResults');
  if (!resultsFound) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }
}

// Función para mostrar/ocultar videos vistos recientemente
function toggleRecentVideos() {
  const recentVideos = document.getElementById('recentVideos');
  const isVisible = recentVideos.style.display === 'block';
  recentVideos.style.display = isVisible ? 'none' : 'block';

  // Actualizar la lista de videos vistos
  const recentVideosList = document.getElementById('recentVideosList');
  recentVideosList.innerHTML = '';  // Limpiar lista antes de agregar

  // Mostrar los videos vistos con sus miniaturas
  videosVistos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-item';
    videoElement.innerHTML = `<img src="${video.thumbnail}" alt="Miniatura" class="thumbnail">
                              <p>${video.title}</p>`;
    videoElement.onclick = function() {
      // Reproducir el video visto al hacer clic
      playVideo(video);
    };
    recentVideosList.appendChild(videoElement);
  });
}

// Función para mostrar videos sugeridos
function showSuggestedVideos() {
  const suggestedVideos = document.getElementById('suggestedVideos');
  const isVisible = suggestedVideos.style.display === 'block';
  suggestedVideos.style.display = isVisible ? 'none' : 'block';
}

// Función para solicitar la clave
function requestAccess(videoUrl, title, correctKey, thumbnailUrl) {
  document.getElementById('popup').style.display = 'flex';
  window.currentVideo = { videoUrl, title, correctKey, thumbnailUrl };
}

// Función para verificar la clave ingresada
function checkKey() {
  const userKey = document.getElementById('userKey').value;
  const { correctKey, videoUrl, title, thumbnailUrl } = window.currentVideo;

  if (userKey === correctKey) {
    document.getElementById('mainVideo').src = videoUrl;
    document.getElementById('videoTitle').textContent = title;
    document.getElementById('popup').style.display = 'none';

    // Evitar duplicados, solo agregamos si no está ya en la lista
    if (!videosVistos.some(video => video.videoUrl === videoUrl)) {
      // Agregar el video a la lista de videos vistos con la miniatura
      videosVistos.unshift({ videoUrl, title, thumbnail: thumbnailUrl }); // Usamos unshift para agregar al inicio

      // Limitar la cantidad de videos vistos a un número máximo, por ejemplo, 5
      if (videosVistos.length > 5) {
        videosVistos.pop(); // Eliminar el video más antiguo
      }

      showNotification('Acceso Concedido A la Clase: ' + title, 'access-granted');
    } else {
      showNotification('Este video ya fue visto', 'duplicate');
    }
  } else {
    showNotification('Clave Incorrecta', 'key-incorrect');
  }
}

// Función para mostrar notificaciones
function showNotification(message, type = '') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';

  // Ocultar la notificación después de 3 segundos
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Función para reproducir el video cuando se haga clic en la lista de videos vistos
function playVideo(video) {
  document.getElementById('mainVideo').src = video.videoUrl;
  document.getElementById('videoTitle').textContent = video.title;
}
