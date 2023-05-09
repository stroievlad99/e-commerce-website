import axios from 'axios'
import {USER_LOGIN_REQUEST
    ,USER_LOGIN_SUCCESS
    ,USER_LOGIN_FAIL

    ,USER_LOGOUT

    ,USER_REGISTER_REQUEST
    ,USER_REGISTER_SUCCESS
    ,USER_REGISTER_FAIL
} from '../constants/userConstants'

export const login = (email, password) => async(dispatch) => {
    try {
        dispatch({ 
            type: USER_LOGIN_REQUEST 
        })

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }
        //Obiectul "config" este folosit pentru a specifica antetul cererii HTTP, care specifică tipul de conținut trimis în corpul cererii. În acest caz, antetul cererii specifică că se trimite un obiect JSON.

        // {data} este utilizată pentru a extrage răspunsul de la server
        const { data } = await axios.post('/api/users/login/'
        ,{'username': email, 'password': password}
        ,config
        )
        //face o cerere de tip POST către ruta specificată ("/api/users/login/"). În corpul cererii, sunt incluse obiectele "username" și "password", trimise ca obiect JSON.

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

   //     dispatch({
   //         type: USER_LOGOUT,
   //         payload: data
   //     })

    } catch(error){
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                     ? error.response.data.detail
                     : error.message
        })

    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
}



export const register = (first_name, email,  password) => async(dispatch) => {
    try {
        dispatch({ 
            type: USER_REGISTER_REQUEST 
        })

        const config = {
            headers: {
                'Content-type' : 'application/json'
            }
        }

        const { data } = await axios.post('/api/users/register/'
        ,{'name': first_name, 'email': email,  'password': password}
        ,config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch(error){
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                     ? error.response.data.detail
                     : error.message
        })

    }
}

 
