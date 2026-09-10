# Game Gallery

A static photo archive of games played with friends. The design is inspired by the user-selected Orkan reference: cinematic gameplay imagery, bold type, and orange album layouts.

- One album per game, with a separate photo grid
- All Photos page for browsing every screenshot in one cinematic reel
- Fullscreen photo viewer with arrow keys and Escape to close
- Search by game title, with search preserved when returning from an album
- Responsive layout and reduced-motion support
- No dependencies or build step

Open `index.html` directly, or run `python -m http.server 8080 --bind 127.0.0.1` and visit http://127.0.0.1:8080.

## Add memories

Place screenshots in `Games/` and update `game-data.js`. Each game has a title and an `images` list; the first image is its album cover. Review fields are retained in the data file for compatibility but are not shown in the gallery.

## Check the gallery

With the local server running, open http://127.0.0.1:8080/checks.html. It exercises the actual gallery in an iframe and reports PASS or FAIL for album navigation, search, viewer controls, and empty states.
