import { NextResponse } from 'next/server';

const getKvBinding = () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const namespaceId = process.env.CLOUDFLARE_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !namespaceId || !apiToken) {
        throw new Error('Cloudflare KV credentials are not configured in environment variables.');
    }

    return { accountId, namespaceId, apiToken };
}

async function getValue(key: string) {
    const { accountId, namespaceId, apiToken } = getKvBinding();
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
        cache: 'no-store'
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`Failed to get value from KV: ${response.statusText}`);
    }
    
    return response.text();
}

async function putValue(key: string, value: string) {
    const { accountId, namespaceId, apiToken } = getKvBinding();
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'text/plain'
        },
        body: value
    });

    if (!response.ok) {
        throw new Error(`Failed to put value to KV: ${response.statusText}`);
    }
}


export async function GET() {
  try {
    const configJson = await getValue('adConfig');
    if (configJson === null) {
      // Return an empty object or a default structure if not found
      return NextResponse.json({});
    }
    return NextResponse.json(JSON.parse(configJson));
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ message: 'Failed to fetch ad config', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    await putValue('adConfig', JSON.stringify(config));
    return NextResponse.json({ message: 'Ad config saved successfully' });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ message: 'Failed to save ad config', error: (error as Error).message }, { status: 500 });
  }
}
