import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Products from './Products.js'
import Options from './Options.js'
import ErrorBanner from './ErrorBanner.js'
import { OrderContext } from '../context/OrderContext' 
//default로 export를 한 게 아니기 때문에 '{}' 붙여줌.

const Type = ({ orderType }) => {

  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderData, updateItemCount] = useContext(OrderContext);
  console.log('orderData', orderData.totals);

  useEffect(() => {
    loaditems(orderType);
  }, [orderType])

  const loaditems = async(orderType) => {
    try{
    const response = await axios.get(`http://localhost:4000/${orderType}`)
    setItems(response.data);
    } catch (error) {
      setError(true);
    }
  }

  const ItemComponent = orderType === "products" ? Products : Options;

  const optionItems = items.map(item => (
    <ItemComponent
    key={item.name}
    name={item.name}
    imagePath={item.imagePath}
    updateItemCount={(itemName, newItemCount) => {
      updateItemCount(itemName, newItemCount, orderType)
    }}
    />
  ))

  if(error) {
    return (
      <ErrorBanner message = "에러가 발생했습니다." />
    )
  }
  
  return (
    <div>
      <h2>주문 종류</h2>
      <p>하나의 가격</p>
      <p>총 가격: {orderData.totals[orderType]}</p>
      <div
      style={{ display: 'flex', flexDirection: orderType === "options" ? "column" : "row" }}
      >
        {optionItems}
      </div>
    </div>
  )
}

export default Type
