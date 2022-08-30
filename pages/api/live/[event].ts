// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { event } = req.query
  try {
    const response = await axios
      .get(`https://fantasy.premierleague.com/api/event/${event}/live/`)
      .then((res) => res.data)
    res.status(200).json({ ...response })
  } catch (err) {
    res.status(500)
  }
}
