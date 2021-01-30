import './App.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react'

// TODO: configure limit

const GET_ALL_MAKES = gql`
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
const GET_MODELS_BY_MAKE = gql`
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
const GET_YEARS_BY_MAKE_MODEL = gql`
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

const GET_ALL_YEARS = gql`
  query Year {
    uvdb {
      vehicle_selector {
        uvdb_years(limit:500) {
          items {
            id
          }
        }
      }
    }
  }
`;

const GET_MAKES_BY_YEAR = gql`
  query Make($year_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_makes(uvdb_year_id: $year_id, limit:500) {
          items {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_MODELS_BY_YEAR_MAKE = gql`
  query Model($year_id: Int!, $make_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_models(uvdb_year_id: $year_id, uvdb_make_id: $make_id, limit:500) {
          items {
            id
            name
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
  const { loading, error, data } = useQuery(GET_ALL_MAKES);

  if (loading) return <Stub label="Make" message="Loading..." />
  if (error) return <Stub label="Make" message="Error :(" />

  return (
    <Select
      label="Make"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_makes?.items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByMake({ modelId, setModelId, makeId }) {
  const { loading, error, data } = useQuery(GET_MODELS_BY_MAKE, {
    skip: makeId === null,
    variables: {
      make_id: parseInt(makeId, 10),
    },
  });

  if (makeId === null) return <Stub label="Model" message="..." />
  if (loading) return <Stub label="Model" message="Loading..." />
  if (error) return <Stub label="Model" message="Error :(" />

  return (
    <Select
      label="Model"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_models?.items}
      setValue={setModelId}
      value={modelId}
    />
  )
}

function YearByMakeModel({ yearId, setYearId, makeId, modelId }) {
  const { loading, error, data } = useQuery(GET_YEARS_BY_MAKE_MODEL, {
    skip: makeId === null || modelId === null,
    variables: {
      make_id: parseInt(makeId, 10),
      model_id: parseInt(modelId, 10),
    }
  });

  if (makeId === null || modelId === null) return <Stub label="Year" message="..." />
  if (loading) return <Stub label="Year" message="Loading..." />
  if (error) return <Stub label="Year" message="Error :(" />

  return (
    <Select
      label="Year"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_years?.items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function Year({ yearId, setYearId, makeId, modelId }) {
  const { loading, error, data } = useQuery(GET_ALL_YEARS);

  if (loading) return <Stub label="Year" message="Loading..." />
  if (error) return <Stub label="Year" message="Error :(" />

  return (
    <Select
      label="Year"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_years?.items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function MakeByYear({ makeId, setMakeId, yearId }) {
  const { loading, error, data } = useQuery(GET_MAKES_BY_YEAR, {
    skip: yearId === null,
    variables: {
      year_id: parseInt(yearId, 10)
    }
  });

  if (yearId === null) return <Stub label="Make" message="..." />
  if (loading) return <Stub label="Make" message="Loading..." />
  if (error) return <Stub label="Make" message="Error :(" />

  return (
    <Select
      label="Make"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_makes?.items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByYearMake({ modelId, setModelId, yearId, makeId }) {
  const { loading, error, data } = useQuery(GET_MODELS_BY_YEAR_MAKE, {
    skip: yearId === null || makeId === null,
    variables: {
      year_id: parseInt(yearId, 10),
      make_id: parseInt(makeId, 10),
    },
  });

  if (yearId === null || makeId === null) return <Stub label="Model" message="..." />
  if (loading) return <Stub label="Model" message="Loading..." />
  if (error) return <Stub label="Model" message="Error :(" />

  return (
    <Select
      label="Model"
      placeholder="Please select"
      items={data?.uvdb?.vehicle_selector?.uvdb_models?.items}
      setValue={setModelId}
      value={modelId}
    />
  )
}



function App() {
  const [mode, setMode] = useState('MMY')
  const [makeId, setMakeId] = useState(null)
  const [modelId, setModelId] = useState(null)
  const [yearId, setYearId] = useState(null)

  return (
    <div className="App">
      <div>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="MMY">Make/Model/Year</option>
          <option value="YMM">Year/Make/Model</option>
        </select>
      </div>
      {mode === 'MMY' ? 
        <>
          <Make
            makeId={makeId}
            setMakeId={(val) => {setMakeId(val); setModelId(null); setYearId(null)}}
          />
          <ModelByMake
            modelId={modelId}
            setModelId={(val) => {setModelId(val); setYearId(null)}}
            makeId={makeId}
          /> 
          <YearByMakeModel
            yearId={yearId}
            setYearId={(val) => {setYearId(val)}}
            makeId={makeId}
            modelId={modelId}
          />
        </> :
        <>
          <Year
            yearId={yearId}
            setYearId={(val) => {setYearId(val); setMakeId(null); setModelId(null)}}
          />
          <MakeByYear
            makeId={makeId}
            setMakeId={(val) => {setMakeId(val); setModelId(null)}}
            yearId={yearId}
          /> 
          <ModelByYearMake
            modelId={modelId}
            setModelId={(val) => {setModelId(val)}}
            yearId={yearId}
            makeId={makeId}
          />
        </>}
    </div>
  );
}

export default App;
