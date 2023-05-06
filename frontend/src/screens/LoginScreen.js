import React, {useState, useEffect}  from 'react'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

function LoginScreen() {

    const [email, setEmail] = ('')
    const [password, setPassword] = ('')

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const redirect = location.state ? Number(location.state) : '/'
    //const redirect = location.search ? location.search.split('=')[1] : '/'
    const userLogin = useSelector((state) => state.userLogin)
    const {error, loading, userInfo } = userLogin

    const submitHandler = (e) => {
        e.preventDefault() //previne comportamentul implicit al evenimentului de submit, care este de a reîncărca pagina.
        dispatch(login(email,password))
    }

    useEffect(() => {
        if(userInfo) {
            navigate(redirect) 
        }
    }, [navigate, userInfo, redirect])

  return (
    <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant = 'danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId = 'email'>
                <Form.Label>
                    Email Address
                </Form.Label>

                <Form.Control type = 'email'
                              placeholder='Enter email'
                              value = {email}
                              onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId = 'password'>
                <Form.Label>
                    Password
                </Form.Label>

                <Form.Control type = 'password'
                              placeholder='Enter password'
                              value = {password}
                              onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Sign in
            </Button>

        </Form>

        <Row className='py-3'>
            <Col>
                Create new account <Link 
                to = {redirect ? `/register?redirect=${redirect}` : '/register'}>
                                    Register
                                   </Link>
            </Col>
        </Row>
      
    </FormContainer>
  )
}

export default LoginScreen
