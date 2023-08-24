import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createReviewProduct } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
 
function ProductScreen() {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const match = useParams()
    const productId = match.id
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, product, error} = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading: loadingReviewCreate, success: successReviewCreate, error: errorReviewCreate} = productReviewCreate

    const navigate = useNavigate()

    const addToCartHandler = () => {
        navigate(`/cart/${productId}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createReviewProduct(
            productId,
            {
                rating,
                comment
            }
            ))
    }

    useEffect(() => {

        if(successReviewCreate){
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        }

        dispatch(listProductDetails(productId))


    
    }, [dispatch, match, successReviewCreate])

    return (
    <div>
        <Link to='/' className='btn btn-light my-3'>Go Back</Link>  
        {loading ?
            <Loader />
            : error
                ? <Message variant='danger'>{error}</Message>
            :(
                <div>
                    <Row style={{ paddingBottom: '20px' }}>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid /> {/*fluid este ca sa mearga pe toate device-urile */}    
                        </Col>
                    
                        <Col md={3}>
                            <ListGroup variant="flush">
                                    <ListGroup.Item style={{ overflowWrap: 'anywhere' }}>
                                        <h3 style={{ margin: 0 }}>{product.name}</h3>
                                    </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                Quantity:
                                                </Col>
                                                <Col xs='auto' className='my-1'>
                                                    <Form.Control 
                                                        as="select" //poti selecta un numar din toata lista de numere
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >

                                                        {
                                                            [...Array(product.countInStock).keys()].map((currentItem) => (
                                                                <option key={currentItem+1} value={currentItem+1}> 
                                                                    {currentItem + 1}
                                                                </option>

                                                            ))
                                                        }

                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                    
                                    }

                                    <ListGroup.Item>
                                        <div class="text-center">
                                        <Button 
                                            onClick={addToCartHandler}
                                            className = 'btn-block' 
                                            disabled={product.countInStock <= 0} 
                                            type = 'button' >Add to Cart
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                                    
                            </Card>
                        </Col>
                    </Row> 

                    <Row>
                        <Col md={6}>
                            <h4>Reviews</h4>
                            {product.reviews.length === 0 && <Message variant='info'>No reviews</Message>}

                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color='#f8e825'/>
                                        <p>{review.createdAt.substring(0,10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                    <ListGroup.Item>
                                        <h4>Write a review</h4>

                                        {loadingReviewCreate && <Loader/>}
                                        {successReviewCreate && <Message variant='success'>Review submitted</Message>}
                                        {errorReviewCreate && <Message variant='danger'>{errorReviewCreate}</Message>}

                                        {userInfo ? (
                                            <Form onSubmit={submitHandler}> 
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control
                                                        as = 'select'
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}>
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Bad</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - OK</option>
                                                            <option value='4'>4 - Very good</option>
                                                            <option value='5'>5 - WOW!</option>
                                                    </Form.Control>
                                                </Form.Group>

                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Review</Form.Label>
                                                    <Form.Control
                                                        as = 'textarea'
                                                        row='5'
                                                        value = {comment}
                                                        onChange={(e) => setComment(e.target.value)}>

                                                    </Form.Control>
                                                </Form.Group>   

                                                <Button
                                                    disabled={loadingReviewCreate}
                                                    type='submit'
                                                    className='btn-block custom-btn-submit'
                                                    onClick={submitHandler}>
                                                    Submit
                                                </Button> 
                                            </Form>
                                        ) : (
                                            <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                        )}

                                    </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>   
            )
        
        }
        
    </div>
    )
}
 
export default ProductScreen