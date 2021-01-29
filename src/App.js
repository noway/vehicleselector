import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useState } from 'react'

const GET_MAKES = gql`
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
const GET_MODELS = gql`
  query Model($make_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_models(uvdb_make_id:$make_id, limit:500) {
          items {
            id
            name
          }
        }
      }
    }
  }
`;


const GET_YEARS = gql`
  query Year($make_id: Int!, $model_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_years(uvdb_make_id:$make_id, uvdb_model_id:$model_id, limit:500) {
          items {
            id
          }
        }
      }
    }
  }
`;



function Make({ make, setMake }) {
  const { loading, error, data } = useQuery(GET_MAKES);
  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;


  return (
    <>
      Make:
      <select onChange={e => setMake(e.target.value)} value={make}>
        <option>Please select</option>
        {
          data.uvdb.vehicle_selector.uvdb_makes.items.map(({ id, name }) => (
            <option value={id}>{name}</option>
          ))
        }
      </select>
    </>
  )
}

function Model({ model, setModel, make }) {
  const { loading, error, data } = useQuery(GET_MODELS, {
    variables: { make_id: parseInt(make, 10) },
  });
  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;


  return (
    <>
      Model:
      <select onChange={e => setModel(e.target.value)} value={model}>
        <option>Please select</option>
        {
          data.uvdb.vehicle_selector.uvdb_models.items.map(({ id, name }) => (
            <option value={id}>{name}</option>
          ))
        }
      </select>
    </>
  )
}

function Year({ year, setYear, make, model }) {
  const { loading, error, data } = useQuery(GET_YEARS, {
    variables: {
      make_id: parseInt(make, 10),
      model_id: parseInt(model, 10),
    }
  });
  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;


  return (
    <>
      Year:
      <select onChange={e => setYear(e.target.value)} value={year}>
        <option>Please select</option>
        {
          data.uvdb.vehicle_selector.uvdb_years.items.map(({ id, name }) => (
            <option value={id}>{id}</option>
          ))
        }
      </select>
    </>
  )
}


function App() {
  const [make, setMake] = useState() // TODO: rename to makeId
  const [model, setModel] = useState()
  const [year, setYear] = useState()

  return (
    <div className="App">
      <Make
        make={make}
        setMake={setMake}
      />
      <Model
        model={model}
        setModel={setModel}
        make={make}
      />
      <Year
        year={year}
        setYear={setYear}
        make={make}
        model={model}
      />
    </div>
  );
}

export default App;
