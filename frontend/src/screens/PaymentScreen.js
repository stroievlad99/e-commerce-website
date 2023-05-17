import React, {useState, useEffect}  from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress  } from '../actions/cartActions'
import { savePaymentMethod } from '../actions/cartActions'

function PaymentScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if (!shippingAddress.address){
        console.log('Shipping form is not completed!')
        navigate(`/shipping`)
    }

    const submitHandler = (e) => { //event as a parameter
        e.preventDefault() 
        dispatch(savePaymentMethod(paymentMethod))
        console.log('Continue to the place order!')
        navigate(`/placeorder`) 

    }

  return (
    
    <FormContainer>
    <CheckoutSteps step1 step2 step3/>
        <h1>Payment</h1>
        <Form onSubmit = {submitHandler}>
            <Form.Group controlId = 'paymentMethod'>
                    <Form.Label>Payment Method</Form.Label>
                    <Col>
                        <Form.Check 
                            type='radio'
                            label='PayPal or Credit Card'
                            id='paypal'
                            name='paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                        </Form.Check>
                    </Col> 
                </Form.Group>

                <Button type = 'submit' variant ='primary'>
                        Continue
                    </Button>

        </Form>
    </FormContainer>
)
}

export default PaymentScreen
