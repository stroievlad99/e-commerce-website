import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

function HomeScreen() {

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const productList = useSelector(state => state.productList)
  const { loading, products, error, page, pages} = productList

  let term = location.search //valoarea lui term va fi ?cheie=valoare

  useEffect(() => {
      dispatch(listProducts(term))

  }, [dispatch, term])


  return (
    
    <div>
      {!term && <ProductCarousel/> }
      <h1>Latest Products</h1>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
          :
          <div>
            <Row>
            {
                products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product}/>
                    </Col>
                ))
            }
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Paginate page={page} pages={pages} term={term}/>
          </div>
        </div>
      }

    </div>
  )
}

export default HomeScreen
