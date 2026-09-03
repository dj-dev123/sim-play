<?php

// This backend is API-only now (see routes/api.php); the React SPA in
// frontend/ is served separately. Nothing needs a `web` route beyond the
// health check Laravel registers on its own via bootstrap/app.php's
// `health: '/up'` option.
