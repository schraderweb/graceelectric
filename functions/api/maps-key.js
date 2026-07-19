export async function onRequest(context) {
  const { env } = context;
  return new Response(JSON.stringify({ key: env.GOOGLE_MAPS_API_KEY }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
