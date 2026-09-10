(function () {
  const games = window.GAME_GALLERY_DATA || [];
  document.querySelector('#games-played').textContent = games.length;
  const gallery = document.querySelector('#gallery');
  const allGallery = document.querySelector('#all-gallery');
  const search = document.querySelector('#search');
  const count = document.querySelector('#gallery-count');
  const lightbox = document.querySelector('#lightbox');
  const image = document.querySelector('#lightbox-image');
  const backdrop = document.querySelector('#lightbox-backdrop');
  const stage = document.querySelector('.image-stage');
  const close = document.querySelector('[data-close]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  let activeGame = null;
  let activeIndex = 0;
  let albumTrigger = null;
  let savedScroll = 0;
  let viewerPhotos = null;
  const photoSrc = (path) => `Games/${path.split('/').map(encodeURIComponent).join('/')}`;

  function render() {
    gallery.replaceChildren();
    const entries = activeGame ? activeGame.images : games.filter(game => game.title.toLowerCase().includes(search.value.trim().toLowerCase()));
    entries.forEach((entry, index) => {
      const game = activeGame || entry;
      const card = document.createElement('article');
      card.className = 'game-card';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cover-button';
      button.setAttribute('aria-label', activeGame ? `Open ${game.title} photo ${index + 1}` : `Open ${game.title} album`);
      const wrap = document.createElement('span');
      wrap.className = 'poster-wrap';
      const img = document.createElement('img');
      img.src = photoSrc(activeGame ? entry : game.images[0]);
      img.alt = `${game.title} screenshot${activeGame ? ` ${index + 1}` : ''}`;
      img.loading = index < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      const arrow = document.createElement('span');
      arrow.className = 'open-indicator';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      wrap.append(img, arrow);
      const meta = document.createElement('span');
      meta.className = 'game-meta';
      const title = document.createElement('span');
      title.className = 'game-title';
      title.textContent = activeGame ? `Photo ${String(index + 1).padStart(2, '0')}` : game.title;
      const photos = document.createElement('span');
      photos.className = 'photo-count';
      photos.textContent = activeGame ? 'View photo' : `${game.images.length} ${game.images.length === 1 ? 'photo' : 'photos'}`;
      meta.append(title, photos);
      button.append(wrap, meta);
      button.addEventListener('click', () => activeGame ? openLightbox(index) : openAlbum(game));
      card.append(button);
      gallery.append(card);
    });
    const photoCount = activeGame ? entries.length : entries.reduce((total, game) => total + game.images.length, 0);
    count.textContent = activeGame ? `${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}` : `${entries.length} ${entries.length === 1 ? 'album' : 'albums'} · ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`;
    document.querySelector('#empty-state').hidden = entries.length > 0;
  }

  function renderAllPhotos() {
    const photos = games.flatMap(game => game.images.map((image, imageIndex) => ({ game, image, imageIndex })));
    allGallery.replaceChildren();
    photos.forEach((photo, index) => {
      const card = document.createElement('article');
      card.className = 'game-card all-photo-card';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cover-button';
      button.setAttribute('aria-label', `Open ${photo.game.title} photo ${photo.imageIndex + 1}`);
      const wrap = document.createElement('span');
      wrap.className = 'poster-wrap';
      const img = document.createElement('img');
      img.src = photoSrc(photo.image);
      img.alt = `${photo.game.title} screenshot ${photo.imageIndex + 1}`;
      img.loading = index < 4 ? 'eager' : 'lazy';
      const arrow = document.createElement('span');
      arrow.className = 'open-indicator';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      wrap.append(img, arrow);
      const meta = document.createElement('span');
      meta.className = 'game-meta';
      const title = document.createElement('span');
      title.className = 'game-title';
      title.textContent = photo.game.title;
      meta.append(title);
      button.append(wrap, meta);
      button.addEventListener('click', () => { viewerPhotos = photos; activeGame = photo.game; openLightbox(index); });
      card.append(button);
      allGallery.append(card);
    });
    document.querySelector('#all-photos-count').textContent = `${photos.length} photos · ${games.length} games`;
  }

  function openAlbum(game) {
    viewerPhotos = null;
    albumTrigger = document.activeElement.id === 'featured-album' ? -1 : games.indexOf(game);
    savedScroll = window.scrollY;
    activeGame = game;
    document.querySelector('#home-intro').hidden = true;
    document.querySelector('#album-intro').hidden = false;
    document.querySelector('#search-box').hidden = true;
    document.querySelector('#album-title').textContent = game.title;
    gallery.classList.add('is-album');
    render();
    window.scrollTo(0, 0);
    document.querySelector('#back-button').focus({ preventScroll: true });
  }

  function openLightbox(index, direction = 0) {
    const photos = viewerPhotos || activeGame?.images.map((image, imageIndex) => ({ image, imageIndex, game: activeGame }));
    if (!photos?.[index]) return;
    activeIndex = index;
    const photo = photos[index];
    const src = photoSrc(photo.image);
    stage.classList.remove('is-next', 'is-prev', 'is-changing');
    if (direction) {
      stage.classList.add(direction > 0 ? 'is-next' : 'is-prev', 'is-changing');
      window.setTimeout(() => stage.classList.remove('is-changing'), 420);
    }
    image.src = src;
    backdrop.src = src;
    image.alt = `${photo.game.title} screenshot ${photo.imageIndex + 1}`;
    document.querySelector('#lightbox-title').textContent = photo.game.title;
    document.querySelector('#lightbox-position').textContent = `Photo ${index + 1} of ${photos.length}`;
    prev.hidden = next.hidden = photos.length < 2;
    if (!lightbox.open) { lightbox.showModal(); close.focus(); }
  }

  function showRelative(offset) {
    const photos = viewerPhotos || activeGame?.images;
    if (photos?.length) openLightbox((activeIndex + offset + photos.length) % photos.length, offset);
  }
  document.querySelector('#back-button').addEventListener('click', () => {
    activeGame = null;
    document.querySelector('#home-intro').hidden = false;
    document.querySelector('#album-intro').hidden = true;
    document.querySelector('#search-box').hidden = false;
    gallery.classList.remove('is-album');
    render();
    const filtered = games.filter(game => game.title.toLowerCase().includes(search.value.trim().toLowerCase()));
    (gallery.querySelectorAll('button')[filtered.indexOf(games[albumTrigger])] || document.querySelector('#featured-album')).focus({ preventScroll: true });
    window.scrollTo(0, savedScroll);
  });
  search.addEventListener('input', render);
  document.querySelector('#all-photos-link').addEventListener('click', () => {
    activeGame = null;
    document.querySelector('#home-intro').hidden = true;
    document.querySelector('#album-intro').hidden = true;
    document.querySelector('#albums').hidden = true;
    document.querySelector('#all-photos').hidden = false;
    renderAllPhotos();
    window.scrollTo(0, 0);
  });
  document.querySelector('#back-to-albums').addEventListener('click', () => {
    document.querySelector('#all-photos').hidden = true;
    document.querySelector('#albums').hidden = false;
    document.querySelector('#home-intro').hidden = false;
    render();
  });
  document.querySelector('#featured-album').addEventListener('click', () => {
    const featured = games.find(game => game.title === 'Dragonwilds');
    if (featured) openAlbum(featured);
  });
  document.querySelector('#clear-search').addEventListener('click', () => { search.value = ''; render(); search.focus(); });
  close.addEventListener('click', () => lightbox.close());
  prev.addEventListener('click', () => showRelative(-1));
  next.addEventListener('click', () => showRelative(1));
  document.addEventListener('keydown', event => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showRelative(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  render();
})();
