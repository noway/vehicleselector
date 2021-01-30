import './App.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react'
import { find, uniqBy } from 'lodash'
import {StatefulInput} from 'baseui/input';
import { Select, TYPE, SIZE } from "baseui/select";

const LIMIT = 500

const GET_MAKES = gql`
  query getMakes {
    uvdb {
      vehicle_selector {
        uvdb_makes(limit:${LIMIT}) {
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
  query getModelsByMake($make_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_models(uvdb_make_id: $make_id, limit:${LIMIT}) {
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
  query getYearsByMakeModel($make_id: Int!, $model_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_years(uvdb_make_id: $make_id, uvdb_model_id: $model_id, limit:${LIMIT}) {
          items {
            id
          }
        }
      }
    }
  }
`;

const GET_YEARS = gql`
  query getYears {
    uvdb {
      vehicle_selector {
        uvdb_years(limit:${LIMIT}) {
          items {
            id
          }
        }
      }
    }
  }
`;

const GET_MAKES_BY_YEAR = gql`
  query getMakesByYear($year_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_makes(uvdb_year_id: $year_id, limit:${LIMIT}) {
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
  query getModelsByYearMake($year_id: Int!, $make_id: Int!) {
    uvdb {
      vehicle_selector {
        uvdb_models(uvdb_year_id: $year_id, uvdb_make_id: $make_id, limit:${LIMIT}) {
          items {
            id
            name
          }
        }
      }
    }
  }
`;


function VSSelect({ label, placeholder, disabled, items, setValue, value, loading }) {
  const uniqItems = uniqBy(items, 'id')
  const selectValue = find(uniqItems, { id: value })
  return (
    <Select
      size={SIZE.mini}
      options={uniqItems.map(({name, id}) => ({ label: name ?? id, id: id }))}
      value={selectValue ? [selectValue] : []}
      placeholder={placeholder}
      maxDropdownHeight="300px"
      isLoading={loading}
      type={TYPE.search}
      clearable={false}
      disabled={disabled}
      onChange={params => {
        if (params.value.length) {
          setValue(params.value[0].id)          
        }
        else {
          setValue(null)  
        }
      }}
    />
  )
}
VSSelect.defaultProps = {
  items: [],
  loading: false,
}

function Stub({ label, placeholder }) {
  return <VSSelect label={label} placeholder={placeholder} disabled={true} />
}

function Make({ makeId, setMakeId }) {
  const { loading, error, data } = useQuery(GET_MAKES);

  if (error) return <Stub label="Make" placeholder="Error :(" />

  return (
    <VSSelect
      label="Make"
      placeholder="Make"
      loading={loading}
      items={data?.uvdb?.vehicle_selector?.uvdb_makes?.items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByMake({ modelId, setModelId, makeId }) {
  const skip = makeId === null
  const { loading, error, data } = useQuery(GET_MODELS_BY_MAKE, {
    skip,
    variables: {
      make_id: parseInt(makeId, 10),
    },
  });

  if (skip) return <Stub label="Model" placeholder="Model" />
  if (error) return <Stub label="Model" placeholder="Error :(" />

  return (
    <VSSelect
      label="Model"
      placeholder="Model"
      loading={loading}
      items={data?.uvdb?.vehicle_selector?.uvdb_models?.items}
      setValue={setModelId}
      value={modelId}
    />
  )
}

function YearByMakeModel({ yearId, setYearId, makeId, modelId }) {
  const skip = makeId === null || modelId === null
  const { loading, error, data } = useQuery(GET_YEARS_BY_MAKE_MODEL, {
    skip,
    variables: {
      make_id: parseInt(makeId, 10),
      model_id: parseInt(modelId, 10),
    }
  });

  if (skip) return <Stub label="Year" placeholder="Year" />
  if (error) return <Stub label="Year" placeholder="Error :(" />

  return (
    <VSSelect
      label="Year"
      placeholder="Year"
      loading={loading}
      items={data?.uvdb?.vehicle_selector?.uvdb_years?.items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function Year({ yearId, setYearId }) {
  const { loading, error, data } = useQuery(GET_YEARS);

  if (error) return <Stub label="Year" placeholder="Error :(" />

  return (
    <VSSelect
      label="Year"
      placeholder="Year"
      loading={loading}
      items={data?.uvdb?.vehicle_selector?.uvdb_years?.items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function MakeByYear({ makeId, setMakeId, yearId }) {
  const skip = yearId === null
  const { loading, error, data } = useQuery(GET_MAKES_BY_YEAR, {
    skip,
    variables: {
      year_id: parseInt(yearId, 10)
    }
  });

  if (skip) return <Stub label="Make" placeholder="Make" />
  if (error) return <Stub label="Make" placeholder="Error :(" />

  return (
    <VSSelect
      label="Make"
      placeholder="Make"
      loading={loading}
      items={data?.uvdb?.vehicle_selector?.uvdb_makes?.items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByYearMake({ modelId, setModelId, yearId, makeId }) {
  const skip = yearId === null || makeId === null
  const { loading, error, data } = useQuery(GET_MODELS_BY_YEAR_MAKE, {
    skip,
    variables: {
      year_id: parseInt(yearId, 10),
      make_id: parseInt(makeId, 10),
    },
  });

  if (skip) return <Stub label="Model" placeholder="Model" />
  if (error) return <Stub label="Model" placeholder="Error :(" />

  return (
    <VSSelect
      label="Model"
      placeholder="Model"
      loading={loading}
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
        <div className="Vehicle-selector-row">
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
        </div> :
        <div className="Vehicle-selector-row">
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
        </div>}
    </div>
  );
}

export default App;
