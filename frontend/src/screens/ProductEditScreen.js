import React, {useState, useEffect}  from 'react'
import {  Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET, PRODUCT_UPDATE_SUCCESS } from '../constants/productConstants'


function ProductEditScreen() {

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {id} = useParams()
    const productId = id  

    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate

    
    const submitHandler = (e) => { //trimite product data catre actiune noastra
        e.preventDefault()
        dispatch(updateProduct({_id: productId, name, price, image, brand, countInStock, category, description}))

    }

    useEffect(() => {

        if(successUpdate) { 
            dispatch({ type: PRODUCT_UPDATE_SUCCESS })
            navigate(`/admin/productist`)
            dispatch({ type: PRODUCT_UPDATE_RESET })
        } else {

            if(!product.name || product._id !== Number(productId)){
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCountInStock(product.countInStock)
                setCategory(product.setCategory)
                setDescription(product.setDescription)
            }
        }
        
    }, [product, productId , successUpdate, navigate, dispatch])

  return (
    <div>
        <Link to = {`/admin/productlist`} className='btn btn-light my-3'>
            Go back
        </Link>

        <FormContainer>
            <h1>Edit Product</h1>

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
                                    value = {name}
                                    onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'price'>
                        <Form.Label>
                            Price
                        </Form.Label>

                        <Form.Control 
                                    type = 'number'
                                    placeholder='Enter price'
                                    value = {price}
                                    onChange={(e) => setPrice(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'image'>
                        <Form.Label>
                            Image
                        </Form.Label>

                        <Form.Control 
                                    type = 'text'
                                    placeholder='Enter image'
                                    value = {image}
                                    onChange={(e) => setImage(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'brand'>
                        <Form.Label>
                            Brand
                        </Form.Label>

                        <Form.Control 
                                    type = 'text'
                                    placeholder='Enter brand'
                                    value = {brand}
                                    onChange={(e) => setBrand(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'countInStock'>
                        <Form.Label>
                            Stock
                        </Form.Label>

                        <Form.Control 
                                    type = 'number'
                                    placeholder='Enter stock'
                                    value = {countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'category'>
                        <Form.Label>
                            Category
                        </Form.Label>

                        <Form.Control 
                                    type = 'text'
                                    placeholder='Enter category'
                                    value = {category}
                                    onChange={(e) => setCategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId = 'description'>
                        <Form.Label>
                            Description
                        </Form.Label>

                        <Form.Control 
                                    type = 'text'
                                    placeholder='Enter description'
                                    value = {description}
                                    onChange={(e) => setDescription(e.target.value)}>
                        </Form.Control>
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


export default ProductEditScreen
