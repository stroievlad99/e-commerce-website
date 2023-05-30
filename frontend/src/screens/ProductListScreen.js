import React, {useState, useParams, useEffect}  from 'react'
import {  Link, useNavigate } from 'react-router-dom'
import { Table , Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct, createProduct} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
 // const match = useParams()

  const productList = useSelector(state => state.productList)
  const {loading, error, products } = productList

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const productDelete = useSelector(state => state.productDelete)
  const {loading: loadingDelete, error:errorDelete, success: successDeleteProduct} = productDelete

  const productCreate = useSelector(state => state.productCreate)
  const {error: errorCreate, loading: loadingCreate, success: successCreate, product: createdProduct } = productCreate

  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) { //creeaza acel pop up in susul ferestrei pentru a te intreba daca esti sigur sa stergi userul ales
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if(!userInfo.isAdmin){
      navigate(`/login`)
    }

    if(successCreate){
      navigate(`/admin/product/${createdProduct._id}/edit`)
    }else {
      dispatch(listProducts())
    }

  } , [dispatch, navigate, userInfo, successDeleteProduct, createdProduct, successCreate])

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
            <h1>Products</h1>
        </Col>

        <Col className='text-end'>
            <Button className='my-3' onClick={createProductHandler}>
                <i className='fas fa-plus'></i> Create Product
            </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader/>}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant = 'danger'>{errorCreate}</Message>}

      {loading ? <Loader/>
      : error 
      ? <Message variant='danger'>{error}</Message>
      : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                <div className="text-center">
                  <Link to = {`/admin/product/${product._id}/edit`}> 
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'> Edit</i>
                      </Button>
                  </Link>
              
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                    <i className='fas fa-trash'></i>
                  </Button>
                </div>
                    
                </td>
              </tr>
            ))}
          </tbody>

        </Table>

      )}
    </div>
  )
}

export default ProductListScreen
