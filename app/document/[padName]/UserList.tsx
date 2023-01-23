'use client'
//import { findContrastedTextColor } from '../../../components/utils/colors'

/* To test the UI
const fakeUsers = [
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
  { id: 3448026119, name: 'nèfle biene', color: '#1adb86' },
]
*/
export const UserList = ({ users, username }) => (
  <ul
    css={`
      margin: 0.2rem;
      padding: 0;
      display: flex;
      -moz-box-align: baseline;
      align-items: baseline;
      -moz-box-pack: end;
      justify-content: flex-end;
      margin-bottom: 0.4rem;
      flex-wrap: wrap;
      list-style-type: none;
      flex-wrap: nowrap;
      overflow-x: auto;
      white-space: nowrap;
      justify-content: normal;
      height: 1.6rem;
    `}
  >
    {users.map(
      (u) =>
        console.log(u.name) || (
          <li key={u.name}>
            <div
              css={`
                display: flex;
                align-items: center;
                margin-right: 0.6rem;
              `}
            >
              <div
                css={`
                  background: ${u.color};
                  width: 1rem;
                  height: 1rem;
                  border-radius: 0.2rem;
                  margin-right: 0.3rem;
                `}
              />
              <div className="avatar__intro">
                <div className="avatar__name">
                  {u.name}
                  {u.name === username && ' (toi)'}
                </div>
              </div>
            </div>
          </li>
        )
    )}
  </ul>
)

export const UserBlock = ({ extremes, users, username, room, connected }) => {
  const uniqueUsers = getUniqueUsers(users)
  return (
    <div>
      <div
        css={`
          margin: 0.6rem 0 !important;
        `}
      >
        <span
          css={`
            border: 3px solid ${connected ? '#78b159' : 'red'};
            border-radius: 0.2rem;
            padding: 0rem 0.2rem;
            margin-right: 0.6rem;
          `}
        >
          Connection {connected ? '🟢' : '🔴'}
        </span>
        <span role="status">
          👥 {uniqueUsers.length} participant{plural(uniqueUsers)}
        </span>
      </div>
      <UserList users={uniqueUsers} username={username} />
    </div>
  )
}
const plural = (list) => (list.length > 1 ? 's' : '')

const getUniqueUsers = (array) =>
  array.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (elt) => elt.name === value.name && elt.color === value.color
      )
  )
