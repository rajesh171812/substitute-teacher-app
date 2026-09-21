Put static files here. They are served from the site root.

Welcome screen photo or video:
  1. Add the file here, for example  welcome.jpg  (or welcome.mp4 plus welcome-poster.jpg).
  2. Open src/components/subtrack/SubTrack.jsx and set the paths near the top, for example:
       const WELCOME_MEDIA = { image: "/welcome.jpg", video: "", poster: "" };
Use media you own or have a licence for.
