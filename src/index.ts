interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * PayPal MCP Pack — read-only access to PayPal transactions, orders, invoices, and disputes.
 *
 * BYO key: pass _clientId and _clientSecret as parameters.
 * Auth: OAuth2 client credentials flow — fetches access token, then Bearer auth.
 * Set _sandbox: true to use sandbox environment.
 */


function getBaseUrl(sandbox: boolean) {
  return sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

async function getAccessToken(clientId: string, clientSecret: string, sandbox: boolean): Promise<string> {
  const base = getBaseUrl(sandbox);
  const encoded = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth error (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function ppFetch(token: string, base: string, path: string) {
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'paypal_list_transactions',
    description: 'List PayPal transactions within a date range. Returns transaction details including amount, status, and payer info.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _clientId: { type: 'string', description: 'PayPal app Client ID' },
        _clientSecret: { type: 'string', description: 'PayPal app Client Secret' },
        _sandbox: { type: 'boolean', description: 'Use sandbox environment (default: false)' },
        start_date: { type: 'string', description: 'Start date in ISO 8601 format (e.g., 2024-01-01T00:00:00Z)' },
        end_date: { type: 'string', description: 'End date in ISO 8601 format (e.g., 2024-12-31T23:59:59Z)' },
      },
      required: ['_clientId', '_clientSecret', 'start_date', 'end_date'],
    },
  },
  {
    name: 'paypal_get_order',
    description: 'Get details of a specific PayPal order by its ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _clientId: { type: 'string', description: 'PayPal app Client ID' },
        _clientSecret: { type: 'string', description: 'PayPal app Client Secret' },
        _sandbox: { type: 'boolean', description: 'Use sandbox environment (default: false)' },
        order_id: { type: 'string', description: 'PayPal order ID' },
      },
      required: ['_clientId', '_clientSecret', 'order_id'],
    },
  },
  {
    name: 'paypal_list_invoices',
    description: 'List invoices from your PayPal account. Returns invoice numbers, amounts, and statuses.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _clientId: { type: 'string', description: 'PayPal app Client ID' },
        _clientSecret: { type: 'string', description: 'PayPal app Client Secret' },
        _sandbox: { type: 'boolean', description: 'Use sandbox environment (default: false)' },
        page: { type: 'number', description: 'Page number (default 1)' },
        page_size: { type: 'number', description: 'Results per page (default 20, max 100)' },
      },
      required: ['_clientId', '_clientSecret'],
    },
  },
  {
    name: 'paypal_get_invoice',
    description: 'Get details of a specific PayPal invoice by its ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _clientId: { type: 'string', description: 'PayPal app Client ID' },
        _clientSecret: { type: 'string', description: 'PayPal app Client Secret' },
        _sandbox: { type: 'boolean', description: 'Use sandbox environment (default: false)' },
        invoice_id: { type: 'string', description: 'PayPal invoice ID (e.g., INV2-XXXX-XXXX-XXXX-XXXX)' },
      },
      required: ['_clientId', '_clientSecret', 'invoice_id'],
    },
  },
  {
    name: 'paypal_list_disputes',
    description: 'List disputes (chargebacks and claims) from your PayPal account.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _clientId: { type: 'string', description: 'PayPal app Client ID' },
        _clientSecret: { type: 'string', description: 'PayPal app Client Secret' },
        _sandbox: { type: 'boolean', description: 'Use sandbox environment (default: false)' },
      },
      required: ['_clientId', '_clientSecret'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const clientId = args._clientId as string | undefined;
  const clientSecret = args._clientSecret as string | undefined;
  const sandbox = (args._sandbox as boolean) ?? false;
  delete args._context;
  delete args._apiKey;
  delete args._clientId;
  delete args._clientSecret;
  delete args._sandbox;

  if (!clientId || !clientSecret) {
    throw new Error('Both _clientId and _clientSecret are required for PayPal API access');
  }

  const base = getBaseUrl(sandbox);
  const token = await getAccessToken(clientId, clientSecret, sandbox);

  switch (name) {
    case 'paypal_list_transactions': {
      const params = new URLSearchParams({
        start_date: args.start_date as string,
        end_date: args.end_date as string,
        fields: 'all',
      });
      return ppFetch(token, base, `/v1/reporting/transactions?${params}`);
    }
    case 'paypal_get_order':
      return ppFetch(token, base, `/v2/checkout/orders/${args.order_id}`);
    case 'paypal_list_invoices': {
      const page = (args.page as number) ?? 1;
      const pageSize = Math.min(100, (args.page_size as number) ?? 20);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      return ppFetch(token, base, `/v2/invoicing/invoices?${params}`);
    }
    case 'paypal_get_invoice':
      return ppFetch(token, base, `/v2/invoicing/invoices/${args.invoice_id}`);
    case 'paypal_list_disputes':
      return ppFetch(token, base, '/v1/customer/disputes');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
