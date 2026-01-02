// Vercel Serverless Function for GitHub OAuth token exchange
export default async function handler(req: any, res: any) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' })
  }

  try {
    // 交换 code 获取 access_token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const data = await response.json()

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error })
    }

    return res.status(200).json({
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    })
  }
  catch (error: any) {
    console.error('OAuth error:', error)
    return res.status(500).json({ error: 'Failed to exchange token' })
  }
}
