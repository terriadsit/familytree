import Select from 'react-select'

// styles
import './AddRelatives.css'

export default function ChooseRelatives({...props}) {
    const relationship = props.relationship
    const people = props.people
      
  return (
    <div className='relative-container'>
      <label>
        <p className='heading'>choose {relationship} to add:</p>
          <Select className="relative"
            isMulti
            onChange={(option, action) => {props.handleRelativeOption(option, action)}}
            options={people}
          />
      </label>
    </div>
  )
}
