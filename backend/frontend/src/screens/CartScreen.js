import React, { useEffect } from "react"
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom"
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem} from "react-bootstrap"
import Message from "../components/Message"
import { addToCart, removeFromCart } from "../actions/cartActions"
import { useDispatch, useSelector } from "react-redux"
import { CART_CLEAR_ITEMS } from '../constants/cartConstants'
import { USER_LOGOUT } from '../constants/userConstants'



function CartScreen() {

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const qty = Number(searchParams.get("qty"));

  useEffect(() => {

    if (id) {
        dispatch(addToCart(id, qty));        
    }

  }, [dispatch, id, qty]);


  const removeFromCartHandler = (id) =>{
     dispatch(removeFromCart(id))

  }

  const checkoutHandler = () =>{
        navigate(`/login?redirect=/shipping/`)   
  }

  return (
      <Row>
          <Col md = {8}>
            <h1>Shopping Cart</h1>
            {
                cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to = '/'>Go Back.</Link>
                    </Message>
                ) :
                (
                    <ListGroup variant = 'flush'>
                        {cartItems.map(item => (
                            <ListGroupItem key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.image} fluid rounded />
                                    </Col>

                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>

                                    <Col md={2}>
                                        ${item.price}
                                    </Col>

                                    <Col md={3}>
                                    <Form.Control 
                                            as="select" //poti selecta un numar din toata lista de numere
                                            value={item.qty}
                                            onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                        >

                                            {
                                                //fix partea asta creeaza un array [0,1,2] de ex (adica 3 iteme in stock)
                                                  [...Array(item.countInStock).keys()].map((currentItem) => ( //creează un array cu lungimea item.countInStock și apoi obține cheile acestui array utilizând funcția keys(). Aceasta va genera un array de numere consecutive de la 0 până la item.countInStock - 1.
                                                    //avem nevoie de key={CurrentItem + 1} deoarece mapam printr-un item
                                                    <option key={currentItem+1} value={currentItem+1}> 
                                                          {currentItem + 1}
                                                    </option>//Astfel, acest cod generează o listă de opțiuni numerotate de la 1 până la item.countInStock, pe care le puteți utiliza pentru a permite utilizatorului să aleagă o valoare dintr-un meniu dropdown în cadrul unui formular.

                                                  ))
                                            }

                                        </Form.Control>
                                    </Col>

                                    <Col md = {1}>
                                        <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className='fas fa-trash'></i>

                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroupItem>


                        ))}

                    </ListGroup>
                )
            }
          </Col>

          <Col md={4}>
            <Card>
                <ListGroup variant = 'flush'>
                    <ListGroup.Item>
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                        <h3>Price: ({cartItems.reduce((acc,item) => acc + item.qty * item.price, 0).toFixed(2)})</h3>
                    </ListGroup.Item>
                </ListGroup>

                <ListGroup.Item>
                    <Button
                        type='button'
                        className='btn btn-dark col-12'
                        disabled = {cartItems.length === 0}
                        onClick={checkoutHandler}
                    >
                        Proceed To Checkout

                    </Button>
                </ListGroup.Item>
            </Card>
          </Col>
      </Row>
  );
}

export default CartScreen;