import { useState, useCallback } from 'react'
import styles from './styles.module.scss'

export default function Range({
  label,
  min = 0,
  max,
  width,
  ...rest
}) {
  const [ value, setValue ] = useState(rest.value || min)
  const handleChange = e => {
    const val = parseInt(e.target.value)
    setValue(val)
    rest.onChange && rest.onChange(e)
  }
  const handleBlur = e => {
    const val = parseInt(e.target.value)
    if (val < min) setValue(min)
    else if (val > max) setValue(max)
  }

  return (
    <label
      className={styles.range}
      style={{ width }}
    >
      {!!label && <span className={styles.label}>{label}</span>}
      <div className={styles.rangeInputs}>
        <input
          {...rest}
          min={min}
          max={max}
          type='range'
          value={value}
          className={styles.rangeField}
          onChange={handleChange}
        />
        <span>
          <input
            type='number'
            name={rest.name}
            value={value}
            min={min}
            max={max}
            className={styles.inputField}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </span>
      </div>
    </label>
  )
}