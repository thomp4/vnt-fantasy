import React, { useEffect, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'

interface Props {
  standings: any[]
  playersPoint: any[]
  membersData: any
}

const TableStanding: React.FC<Props> = ({ standings, playersPoint, membersData }) => {
  const [elements, setElements] = useState<any>({})

  useEffect(() => {
    async function fetchStaticData() {
      const res = await axios.get('/api/static').then((res) => res.data)
      if (Array.isArray(res.elements)) {
        let obj: any = {}
        for (let element of res.elements) {
          obj[element.id] = element
        }
        setElements(obj)
      }
    }

    fetchStaticData()
  }, [])

  const renderPlayerData = (member: any) => {
    const { element: elementId, is_captain, is_vice_captain, position } = member
    const data = playersPoint[elementId - 1]
    const elementData = elements[elementId]
    if (data && data.stats && elementData) {
      const elementData = elements[elementId]
      const stats = data.stats
      const isBench = [12, 13, 14, 15].includes(position)
      return (
        <div className={'flex justify-between gap-4'}>
          <span
            className={
              is_captain
                ? 'text-amber-400'
                : isBench
                ? 'text-rose-400'
                : is_vice_captain
                ? 'text-purple-400'
                : 'text-teal-400'
            }
          >
            {elementData.first_name} {elementData.second_name}
            {isBench && ' [B]'}
            {is_captain && ' [C]'}
            {is_vice_captain && ' [V]'}
          </span>
          <span
            className={
              is_captain
                ? 'text-amber-400'
                : isBench
                ? 'text-rose-400'
                : is_vice_captain
                ? 'text-purple-400'
                : 'text-teal-400'
            }
          >
            {stats.total_points}
          </span>
        </div>
      )
    }
    return <></>
  }

  return (
    <div>
      <h2 className={'mb-4 px-4 font-medium text-xl'}>Solo</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: 'bg-teal-200' }}>Rank</TableCell>
              <TableCell classes={{ root: 'bg-teal-200' }} align="left">
                Manager
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200' }} align="left">
                GW
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200' }} align="left">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((row) => (
              <TableRow key={row.entry} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.rank}
                </TableCell>
                <TableCell align="left">
                  <div className={'flex flex-col'}>
                    <p>{row.entry_name}</p>
                    <p>{row.player_name}</p>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Tooltip
                    placement={'right'}
                    arrow
                    enterTouchDelay={150}
                    title={
                      <div className={'p-2'}>
                        {membersData[row.entry] &&
                          Array.isArray(membersData[row.entry].picks) &&
                          membersData[row.entry].picks.map((item: any) => {
                            return <div key={item.element}>{renderPlayerData(item)}</div>
                          })}
                      </div>
                    }
                  >
                    <span>{row.event_total}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableStanding
