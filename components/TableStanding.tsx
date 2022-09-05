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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface Props {
  standings: any[]
  playersPoint: any[]
  membersData: any
  membersTransfer: any
  currentEvent: number
}

const TableStanding: React.FC<Props> = ({ standings, playersPoint, membersData, membersTransfer, currentEvent }) => {
  const [elements, setElements] = useState<any>({})
  // console.log('--standings--', standings)
  // console.log('--playersPoint--', playersPoint)
  // console.log('--membersTransfer--', membersTransfer)

  useEffect(() => {
    async function fetchStaticData() {
      const res = await axios.get('/api/static').then((res) => {
        return JSON.parse(res.data)
      })
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
    // console.log('--elements--', elements)
    if (data && data.stats && elementData) {
      const elementData = elements[elementId]
      const stats = data.stats
      const isBench = [12, 13, 14, 15].includes(position)
      return (
        <div className={'flex justify-between gap-4'}>
          <span
            className={
              is_captain ? 'text-emerald-400' : isBench ? 'text-rose-400' : is_vice_captain ? 'text-purple-400' : ''
            }
          >
            {elementData.first_name} {elementData.second_name}
            {isBench && ' [B]'}
            {is_captain && ' [C]'}
            {is_vice_captain && ' [V]'}
          </span>
          <span
            className={
              is_captain ? 'text-emerald-400' : isBench ? 'text-rose-400' : is_vice_captain ? 'text-purple-400' : ''
            }
          >
            {stats.total_points}
          </span>
        </div>
      )
    }
    return <></>
  }

  const renderCaptainAndVice = (memData: any, type: 'captain' | 'vice_captain') => {
    const picks = memData ? memData.picks : []
    if (Array.isArray(picks) && picks.length > 0) {
      const elementItem = picks.find((item) => (type === 'vice_captain' ? item.is_vice_captain : item.is_captain))
      const elementId = elementItem.element
      const elementData = elements[elementId]
      return elementData.web_name
    }
    return ''
  }

  const renderHits = (memData: any) => {
    const entryHistory = memData ? memData.entry_history : null
    if (entryHistory) {
      return entryHistory.event_transfers_cost * -1
    }
    return ''
  }

  const renderTransfer = (transData: any, isWildcard?: boolean) => {
    if (!transData || isWildcard) return ''
    const transfers = Object.values(transData)
    if (Array.isArray(transfers) && transfers.length > 0) {
      const transInGw = transfers.filter((item) => item.event === currentEvent)
      return (
        <div>
          {transInGw.map((item, index) => {
            return (
              <div key={index}>
                <span className={'text-red-600'}>{elements[item.element_out]?.['web_name']}</span> {'>'}{' '}
                <span className={'text-lime-600'}>{elements[item.element_in]?.['web_name']}</span>
              </div>
            )
          })}
        </div>
      )
    }
    return ''
  }

  const renderUpDownRank = (rowData: any) => {
    const { last_rank, rank_sort } = rowData
    return last_rank < rank_sort ? (
      <div className={'flex items-center justify-center bg-red-400 w-[20px] h-[20px] rounded-full'}>
        <KeyboardArrowDownIcon fontSize={'small'} />
      </div>
    ) : last_rank > rank_sort ? (
      <div className={'flex items-center justify-center bg-emerald-400 w-[20px] h-[20px] rounded-full'}>
        <KeyboardArrowUpIcon fontSize={'small'} />
      </div>
    ) : (
      <div className={'flex items-center justify-center bg-gray-400 w-[20px] h-[20px] rounded-full'} />
    )
  }

  return (
    <div>
      <h2 className={'mb-4 px-4 font-medium text-xl'}>Solo</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }}>Rank</TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Manager
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                GW
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Total
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Hits
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Chip
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Captain
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Vice
              </TableCell>
              <TableCell classes={{ root: 'bg-teal-200 font-bold' }} align="left">
                Transfers
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((row) => (
              <TableRow key={row.entry} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <div className={'flex gap-3'}>
                    <span>{row.rank}</span> <span>{renderUpDownRank(row)}</span>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <div className={'flex flex-col'}>
                    <p>{row.entry_name}</p>
                    <p>{row.player_name}</p>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Tooltip
                    placement={'bottom'}
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
                    <span className={'cursor-pointer'}>{row.event_total}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">{row.total}</TableCell>
                <TableCell align="left">{renderHits(membersData[row.entry])}</TableCell>
                <TableCell align="left">
                  {membersData[row.entry] ? membersData[row.entry]['active_chip'] : ''}
                </TableCell>
                <TableCell align="left" classes={{ root: 'text-emerald-600' }}>
                  {renderCaptainAndVice(membersData[row.entry], 'captain')}
                </TableCell>
                <TableCell align="left" classes={{ root: 'text-purple-600' }}>
                  {renderCaptainAndVice(membersData[row.entry], 'vice_captain')}
                </TableCell>
                <TableCell align="left">
                  {renderTransfer(membersTransfer[row.entry], membersData[row.entry]?.['active_chip'] === 'wildcard')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableStanding
