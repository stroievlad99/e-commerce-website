import React, {useState, useEffect}  from 'react'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import {  USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function ProfileScreen() {

    const [first_name, setFirst_Name] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    
    const submitHandler = (e) => {
        e.preventDefault() 
        if (password !== confirmPassword){
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserProfile({
                'id':user._id,
                'name':first_name,
                'email':email,
                'password':password
            }))
            setMessage('')
        }
        
    }

    useEffect(() => {
        if(!userInfo) {
            navigate(`/login`) 
        } else {
            if(!user || !user.name || success){
                dispatch({ type:USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
            } else {
                setFirst_Name(user.name)
                setEmail(user.email)
            }

        }

    }, [dispatch, navigate, userInfo, user, success])

  return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
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
                            
                            type = 'password'
                            placeholder='Confirm password'
                            value = {confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Update
            </Button>

            </Form>
            </Col>

            <Col md={9}>
                <h2>My orders</h2>
            </Col>
        </Row>
  )
}

export default ProfileScreen
