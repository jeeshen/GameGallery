(function () {
  const games = window.GAME_GALLERY_DATA || [];
  const gallery = document.querySelector("#gallery");
  const search = document.querySelector("#search");
  const count = document.querySelector("#gallery-count");
  const emptyState = document.querySelector("#empty-state");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxRating = document.querySelector("#lightbox-rating");
  const lightboxComment = document.querySelector("#lightbox-comment");
  const closeButton = document.querySelector("[data-close]");
  const prevButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");
  let activePhotos = [];
  let activeIndex = 0;

  function normalizeRating(rating) {
    return Math.max(0, Math.min(5, Number(rating) || 0));
  }

  function getGamePhotos(game) {
    const rating = normalizeRating(game.rating);
    return game.images.map((image, imageIndex) => ({
      title: game.title,
      rating,
      comment: game.comment || "",
      src: `Games/${encodeURIComponent(image).replace(/%2F/g, "/")}`,
      imageIndex,
      totalImages: game.images.length
    }));
  }

  function stars(rating) {
    const safeRating = normalizeRating(rating);
    const label = safeRating ? `${safeRating} out of 5 stars` : "Not rated";
    const symbols = Array.from({ length: 5 }, (_, index) =>
      `<span class="${index < safeRating ? "star is-filled" : "star"}" aria-hidden="true">&#9733;</span>`
    ).join("");
    return `<span class="stars" aria-label="${label}">${symbols}<span class="rating-label">${label}</span></span>`;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const filteredGames = games.filter((game) => game.title.toLowerCase().includes(query));
    gallery.innerHTML = filteredGames.map((game) => {
      const gameIndex = games.indexOf(game);
      const rating = normalizeRating(game.rating);
      const cover = getGamePhotos(game)[0];
      const suffix = game.images.length > 1 ? `<span class="photo-count">${game.images.length} photos</span>` : "";
      return `
        <article class="game-card">
          <button class="cover-button" type="button" data-game-index="${gameIndex}" aria-label="Open ${game.title} gallery">
            <span class="poster-wrap">
              <img src="${cover.src}" alt="${game.title} game screenshot" loading="lazy">
              ${suffix}
            </span>
          </button>
          <div class="game-meta">
            <h2 class="game-title">${game.title}</h2>
            ${stars(rating)}
          </div>
        </article>
      `;
    }).join("");
    const photoCount = filteredGames.reduce((total, game) => total + game.images.length, 0);
    count.textContent = `${filteredGames.length} games, ${photoCount} photos`;
    emptyState.hidden = filteredGames.length > 0;
  }

  function openGame(gameIndex) {
    const game = games[gameIndex];
    if (!game) return;
    activePhotos = getGamePhotos(game);
    openLightbox(0);
  }

  function openLightbox(index) {
    if (!activePhotos[index]) return;
    activeIndex = index;
    const photo = activePhotos[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = `${photo.title} game screenshot`;
    lightboxTitle.textContent = photo.totalImages > 1
      ? `${photo.title} ${photo.imageIndex + 1}/${photo.totalImages}`
      : photo.title;
    lightboxRating.innerHTML = stars(photo.rating);
    lightboxComment.textContent = photo.comment;
    lightboxComment.hidden = !photo.comment;
    prevButton.hidden = activePhotos.length < 2;
    nextButton.hidden = activePhotos.length < 2;
    if (!lightbox.open) {
      lightbox.showModal();
      closeButton.focus();
    }
  }

  function showRelative(offset) {
    if (!activePhotos.length) return;
    activeIndex = (activeIndex + offset + activePhotos.length) % activePhotos.length;
    openLightbox(activeIndex);
  }

  gallery.addEventListener("click", (event) => {
    const button = event.target.closest(".cover-button");
    if (!button) return;
    openGame(Number(button.dataset.gameIndex));
  });

  search.addEventListener("input", render);
  closeButton.addEventListener("click", () => lightbox.close());
  prevButton.addEventListener("click", () => showRelative(-1));
  nextButton.addEventListener("click", () => showRelative(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") showRelative(-1);
    if (event.key === "ArrowRight") showRelative(1);
  });

  render();
})();
