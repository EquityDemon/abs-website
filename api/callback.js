// GitHub OAuth — step 2: exchange the code for a token and hand it back to Decap CMS.
module.exports = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.statusCode = 500;
      res.end("Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET env vars");
      return;
    }

    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url, `https://${host}`);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookies = Object.fromEntries(
      (req.headers.cookie || "")
        .split(";")
        .map((c) => c.trim().split("="))
        .filter((p) => p[0])
        .map((p) => [p[0], decodeURIComponent(p.slice(1).join("="))])
    );

    if (!code || !state || state !== cookies.oauth_state) {
      res.statusCode = 400;
      res.end("Invalid OAuth state. Please try logging in again.");
      return;
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });
    const data = await tokenRes.json();
    const token = data.access_token;

    const payload = token
      ? "authorization:github:success:" + JSON.stringify({ token: token, provider: "github" })
      : "authorization:github:error:" + JSON.stringify({ error: data.error || "no_token" });

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(
      `<!doctype html><html><body><script>
  (function () {
    function receive(e) {
      window.opener && window.opener.postMessage(${JSON.stringify(payload)}, e.origin);
      window.removeEventListener("message", receive);
      setTimeout(function () { window.close(); }, 300);
    }
    window.addEventListener("message", receive, false);
    window.opener && window.opener.postMessage("authorizing:github", "*");
  })();
</script>Completing sign-in…</body></html>`
    );
  } catch (err) {
    res.statusCode = 500;
    res.end("OAuth error: " + err.message);
  }
};
