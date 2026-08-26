# mcp-paypal

PayPal MCP Pack — read-only access to PayPal transactions, orders, invoices, and disputes.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/paypal/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Paypal data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
