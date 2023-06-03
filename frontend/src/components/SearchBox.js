import React, {useState, useEffect}  from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'

function SearchBox() {

    const [term, setTerm] = useState('')

    let navigate = useNavigate()
    let location = useLocation()

    const submitHandler = (e) => {
        e.preventDefault()
        if(term) {
            navigate(`/?term=${term}&page=1`)
        } else {
            navigate(location.pathname)
        }
    }

  return (
        <Form onSubmit={submitHandler} className='d-flex' style={{ marginRight:'20px' }}>
            <Form.Control type='text'
                          placeholder='Search...'
                          onChange={(e) => setTerm(e.target.value)}
                          className='mr-sm-2 ml-sm-5'>

            </Form.Control>

            <Button type='submit' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    className='p-3'>
                <i class="fa fa-search"></i>
            </Button>


        </Form>

  )
}

export default SearchBox
