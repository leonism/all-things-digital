export async function onRequestGet(context) {
  // 1. Get the authorization code from the query parameters
  const code = context.request.url.split('code=')[1];

  // 2. Exchange the code for an access token
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;
  const tokenUrl = 'https://github.com/login/oauth/access_token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const data = await response.json();
  const accessToken = data.access_token;

  // 3. (Optional) Verify the access token with the GitHub API
  // const userResponse = await fetch('https://api.github.com/user', {
  //   headers: {
  //     'Authorization': `token ${accessToken}`,
  //   },
  // });
  // const userData = await userResponse.json();

  // 4. Return a success response (e.g., redirect to the admin page)
  const redirectUrl = '/admin/#/'; // Or the correct admin page URL
  return Response.redirect(redirectUrl, 302);
}
