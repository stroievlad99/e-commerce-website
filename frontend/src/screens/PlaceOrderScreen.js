import React, {useState, useEffect}  from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
//import { savePaymentMethod } from '../actions/cartActions'


function PlaceOrderScreen() {

    const cart = useSelector(state => state.cart)
   // const { paymentMethod } = cart

   const placeOrder = () => {
    console.log('Place order')
   }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //const [placeOrderMethod, setPlaceOrderMethod] = useState('PayPal')

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice >= 150 ? 0 : 20).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2)


    const submitHandler = (e) => { //event as a parameter
        e.preventDefault() 
        //dispatch(savePaymentMethod(paymentMethod))
        console.log('Success!')
        //navigate(`/placeorder`) 

    }

  return (
    
    <div>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant = 'flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                        <span style={{ fontWeight: 'bold' }}>Shipping: </span> 
                        {cart.shippingAddress.address}, {cart.shippingAddress.city} 
                        {', '}
                        {cart.shippingAddress.postalCode}
                        {', '}
                        {cart.shippingAddress.county}
                        {', '}
                        {cart.shippingAddress.country}
                        {', '}
                        {cart.shippingAddress.phoneNumber}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                        <span style={{ fontWeight: 'bold' }}>Method: </span> 
                        {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? 
                        <Message variant='info'>
                            Your cart is empty.
                        </Message> :
                        (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item, index) => (
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type = 'button'
                                className='btn-block'
                                disbled={cart.cartItems === 0}
                                onClick={placeOrder}>
                                Place order
                            </Button>    
                        </ListGroup.Item>
 
                    </ListGroup>
                </Card>

            </Col>
        </Row>
    </div>
)
}

export default PlaceOrderScreen
