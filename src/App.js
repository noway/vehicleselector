import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const MAKES = gql`
  {
    uvdb {
      vehicle_selector {
        uvdb_makes(limit:500) {
          items {
            id
            name
          }
        }
      }
    }
  }
`;


function App() {
  const { loading, error, data } = useQuery(MAKES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      Make:
      <select>
        {
          data.uvdb.vehicle_selector.uvdb_makes.items.map(({ id, name }) => (
            <option value={id}>{name}</option>
          ))
        }
      </select>
    </div>
  );
}

export default App;
