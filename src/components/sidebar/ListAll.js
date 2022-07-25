// List all the people in the DB in the sidebar as links
import { useCollection } from '../../hooks/useCollection'
import { memo } from 'react';

// styles
import './ListAll.css'

export default function ListAll() {
  const order = ['name']
  const { documents, error } = useCollection('people', null, order)
   
  return (
    <div className="people-list">
      {error && <div className='error'>{error}</div>}
      <h4>All People (Birth Names):</h4>
      <ul cy-test-id="people-list">
      {documents && documents.map(person => (
        <li key={person.id} >
          <a className="person-list-item" href={'/person/' + person.id}>
              <p className='person-in-list'>{person.name} 
                {person.birthDate ? `, ${person.birthDate.substring(0, 4)}` : ''} 
              </p>
          </a>
        </li>
        ))}
      </ul>
    </div>
  )
}

export const MemoizedListAll = memo(ListAll)
