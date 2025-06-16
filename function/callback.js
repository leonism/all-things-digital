function renderBody(status, content) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
    `;
  const blob = new Blob([html]);
  return blob;
}

export async function onRequest(context) {
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'user-agent': 'cloudflare-functions-github-oauth-login-demo',
          accept: 'application/json',
        },
        body: JSON.stringify({ client_id, client_secret, code }),
      },
    );
    const result = await response.json();
    if (result.error) {
      return new Response(renderBody('error', result), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
        status: 401,
      });
    }
    const token = result.access_token;
    const provider = 'github';
    const responseBody = renderBody('success', {
      token,
      provider,
    });
    return new Response(responseBody, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
      status: 500,
    });
  }
}

// export async function onRequestGet(context) {
//   // 1. Get the authorization code from the query parameters
//   const code = context.request.url.split('code=')[1];

//   // 2. Exchange the code for an access token
//   const clientId = context.env.GITHUB_CLIENT_ID;
//   const clientSecret = context.env.GITHUB_CLIENT_SECRET;
//   const tokenUrl = 'https://github.com/login/oauth/access_token';

//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     body: JSON.stringify({
//       client_id: clientId,
//       client_secret: clientSecret,
//       code: code,
//     }),
//   });

//   const data = await response.json();
//   const accessToken = data.access_token;

//   // 3. (Optional) Verify the access token with the GitHub API
//   // const userResponse = await fetch('https://api.github.com/user', {
//   //   headers: {
//   //     'Authorization': `token ${accessToken}`,
//   //   },
//   // });
//   // const userData = await userResponse.json();

//   // 4. Return a success response (e.g., redirect to the admin page)
//   const redirectUrl = '/admin/#/'; // Or the correct admin page URL
//   return Response.redirect(redirectUrl, 302);
// }
