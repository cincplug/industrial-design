import React, { useState } from 'react'

const Controls = ({ controls, handleInputChange, currentSettings }) => {
  const [selectedValues, setSelectedValues] = useState(() => {
    const initialValues = {}
    Object.keys(controls).forEach((category) => {
      Object.keys(controls[category]).forEach((control) => {
        initialValues[control] = Array.isArray(controls[category][control].value)
          ? currentSettings[control]
          : controls[category][control].value
      })
    })
    return initialValues
  })

  const handleSelectChange = (event) => {
    const { id, value } = event.target
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }))
    handleInputChange(event)
  }

  const handleRangeChange = (event) => {
    const { id, value } = event.target
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: Number(value),
    }))
    handleInputChange(event)
  }

  const handleTextChange = (event) => {
    const { id, value } = event.target
    let newValue = value
    if (id === 'chart') {
      newValue = value.replace(/[^0-9,.]/g, '')
      newValue = newValue.replace(/\.+/g, '.')
      newValue = newValue.replace(/,+/g, ',')
    } else {
      newValue = JSON.parse(value) || prevValues[id]
    }
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }))
    handleInputChange(event)
  }

  return (
    <aside className='absolute right-2 top-2 w-60 bg-slate-700 px-2 text-sm text-slate-300'>
      {Object.entries(controls).map(([category]) => (
        <fieldset key={category} className='grid grid-cols-12 gap-2 pb-2'>
          <legend className='py-2'>{category}</legend>
          {Object.entries(controls[category]).map(([control, controlProps], controlIndex) => {
            const { min, max, step } = controlProps
            const displayValue = selectedValues[control]
            const isChart = control === 'chart'
            const isArray = Array.isArray(controls[category][control].value)
            const inputProps = {
              className: 'col-span-6 bg-slate-900 text-slate-300 hover:bg-black',
              id: control,
              value: displayValue,
              onChange: isChart ? handleTextChange : isArray ? handleSelectChange : handleRangeChange,
            }
            return (
              <React.Fragment key={controlIndex}>
                <label className='col-span-4' htmlFor={control}>
                  {control}
                </label>
                {isChart ? (
                  <textarea {...inputProps} />
                ) : isArray ? (
                  <select {...inputProps}>
                    {controls[category][control].value.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input {...inputProps} type='range' min={min} max={max} step={step} />
                    <span className='col-span-2'>{displayValue}</span>
                  </>
                )}
              </React.Fragment>
            )
          })}
        </fieldset>
      ))}
    </aside>
  )
}

export default Controls
