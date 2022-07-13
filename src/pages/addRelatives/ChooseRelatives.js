import Select from 'react-select'

// styles
import './AddRelatives.css'

export default function ChooseRelatives({...props}) {
    const relationship = props.relationship
    const people = props.people
    const testId = `${relationship}dropdown`
      
  return (
    <div className='relative-container'>
      <label>
        <p className='heading' cy-test-id={testId}>choose {relationship} to add:</p>
          <Select className="relative"
            isMulti
            onChange={(option, action) => {props.handleRelativeOption(option, action)}}
            options={people}
          />
      </label>
    </div>
  )
}
