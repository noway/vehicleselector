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

function Select({ label, placeholder, disabled, items, setValue, value }) {
  return (
    <>
      <span>{label}: </span>
      <select onChange={e => setValue(e.target.value)} value={value ?? ""} disabled={disabled}>
        <option value="">{placeholder}</option>
        {items.map(({ id, name }) => (
          <option value={id} key={id}>{name ?? id}</option>
        ))}
      </select>
    </>
  )
}

function Stub({ label, message }) {
  return <Select label={label} placeholder={message} disabled={true} items={[]} />
}

function Make({ makeId, setMakeId }) {
  const { loading, error, data } = useQuery(GET_MAKES);

  if (loading) return <Stub label="Make" message="Loading..." />
  if (error) return <Stub label="Make" message="Error :(" />

  return (
    <>
      <Select
        label="Make"
        placeholder="Please select"
        items={data?.uvdb?.vehicle_selector?.uvdb_makes?.items}
        setValue={setMakeId}
        value={makeId}
      />
    </>
  )
}

function Model({ modelId, setModelId, makeId }) {
  const { loading, error, data } = useQuery(GET_MODELS, {
    variables: { make_id: parseInt(makeId, 10) },
  });

  if (loading) return <Stub label="Model" message="Loading..." />
  if (error) return <Stub label="Model" message="Error :(" />

  return (
    <>
      <Select
        label="Model"
        placeholder="Please select"
        items={data?.uvdb?.vehicle_selector?.uvdb_models?.items}
        setValue={setModelId}
        value={modelId}
      />
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

  if (loading) return <Stub label="Year" message="Loading..." />
  if (error) return <Stub label="Year" message="Error :(" />

  return (
    <>
      <Select
        label="Year"
        placeholder="Please select"
        items={data?.uvdb?.vehicle_selector?.uvdb_years?.items}
        setValue={setYearId}
        value={yearId}
      />
    </>
  )
}


function App() {
  const [makeId, setMakeId] = useState(null)
  const [modelId, setModelId] = useState(null)
  const [yearId, setYearId] = useState(null)

  return (
    <div className="App">
      <Make
        makeId={makeId}
        setMakeId={(val) => {setMakeId(val); setModelId(null); setYearId(null)}}
      />
      {makeId !== null ?
        <Model
          modelId={modelId}
          setModelId={(val) => {setModelId(val); setYearId(null)}}
          makeId={makeId}
        /> 
        : <Stub label="Model" message="..." />}
      {makeId !== null && modelId !== null ?
        <Year
          yearId={yearId}
          setYearId={setYearId}
          makeId={makeId}
          modelId={modelId}
        />
        : <Stub label="Year" message="..." />}
    </div>
  );
}

export default App;
