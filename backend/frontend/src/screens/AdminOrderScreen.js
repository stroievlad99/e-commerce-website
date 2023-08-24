import React, {useState, useParams, useEffect}  from 'react'
import {  Link, useNavigate } from 'react-router-dom'
import { Table , Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listAdminOrders } from '../actions/orderActions'


function AdminOrderScreen() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const adminOrderList = useSelector(state => state.adminOrderList)
  const {loading, error, orders } = adminOrderList

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin


  useEffect(() => {

    if(userInfo && userInfo.isAdmin){
        dispatch(listAdminOrders())
     
    } else {
        navigate(`/login`)  
    }
 
  } , [dispatch, navigate, userInfo])

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
            <h1>Orders</h1>
        </Col>

      </Row>

      {loading ? <Loader/>
      : error 
      ? <Message variant='danger'>{error}</Message>
      : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>CREATED AT</th>
              <th>TOTAL PRICE</th>
              <th>IS PAID</th>
              <th>IS DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                    {order.isPaid ? (
                    order.paidAt.substring(0,10)
                    ) :
                    (
                    <i className = 'fas fa-times' style={{color:"red"}}></i>
                    )}
                </td>
                <td>
                    {order.isDelivered ? (
                    order.deliveredAt.substring(0,10)
                    ) :
                    (
                    <i className = 'fas fa-times' style={{color:"red"}}></i>
                    )}
                </td>
                <td>
                <Link to = {`/order/${order._id}`}>
                    <div className="text-center">
                        <Button variant='dark' className='btn-sm'>
                            Details
                        </Button>
                    </div>
                </Link>
                </td>

              </tr>
            ))}
          </tbody>

        </Table>

      )}
    </div>
  )
}

export default AdminOrderScreen
