import './App.css';
import { gql, useQuery } from '@apollo/client';
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
        uvdb_models(uvdb_make_id: $make_id, limit:500) {
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
        uvdb_years(uvdb_make_id: $make_id, uvdb_model_id: $model_id, limit:500) {
          items {
            id
          }
        }
      }
    }
  }
`;

function Make({ makeId, setMakeId }) {
  const { loading, error, data } = useQuery(GET_MAKES);

  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;

  return (
    <>
      Make:
      <select onChange={e => setMakeId(e.target.value)} value={makeId}>
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

function Model({ modelId, setModelId, makeId }) {
  const { loading, error, data } = useQuery(GET_MODELS, {
    variables: { make_id: parseInt(makeId, 10) },
  });

  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;

  return (
    <>
      Model:
      <select onChange={e => setModelId(e.target.value)} value={modelId}>
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

function Year({ yearId, setYearId, makeId, modelId }) {
  const { loading, error, data } = useQuery(GET_YEARS, {
    variables: {
      make_id: parseInt(makeId, 10),
      model_id: parseInt(modelId, 10),
    }
  });

  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error :(</span>;

  return (
    <>
      Year:
      <select onChange={e => setYearId(e.target.value)} value={yearId}>
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
  const [makeId, setMakeId] = useState()
  const [modelId, setModelId] = useState()
  const [yearId, setYearId] = useState()

  return (
    <div className="App">
      <Make
        makeId={makeId}
        setMakeId={setMakeId}
      />
      <Model
        modelId={modelId}
        setModelId={setModelId}
        makeId={makeId}
      />
      <Year
        yearId={yearId}
        setYearId={setYearId}
        makeId={makeId}
        modelId={modelId}
      />
    </div>
  );
}

export default App;
