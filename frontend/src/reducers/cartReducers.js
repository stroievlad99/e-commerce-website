import {CART_ADD_ITEM
    ,CART_REMOVE_ITEM
    
} from '../constants/cartConstants'

export const cartReducer = (state = {cartItems:[]}, action) => {
    switch(action.type){
        case CART_ADD_ITEM:
            // payload va fi produsul
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return{
                    ...state,
                    cartItems:state.cartItems.map(x => x.product === existItem.product ? item : x) // vrem sa mapping prin state.array, vrem sa gasim daca exista deja un item      
                }
            } else {
                return{
                    ...state,
                    cartItems:[...state.cartItems, item]
                }
            }
        
        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems:state.cartItems.filter(x => x.product !== action.payload) // vrem sa verificam daca x.product (product_id) nu e egal cu action.payload (id of the product pe care-l stergem) si ne da inapoi un now array, deci practic ne da un array cu item-ul sters si putem face update la carItems.
                
            }

        default:
            return state

    }

} 