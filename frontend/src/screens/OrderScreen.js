import React, {useState, useEffect}  from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { PayPalButton } from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

function OrderScreen() {

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const match = useParams()
    const orderId = match.id

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sdkReady, setSdkReady] = useState(false) // software development kit-ul nu este available pentru paypal pana nu-l incarcam (functia de mai jos addPayPalScript())

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    

    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => { // aceasta functie va fi triggeruite in interiorul useEffect
        const script = document.createElement('script') // se creeaza un element <script> dinamic
        script.type = 'text' 
        script.src = 'https://www.paypal.com/sdk/js?client-id=AbTbVXZUUBfy0EKYP3wbwlk8TR1Ahl_CDZOdqN4l2fK8iGEOZSRvkJcUbHRJ3lmTjJRl0CD1IhMvrmwV'
        script.async = true
        script.onload = () => { //functia va fi folosita abia cand scriptul se incarca complet si devine disponibil pentru utilizare
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
   
    useEffect (() => {

        //if(!userInfo.isAdmin){
        //    navigate(`/login`)
        //}

        if( !order || order._id !== Number(orderId) || successPay || successDeliver){
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            addPayPalScript()
        } else {
            setSdkReady(true)
        }
    }, [dispatch, order, orderId, successPay, successDeliver, userInfo])

    const successPaymentHandler = (paymentResult) => { 
        dispatch(payOrder(orderId, paymentResult)) //payOrder trimit un api call si face update la baza de date
    }

    const successDeliverHandler = () => { 
        dispatch(deliverOrder(order)) 
    }

  return loading ? (
    <Loader/>
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
        <h1> Order: {orderId} </h1>
        <Row>
            <Col md={8}>
                <ListGroup variant = 'flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong> Name: </strong> {order.user.name} </p>
                        <p><strong> Email: </strong> <a href={`mailto:${order.user.email}`}> {order.user.email} </a> </p>
                        <p>
                        <span style={{ fontWeight: 'bold' }}>Shipping: </span> 
                        {order.shippingAddress.address}, {order.shippingAddress.city} 
                        {', '}
                        {order.shippingAddress.postalCode}
                        {', '}
                        {order.shippingAddress.county}
                        {', '}
                        {order.shippingAddress.country}
                        {', '}
                        {order.shippingAddress.phoneNumber}
                        </p>
                        
                        {order.isDelivered ? (
                            <Message variant='success'>Delivered on {order.deliveredAt.substring(0,10)}</Message>
                        ) : (
                            <Message variant='warning'>Not delivered</Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                        <span style={{ fontWeight: 'bold' }}>Method: </span> 
                        {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt.substring(0,10)}</Message>
                        ) : (
                            <Message variant='warning'>Not paid</Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? 
                        <Message variant='info'>
                            Order is empty.
                        </Message> :
                        (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}

                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        
                        {!order.isPaid && (
                        <ListGroup.Item>
                                {loadingPay && <Loader/>}

                                {sdkReady ? (
                                    <Loader/>
                                ) : (
                                    <PayPalButton
                                        amount={order.totalPrice}
                                        onSuccess={successPaymentHandler}    
                                    />
                                )}

                            </ListGroup.Item>
                        )}

                    </ListGroup>
                    {loadingDeliver && <Loader/>}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <div className='text-center'>
                            <ListGroup.Item>
                                <Button
                                        type='button'
                                        className='btn btn-block custom-btn'
                                        onClick={successDeliverHandler}>
                                    Mark as delivered
                                </Button>
                            </ListGroup.Item>
                        </div>
                    )}
                </Card>
            </Col>
        </Row>

    </div>
)
}

export default OrderScreen
