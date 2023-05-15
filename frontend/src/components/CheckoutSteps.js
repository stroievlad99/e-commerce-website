import React from 'react'
import { Nav, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function CheckoutSteps({step1, step2, step3, step4}) {
  return (
    <Row>
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? (
                        <Nav.Link as={Link} to="/login">
                            Login
                        </Nav.Link>
                ) : (
                        <Nav.Link disabled>
                            Login
                        </Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (

                        <Nav.Link as={Link} to="/shipping">
                            Shipping
                        </Nav.Link>
                ) : (
                        <Nav.Link disabled>
                            Shipping
                        </Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                        <Nav.Link as={Link} to="/payment">
                             Payment
                        </Nav.Link>
                ) : (
                        <Nav.Link disabled>
                            Payment
                        </Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step4 ? (

                        <Nav.Link as={Link} to="/plceorder">
                            Place order
                        </Nav.Link>
                ) : (
                        <Nav.Link disabled>
                            Place order
                        </Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    </Row>
  )
}

export default CheckoutSteps
