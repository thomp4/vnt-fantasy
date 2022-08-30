// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json')
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/static.json', 'utf8')
  res.status(200).json(fileContents)
}
