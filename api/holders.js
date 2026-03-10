export default async function handler(req, res) {
  try {
    const tokenAddress = "BGQ93dY5dKdbxuajhbDbYhXQcJ6Ax6g3zZ46ekePpump";

    const response = await fetch(
      https://pro-api.solscan.io/v2.0/token/holders?address=${tokenAddress}&page=1&page_size=10,
      {
        headers: {
          token: process.env.SOLSCAN_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      holders: data.data.total
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
