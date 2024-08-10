
import { useEffect, useMemo, useState } from "react"
import { db } from "../data/db"
import { Guitar, GuitarItem } from "../types"

export const useCart = () => {

    const initialState = () : GuitarItem[] => {

        const localStorageCart = localStorage.getItem('cart')

        return localStorageCart ? JSON.parse(localStorageCart) : []
        
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialState)

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

    useEffect(() => {

    localStorage.setItem('cart', JSON.stringify(cart)) 

    }, [cart])

    const addToCart = (item : Guitar)=> {

    const itemExists = cart.findIndex(guitar => guitar.id === item.id)

    if(itemExists >= 0){

        if(cart[itemExists].quantity >= MAX_ITEMS) return

        const updatedCart = [...cart]

        updatedCart[itemExists].quantity++

        setCart(updatedCart)

        console.log(cart)

    }else{
        
        const newItem = {...item, quantity : 1}

        setCart([...cart, newItem])

    }

    }

    const removeFromCart = (id) => {

    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id ))

    }

    const increaseQuantity = (id) => {

    const updateCart = cart.map( item => {

        if(item.id === id){

            return{
                ...item,
                quantity: item.quantity + 1
            }

        }

        return item

    })

    setCart(updateCart)

    }

    const decraseQuantity = (id) => {

    const updateCart = cart.map(item => {

        if(item.id === id && item.quantity > MIN_ITEMS){

            return{

                ...item,

                quantity: item.quantity - 1
            }

        }

        return item

    })

    setCart(updateCart)

    }

    const cleanCart = () => {

    setCart([])

    }

     //State derivado
     const isEmpty = useMemo(() => cart.length === 0, [cart])

     const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0))

    return{
        data,
        cart,
        addToCart,
        cleanCart,
        decraseQuantity,
        increaseQuantity,
        removeFromCart,
        isEmpty,
        cartTotal
    }
}