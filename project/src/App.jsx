import { Container, Row, Col } from 'react-bootstrap'
import './App.css'

// add Link from react-router
import { Link } from 'react-router-dom'

import { useUserAuth } from '../src/context/UserAuthContext';

function App() {
  const { user } = useUserAuth();

  return (
    <>
      <Container className="container-centered">

        <Link to="/login">
          Log in
        </Link> <br />
        <Link to="/register">
          Sign up
        </Link>
      </Container>
    </>
  )
}

export default App
