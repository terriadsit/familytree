import Select from 'react-select'

export default function ChooseRelatives({...props}) {
    const relationship = props.relationship
    const people = props.people
      
  return (
    <div>
      <label>
        <span>choose {relationship} to add:</span>
          <Select className="relative"
            isMulti
            onChange={(option, action) => {props.handleRelativeOption(option, action)}}
            options={people}
          />
      </label>
    </div>
  )
}
