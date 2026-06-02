# mcp-paypal

PayPal MCP Pack — read-only access to PayPal transactions, orders, invoices, and disputes.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `paypal_list_transactions` | Find PayPal transactions within a date range. Returns amount, status, payer info, and transaction IDs. Use to audit payments or track cash flow. |
| `paypal_get_order` | Get full details of a PayPal order by ID (e.g., "3JU84394D694620H"). Returns buyer info, items, amounts, and fulfillment status. |
| `paypal_list_invoices` | List your PayPal invoices. Returns invoice numbers, amounts, statuses, and dates. Use to track billing and outstanding payments. |
| `paypal_get_invoice` | Get full details of a PayPal invoice by ID. Returns line items, amounts, due dates, and payment status. |
| `paypal_list_disputes` | List chargebacks and claims against your account. Returns dispute IDs, amounts, statuses, and reasons. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "paypal": {
      "url": "https://gateway.pipeworx.io/paypal/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Paypal data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
