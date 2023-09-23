import React from 'react'

const Options = ({ name, updateItemCount }) => {
  return (
    <form>
      <input 
      type="checkbox" 
      id={`${name} option`}
      onChange = {(e) => {
        updateItemCount(name, e.target.checked ? 1 : 0)
        //checked가 true이면 1, 아니면 0
      }}
      />{" "}
      <label htmlFor={`${name} option`}>{name}</label>
    </form>
  )
}

export default Options
