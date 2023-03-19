import { Client } from './src/client'
import { SearchConsole } from './src/search-console'

const afterConnect = () => {
  searchConsole.prompt()
}
const url = 'http://localhost:3000'
const client = new Client(url, afterConnect)
const searchConsole = new SearchConsole(client)

//callback will initiate prompt after server omits a connect event to the client
client.connect()
