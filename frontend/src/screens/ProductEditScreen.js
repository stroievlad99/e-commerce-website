import React, {useState, useEffect}  from 'react'
import  axios from 'axios'
import {  Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET, PRODUCT_UPDATE_SUCCESS } from '../constants/productConstants'


function ProductEditScreen() {

    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate

    const {id} = useParams()
    const productId = id 

    const [selectedFile, setSelectedFile] = useState(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const submitHandler = (e) => { //trimite product data catre actiune noastra
        e.preventDefault()
        dispatch(updateProduct({_id: productId, name, price, image, brand, countInStock, category, description}))

    }

    const uploadImageHandler = async (e) => { //folosim async pt ca ca avem un POST request, deci folosim axios
        console.log('File is uploading') //Dacă aveți nevoie să efectuați operații asincrone în interiorul funcției, cum ar fi trimiterea fișierului la un server și așteptarea unui răspuns, folosirea async vă permite să utilizați cu ușurință await pentru a aștepta finalizarea operațiilor asincrone.
        const file = e.target.files[0] // extragerea primului fișier din evenimentul e și crearea unui obiect FormData.
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', productId)

        setUploading(true)

        try{
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data' //Obiectul FormData este utilizat pentru a construi o reprezentare a datelor formularului în formatul multipart/form-data, care este utilizat adesea pentru încărcarea de fișiere.
                }
            }

            const {data} = await axios.post('/api/products/upload/',
            formData,
            config)

            setImage(data)
            setUploading(false)

        }catch(error) {
            setUploading(false)
        }
    }

    useEffect(() => {

        if(successUpdate) { 
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate(`/admin/productlist`)
           
        } else {

            if(!product.name || product._id !== Number(productId)){
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCountInStock(product.countInStock)
                setCategory(product.category)
                setDescription(product.description)
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

                        <Form.Control  className='mb-3 btn btn-primary'
                                type = 'file'
                                label='Choose image'
                                custom 
                                onChange={uploadImageHandler}

                        >
                            
                        </Form.Control>

                        {uploading && <Loader/>}
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
