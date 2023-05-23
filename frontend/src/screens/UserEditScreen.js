import React, {useState, useEffect}  from 'react'
import {  Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET, USER_UPDATE_SUCCESS} from '../constants/userConstants'

function UserEditScreen() {

    const [first_name, setFirst_Name] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState(false)


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {id} = useParams()
    const userId = id  

    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const {error: errorUpdate , loading: loadingUpdate, success: successUpdate  } = userUpdate

    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id: user._id, first_name, email, isAdmin}))

    }

    useEffect(() => {

        if(successUpdate) {
            dispatch({ type: USER_UPDATE_SUCCESS })
            navigate(`/admin/userlist`)
            dispatch({ type: USER_UPDATE_RESET })
        } else {

            if(!user.name || user._id !== Number(userId)){
                dispatch(getUserDetails(userId))
            } else {
                setFirst_Name(user.name)
                setEmail(user.email)
                setAdmin(user.isAdmin)
            }
        }

        
    }, [user, userId, successUpdate, navigate, dispatch])

  return (
    <div>
        <Link to = {`/admin/userlist`} className='btn btn-light my-3'>
            Go back
        </Link>

        <FormContainer>
            <h1>Edit user</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId = 'name'>
                        <Form.Label>
                            Name
                        </Form.Label>

                        <Form.Control 
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
                                    type = 'email'
                                    placeholder='Enter email'
                                    value = {email}
                                    onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'isAdmin'>

                        <Form.Check 
                                    type = 'checkbox'
                                    label='Is admin?'
                                    checked = {isAdmin}
                                    onChange={(e) => setAdmin(e.target.checked)}>
                        </Form.Check>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>

                </Form>   
            )}
            
                
        </FormContainer>
    </div>
  )
}


export default UserEditScreen
