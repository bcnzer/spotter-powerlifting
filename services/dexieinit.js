import Dexie from 'dexie'

export const spotterDb = new Dexie('SpotterPowerlifting')
spotterDb.version(1).stores({
  federations: '++name',
  comps: '++id, id, comp_ref',
  lifters:
    '++id, lifter_ref, compid, comp_ref, flight, team, gender, flight_index',
  teams: '++id, compid, comp_ref, abbreviation'
})
