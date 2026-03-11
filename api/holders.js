export default async function handler(req, res) {
  try {
    const wallet =
      req.query.wallet ||
      (req.body && typeof req.body === "object" ? req.body.wallet : null);

    if (!wallet) {
      return res.status(400).json({
        ok: false,
        error: "Missing wallet address",
      });
    }

    const CONTRACT = "BGQ93dY5dKdbxuajhbDbYhXQcJ6Ax6g3zZ46ekePpump";

    const RPC_URL =
      process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

    const rpcBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        wallet,
        { mint: CONTRACT },
        { encoding: "jsonParsed" }
      ]
    };

    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcBody),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: RPC HTTP ${response.status},
      });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        ok: false,
        error: data.error.message || "RPC error",
      });
    }

    const accounts = data.result?.value || [];

    let balance = 0;

    for (const account of accounts) {
      const parsedAmount =
        account?.account?.data?.parsed?.info?.tokenAmount;

      const uiAmount = Number(
        parsedAmount?.uiAmount ??
        parsedAmount?.uiAmountString ??
        0
      );

      if (!Number.isNaN(uiAmount)) {
        balance += uiAmount;
      }
    }

    return res.status(200).json({
      ok: true,
      holder: balance > 0,
      balance,
      wallet,
      contract: CONTRACT,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Verification failed",
    });
  }
}
