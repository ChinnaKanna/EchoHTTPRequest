import { headers, cookies } from "next/headers";

export function collectServerData() {
  const h = headers();
  const c = cookies();
  const headerData = Object.fromEntries(h.entries());
  const cookieData = Object.fromEntries(c.getAll().map(cookie => [cookie.name, cookie.value]));
  
  // Parse User-Agent details
  const userAgent = headerData['user-agent'] || '';
  const parseUserAgent = (ua: string) => {
    const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/)?.[0] || 'Unknown';
    const os = ua.match(/(Windows|Mac|Linux|Android|iOS)/)?.[0] || 'Unknown';
    return { browser, os, full: ua };
  };

  // Parse Accept headers
  const parseAccept = (accept: string) => {
    return accept?.split(',').map(type => type.trim()) || [];
  };

  // Detect client hints
  const clientHints = {
    'sec-ch-ua': headerData['sec-ch-ua'],
    'sec-ch-ua-mobile': headerData['sec-ch-ua-mobile'],
    'sec-ch-ua-platform': headerData['sec-ch-ua-platform'],
    'sec-ch-ua-arch': headerData['sec-ch-ua-arch'],
    'sec-ch-ua-bitness': headerData['sec-ch-ua-bitness'],
    'sec-ch-ua-model': headerData['sec-ch-ua-model'],
    'sec-ch-ua-platform-version': headerData['sec-ch-ua-platform-version'],
    'sec-ch-ua-full-version': headerData['sec-ch-ua-full-version'],
    'sec-ch-ua-full-version-list': headerData['sec-ch-ua-full-version-list']
  };

  // Security headers
  const securityHeaders = {
    'sec-fetch-site': headerData['sec-fetch-site'],
    'sec-fetch-mode': headerData['sec-fetch-mode'],
    'sec-fetch-user': headerData['sec-fetch-user'],
    'sec-fetch-dest': headerData['sec-fetch-dest'],
    'sec-purpose': headerData['sec-purpose'],
    'origin': headerData['origin'],
    'referer': headerData['referer']
  };

  // Content negotiation
  const contentNegotiation = {
    'accept': parseAccept(headerData['accept']),
    'accept-language': headerData['accept-language']?.split(',').map(lang => lang.trim()),
    'accept-encoding': headerData['accept-encoding']?.split(',').map(enc => enc.trim()),
    'accept-charset': headerData['accept-charset']?.split(',').map(charset => charset.trim())
  };

  // Connection details
  const connectionInfo = {
    'connection': headerData['connection'],
    'upgrade-insecure-requests': headerData['upgrade-insecure-requests'],
    'cache-control': headerData['cache-control'],
    'pragma': headerData['pragma'],
    'if-modified-since': headerData['if-modified-since'],
    'if-none-match': headerData['if-none-match']
  };

  // HTTP version detection
  const getHttpVersion = () => {
    if (headerData[':method']) {
      if (headerData['alt-svc']?.includes('h3')) return 'HTTP/3';
      return 'HTTP/2';
    }
    return 'HTTP/1.1';
  };

  return {
    // Raw data
    headers: headerData,
    cookies: cookieData,
    
    // Parsed request info
    request: {
      method: headerData[':method'] || headerData['method'] || 'GET',
      url: headerData[':path'] || headerData['path'] || '/',
      protocol: headerData[':scheme'] || 'https',
      httpVersion: getHttpVersion(),
      host: headerData['host'] || headerData[':authority'],
      remoteAddress: headerData['x-forwarded-for'] || headerData['x-real-ip'] || 'unknown'
    },

    // Client information
    client: {
      userAgent: parseUserAgent(userAgent),
      clientHints: Object.fromEntries(Object.entries(clientHints).filter(([_, v]) => v)),
      dnt: headerData['dnt'],
      viewport: headerData['viewport-width']
    },

    // Content negotiation
    contentNegotiation: Object.fromEntries(Object.entries(contentNegotiation).filter(([_, v]) => v)),

    // Security context
    security: Object.fromEntries(Object.entries(securityHeaders).filter(([_, v]) => v)),

    // Connection details
    connection: Object.fromEntries(Object.entries(connectionInfo).filter(([_, v]) => v)),

    // Server context
    server: {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      env: process.env.NODE_ENV
    },

    // Additional metadata
    metadata: {
      headerCount: Object.keys(headerData).length,
      cookieCount: Object.keys(cookieData).length,
      hasClientHints: Object.values(clientHints).some(v => v),
      isSecureContext: headerData[':scheme'] === 'https' || headerData['x-forwarded-proto'] === 'https',
      isMobile: headerData['sec-ch-ua-mobile'] === '?1' || /Mobile|Android/i.test(userAgent)
    }
  };
}