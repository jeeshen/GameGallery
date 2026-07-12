# Game Gallery

A static HTML, CSS, and JavaScript gallery for displaying game photos you have played, with grouped screenshots, star ratings, and comments stored in an editable data file.

## Features
- Responsive game gallery for desktop and mobile
- One cover image shown per game on the main gallery
- Clickable lightbox with left and right navigation for each game's photos
- Star ratings displayed under each game
- Comments or notes shown inside the lightbox after clicking a game
- Search by game title
- Keyboard-friendly controls for opening, closing, and navigating photos
- No framework, backend, database, or build step required

## Installation
```bash
# clone the repo
git clone https://github.com/jeeshen/GameGallery.git

# navigate to project directory
cd GameGallery

# open the gallery
start index.html
```

## Editing Ratings And Comments
Update `game-data.js` to change a game's rating or comment.

```js
{
  title: "Raft",
  rating: 5,
  comment: "Great co-op survival game.",
  images: ["Raft.png"]
}
```
