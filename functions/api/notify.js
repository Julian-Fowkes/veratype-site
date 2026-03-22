export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://veratype.ai',
  };

  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400, headers
      });
    }

    // Cloudflare KV — bind a namespace called WAITLIST in Pages settings
    if (!env.WAITLIST) {
      return new Response(JSON.stringify({ error: 'Waitlist storage not configured.' }), {
        status: 500, headers
      });
    }

    // Deduplicate — if email already exists, still return success
    const existing = await env.WAITLIST.get(email);
    if (!existing) {
      await env.WAITLIST.put(email, JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
      }));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500, headers
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://veratype.ai',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
