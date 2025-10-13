// Simple in-memory notes store
let notes = [];

export async function GET(request) {
  return new Response(JSON.stringify(notes), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const body = await request.json();
  // Expect { title, content }
  if (!body || !body.title || !body.content) {
    return new Response(JSON.stringify({ error: 'Missing title or content' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const note = {
    id: Date.now(),
    title: body.title,
    content: body.content,
    created: new Date().toISOString(),
  };
  notes.push(note);
  return new Response(JSON.stringify(note), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
