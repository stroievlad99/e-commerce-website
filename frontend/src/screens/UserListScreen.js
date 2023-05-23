import React, {useState, useEffect}  from 'react'
import {  Link, useParams, useNavigate } from 'react-router-dom'
import { Table , Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listUsers, deleteUser } from '../actions/userActions'

function UserListScreen() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userList = useSelector(state => state.userList)
  const {loading, error, users} = userList

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const userDelete = useSelector(state => state.userDelete)
  const {success: successDeleteUser} = userDelete

  

  useEffect(() => {
    if(userInfo && userInfo.isAdmin){
      dispatch(listUsers())
    } else {
      navigate(`/login`)
    }
    
  } , [dispatch, navigate, successDeleteUser])

  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to delete this user?')) { //creeaza acel pop up in susul ferestrei pentru a te intreba daca esti sigur sa stergi userul ales
      dispatch(deleteUser(id))
    }
  }

  return (
    <div>
      <h1>USERS</h1>
      {loading ? <Loader/>
      : error 
      ? <Message variant='danger'>{error}</Message>
      : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? (
                  <i className='fas fa-check' style={{color:'green'}}></i>
                ) :
                (
                  <i className = 'fas fa-times' style={{color:"red"}}></i>
                )}</td>
                <td>
                  <Link to = {`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'> Edit</i>
                    </Button>
                    </Link>

                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>

        </Table>

      )}
    </div>
  )
}

export default UserListScreen
