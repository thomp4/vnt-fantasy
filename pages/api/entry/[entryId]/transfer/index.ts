// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { entryId } = req.query
  try {
    const response = await axios
      .get(`https://fantasy.premierleague.com/api/entry/${entryId}/transfers/`)
      .then((res) => res.data)
    res.status(200).json({ ...response })
  } catch (err) {
    res.status(500)
  }
}
