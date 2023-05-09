import React, {useState, useEffect}  from 'react'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

function RegisterScreen() {

    const [first_name, setFirst_Name] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    //const redirect = location.state ? Number(location.state) : '/'
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userRegister = useSelector(state => state.userRegister)
    const {error, loading, userInfo } = userRegister

    
    const submitHandler = (e) => {
        e.preventDefault() //previne comportamentul implicit al evenimentului de submit, care este de a reîncărca pagina.
        if (password !== confirmPassword){
            setMessage('Passwords do not match')
        } else {
            dispatch(register(first_name, email, password))
        }
        
    }

    useEffect(() => {
        if(userInfo) {
            navigate(redirect) 
        }
    }, [navigate, userInfo, redirect])

  return (
    <FormContainer>
        <h1>Sign in</h1>
        {message && <Message variant = 'danger'>{message}</Message>}
        {error && <Message variant = 'danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>

            <Form.Group controlId = 'name'>
                <Form.Label>
                    Name
                </Form.Label>

                <Form.Control 
                            required
                            type = 'name'
                            placeholder='Enter name'
                            value = {first_name}
                            onChange={(e) => setFirst_Name(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId = 'email'>
                <Form.Label>
                    Email Address
                </Form.Label>

                <Form.Control 
                            required
                            type = 'email'
                            placeholder='Enter email'
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId = 'password'>
                <Form.Label>
                    Password
                </Form.Label>

                <Form.Control 
                            required
                            type = 'password'
                            placeholder='Enter password'
                            value = {password}
                            onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId = 'confirmPassword'>
                <Form.Label>
                    Confirm Password
                </Form.Label>

                <Form.Control 
                            required
                            type = 'password'
                            placeholder='Confirm password'
                            value = {confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Register
            </Button>

            </Form>
            
            <Row className='py-3'>
                <Col>
                    Have an account already? <Link 
                    to = {redirect ? `/login?redirect=${redirect}` : '/login'}>
                                    Sign in
                                    </Link>
                </Col>
            </Row>

    </FormContainer>
  )
}


export default RegisterScreen
