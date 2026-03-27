export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://veratype.ai',
  };

  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const question = (body.question || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400, headers,
      });
    }

    if (question.length <= 1) {
      return new Response(JSON.stringify({ error: 'Please enter your question.' }), {
        status: 400, headers,
      });
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured.' }), {
        status: 500, headers,
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Veratype <noreply@veratype.ai>',
        to: ['julian@veratype.ai'],
        reply_to: email,
        subject: `Question from ${email}`,
        text: `From: ${email}\n\nQuestion:\n${question}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', JSON.stringify(err));
      return new Response(JSON.stringify({ error: 'Failed to send. Please try again.' }), {
        status: 500, headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500, headers,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://veratype.ai',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
