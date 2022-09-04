import type { NextPage } from 'next'
import Layout from '@src/components/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { VNTRIP_TEAMS } from '@src/constants'
import Tooltip from '@mui/material/Tooltip'
import TableStanding from '@src/components/TableStanding'

interface Props {
  data: any
  currentEvent: number
}
//https://cors-anywhere.herokuapp.com/

const Home: NextPage<Props> = ({ data, currentEvent }) => {
  const [standings, setStandings] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [playersPoint, setPlayersPoint] = useState<any[]>([])
  const [membersData, setMembersData] = useState<any>({})
  const [membersTransfer, setMembersTransfer] = useState<any>({})

  // console.log('--data---', data)

  useEffect(() => {
    if (data && data.standings) {
      const results: any[] = data.standings.results
      setStandings(results)
      let team3T: any[] = []
      let team89: any[] = []
      let team87: any[] = []
      for (let item of results) {
        if (VNTRIP_TEAMS['3T_TEAM'].includes(item.entry)) {
          team3T.push(item)
        }
        if (VNTRIP_TEAMS['89_TEAM'].includes(item.entry)) {
          team89.push(item)
        }
        if (VNTRIP_TEAMS['87_TEAM'].includes(item.entry)) {
          team87.push(item)
        }
        let _dataTeam: any[] = []
        ;[team3T, team89, team87].forEach((team, index) => {
          let gw_point = 0
          let total_point = 0
          let players: any[] = []

          team.forEach((player) => {
            gw_point += player.event_total
            total_point += player.total
            players.push({
              entry_name: player.entry_name,
              player_name: player.player_name,
              entry: player.entry,
            })
          })
          _dataTeam.push({
            name: index === 0 ? '3T Team' : index === 1 ? '89 Team' : '87 Team',
            gw_point,
            total_point,
            players,
          })
        })
        setTeams(_dataTeam.sort((a, b) => b.gw_point - a.gw_point))
      }
    } else {
      setStandings([])
    }
  }, [data])

  // fetch data for each member
  useEffect(() => {
    async function fetchDataPlayer() {
      const results: any[] = data.standings.results
      const promiseArr: any[] = []
      for (let item of results) {
        promiseArr.push(axios.get(`/api/entry/${item.entry}/${currentEvent}/`).then((res) => res.data))
      }
      try {
        const resPickteam = await Promise.all(promiseArr)
        let members: any = {}
        for (let i = 0; i < results.length; i++) {
          const entry = results[i].entry
          members[entry] = resPickteam[i]
        }
        setMembersData(members)
      } catch (err) {
        console.log(err)
      }
    }
    if (data && data.standings && currentEvent) {
      fetchDataPlayer()
    }
  }, [data, currentEvent])

  // get transfer history
  useEffect(() => {
    async function fetchTransfers() {
      const results: any[] = data.standings.results
      const promiseArr: any[] = []
      for (let item of results) {
        promiseArr.push(axios.get(`/api/entry/${item.entry}/transfer/`).then((res) => res.data))
      }
      try {
        const resTransfer = await Promise.all(promiseArr)
        let transfers: any = {}
        for (let i = 0; i < results.length; i++) {
          const entry = results[i].entry
          transfers[entry] = resTransfer[i]
        }
        setMembersTransfer(transfers)
      } catch (err) {
        console.log(err)
      }
    }

    if (data && data.standings) {
      fetchTransfers()
    }
  }, [data])

  // get players data
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const res = await axios.get('/api/live/' + currentEvent).then((r) => r.data)
        if (Array.isArray(res.elements)) {
          setPlayersPoint(res.elements)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchLiveData()
  }, [currentEvent])

  return (
    <Layout>
      <h1 className={'mt-10 text-center font-bold text-3xl uppercase'}>{data.league.name} league</h1>

      <div className={'mt-6 mb-10'}>
        <h2 className={'mb-4 px-4 font-medium text-xl'}>Team</h2>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell classes={{ root: 'bg-rose-200' }}>Rank</TableCell>
                <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                  Team
                </TableCell>
                <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                  GW
                </TableCell>
                <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    <Tooltip
                      placement={'right'}
                      arrow
                      enterTouchDelay={150}
                      title={
                        <div>
                          {row.players.map((player: any) => (
                            <p key={player.entry}>
                              <span className={'text-rose-200'}>{player.entry_name}</span> ({player.player_name})
                            </p>
                          ))}
                        </div>
                      }
                    >
                      <span>{row.name}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="left">{row.gw_point}</TableCell>
                  <TableCell align="left">{row.total_point}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className={'my-6'} />

        <TableStanding
          standings={standings}
          membersData={membersData}
          membersTransfer={membersTransfer}
          playersPoint={playersPoint}
          currentEvent={currentEvent}
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const res: any = await Promise.all([
      axios.get(`https://fantasy.premierleague.com/api/entry/2547859/`).then((res) => res.data),
      axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${510143}/standings/`).then((res) => res.data),
    ])
    return {
      props: {
        currentEvent: res[0].current_event,
        data: res[1],
      },
    }
  } catch (err: any) {
    return {
      props: {
        error: { statusCode: 400 },
      },
    }
  }
}

export default Home
