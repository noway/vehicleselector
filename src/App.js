import './App.css';
import { gql, useQuery } from '@apollo/client';
import { useState, useRef, useEffect } from 'react'
import { find, uniqBy } from 'lodash'
import { Select, TYPE, SIZE } from "baseui/select";
import { Heading, HeadingLevel } from 'baseui/heading';

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

function VSSelect({ controlRef, placeholder, disabled, items, setValue, value, loading }) {
  const selectValue = find(items, { id: value })
  return (
    <Select
      controlRef={controlRef}
      size={SIZE.mini}
      options={items.map(({name, id}) => ({ label: name ?? id, id: id }))}
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

function Stub({ placeholder }) {
  return <VSSelect placeholder={placeholder} disabled={true} />
}

function Make({ controlRef, makeId, setMakeId }) {
  const { loading, error, data } = useQuery(GET_MAKES);
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_makes?.items, 'id')

  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Make"
      loading={loading}
      items={items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByMake({ controlRef, modelId, setModelId, makeId }) {
  const skip = makeId === null
  const { loading, error, data } = useQuery(GET_MODELS_BY_MAKE, {
    skip,
    variables: {
      make_id: parseInt(makeId, 10),
    },
  });
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_models?.items, 'id')
  useEffect(() => {
    if (items.length === 1 && modelId === null) {
      setModelId(items[0].id)
    }
  }, [items, modelId, setModelId])

  if (skip) return <Stub placeholder="Model" />
  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Model"
      loading={loading}
      items={items}
      setValue={setModelId}
      value={modelId}
    />
  )
}

function YearByMakeModel({ controlRef, yearId, setYearId, makeId, modelId }) {
  const skip = makeId === null || modelId === null
  const { loading, error, data } = useQuery(GET_YEARS_BY_MAKE_MODEL, {
    skip,
    variables: {
      make_id: parseInt(makeId, 10),
      model_id: parseInt(modelId, 10),
    }
  });
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_years?.items, 'id')
  useEffect(() => {
    if (items.length === 1 && yearId === null) {
      setYearId(items[0].id)
    }
  }, [items, yearId, setYearId])

  if (skip) return <Stub placeholder="Year" />
  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Year"
      loading={loading}
      items={items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function Year({ controlRef, yearId, setYearId }) {
  const { loading, error, data } = useQuery(GET_YEARS);
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_years?.items, 'id')

  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Year"
      loading={loading}
      items={items}
      setValue={setYearId}
      value={yearId}
    />
  )
}

function MakeByYear({ controlRef, makeId, setMakeId, yearId }) {
  const skip = yearId === null
  const { loading, error, data } = useQuery(GET_MAKES_BY_YEAR, {
    skip,
    variables: {
      year_id: parseInt(yearId, 10)
    }
  });
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_makes?.items, 'id')
  useEffect(() => {
    if (items.length === 1 && makeId === null) {
      setMakeId(items[0].id)
    }
  }, [items, makeId, setMakeId])

  if (skip) return <Stub placeholder="Make" />
  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Make"
      loading={loading}
      items={items}
      setValue={setMakeId}
      value={makeId}
    />
  )
}

function ModelByYearMake({ controlRef, modelId, setModelId, yearId, makeId }) {
  const skip = yearId === null || makeId === null
  const { loading, error, data } = useQuery(GET_MODELS_BY_YEAR_MAKE, {
    skip,
    variables: {
      year_id: parseInt(yearId, 10),
      make_id: parseInt(makeId, 10),
    },
  });
  const items = uniqBy(data?.uvdb?.vehicle_selector?.uvdb_models?.items, 'id')
  useEffect(() => {
    if (items.length === 1 && modelId === null) {
      setModelId(items[0].id)
    }
  }, [items, modelId, setModelId])

  if (skip) return <Stub placeholder="Model" />
  if (error) return <Stub placeholder="Error :(" />

  return (
    <VSSelect
      controlRef={controlRef}
      placeholder="Model"
      loading={loading}
      items={items}
      setValue={setModelId}
      value={modelId}
    />
  )
}

function App() {
  const [mode, setMode] = useState('MMY')
  const modeOptions = [
    { label: "Make/Model/Year", id: "MMY" },
    { label: "Year/Make/Model", id: "YMM" },
  ]
  const selectMode = find(modeOptions, { id: mode })

  const [makeId, setMakeId] = useState(null)
  const [modelId, setModelId] = useState(null)
  const [yearId, setYearId] = useState(null)

  const modelByMakeRef = useRef(null)
  const yearByMakeModelRef = useRef(null)
  const makeByYearRef = useRef(null)
  const modelByYearMakeRef = useRef(null)

  return (
    <div className="App">
      <div className="Vehicle-selector-mode">
        <HeadingLevel>
          <Heading styleLevel={6}>Mode</Heading>
          <Select
            size={SIZE.mini}
            options={modeOptions}
            value={selectMode ? [selectMode] : []}
            clearable={false}
            onChange={params => {
              if (params.value.length) {
                setMode(params.value[0].id)
              }
              else {
                setMode(null)
              }
            }}
          />
        </HeadingLevel>
      </div>
      <div className="Vehicle-selector-body">
        <HeadingLevel>
          <Heading styleLevel={6}>Vehicle</Heading>
          {mode === 'MMY' ?
            <div className="Vehicle-selector-row">
              <Make
                makeId={makeId}
                setMakeId={(val) => {setMakeId(val); setModelId(null); setYearId(null); setImmediate(() => modelByMakeRef.current?.focus())}}
              />
              <ModelByMake
                controlRef={modelByMakeRef}
                modelId={modelId}
                setModelId={(val) => {setModelId(val); setYearId(null); setImmediate(() => yearByMakeModelRef.current?.focus())}}
                makeId={makeId}
              />
              <YearByMakeModel
                controlRef={yearByMakeModelRef}
                yearId={yearId}
                setYearId={(val) => {setYearId(val)}}
                makeId={makeId}
                modelId={modelId}
              />
            </div> :
            <div className="Vehicle-selector-row">
              <Year
                yearId={yearId}
                setYearId={(val) => {setYearId(val); setMakeId(null); setModelId(null); setImmediate(() => makeByYearRef.current?.focus())}}
              />
              <MakeByYear
                controlRef={makeByYearRef}
                makeId={makeId}
                setMakeId={(val) => {setMakeId(val); setModelId(null); setImmediate(() => modelByYearMakeRef.current?.focus())}}
                yearId={yearId}
              />
              <ModelByYearMake
                controlRef={modelByYearMakeRef}
                modelId={modelId}
                setModelId={(val) => {setModelId(val)}}
                yearId={yearId}
                makeId={makeId}
              />
            </div>}
        </HeadingLevel>
      </div>
    </div>
  );
}

export default App;
