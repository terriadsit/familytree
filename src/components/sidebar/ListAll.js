import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'

// styles
import './ListAll.css'

export default function ListAll() {
  const order = ['name']
  const { documents, error } = useCollection('people', null, order)
   
  return (
    <div className="people-list">
      {error && <div className='error'>{error}</div>}
      <h4>All People (Birth Names):</h4>
      <ul>
      {documents && documents.map(person => (
        <li key={person.id} className="person-list-item">
          <Link to={'/person/' + person.id}>
              <p>{person.name} 
                {person.birthDate ? `, ${person.birthDate.substring(0, 4)}` : ''} 
              </p>
          </Link>
        </li>
        ))}
      </ul>
    </div>
  )
}
