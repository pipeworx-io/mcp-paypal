# mcp-paypal

PayPal MCP Pack — read-only access to PayPal transactions, orders, invoices, and disputes.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `paypal_list_transactions` | List PayPal transactions within a date range. Returns transaction details including amount, status, and payer info. |
| `paypal_get_order` | Get details of a specific PayPal order by its ID. |
| `paypal_list_invoices` | List invoices from your PayPal account. Returns invoice numbers, amounts, and statuses. |
| `paypal_get_invoice` | Get details of a specific PayPal invoice by its ID. |
| `paypal_list_disputes` | List disputes (chargebacks and claims) from your PayPal account. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "paypal": {
      "url": "https://gateway.pipeworx.io/paypal/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use paypal
```

## License

MIT
