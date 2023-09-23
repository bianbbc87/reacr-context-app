import {createContext, useState, useMemo, useEffect} from 'react';

export const OrderContext = createContext(); 

/* React Context API를 이용하여 새로운 context 객체 생성 */

// Context Provider 컴포넌트 정의
// 이 컴포넌트는 주어진 'children' 컴포넌트에게 state를 전달함.
export function OrderContextProvider({children}) { //디스트럭처링 -js

    //orderCounts는 각 주문 타입(products, options)에 따른 아이템 개수를 저장하는 객체
    const [orderCounts, setOrderCounts] = useState({
        products: new Map(),
        options: new Map()
    })

    const [totals, setTotals] = useState({
        products: 0,
        options: 0,
        total: 0
    })

    const pricePerItem = {
        products: 1000,
        options: 500
    }

    const calculateSubtotal = (orderType, orderCounts) => {
        let optionCount = 0;
        for (const count of orderCounts[orderType].values()) { //values는 Map()안의 {name} 다음 숫자 값
            optionCount += count;
        }

        return optionCount * pricePerItem[orderType];
    }

    useEffect(() => {

        const productsTotal = calculateSubtotal("products", orderCounts);
        const optionsTotal = calculateSubtotal("options", orderCounts);
        const total = productsTotal + optionsTotal;
        setTotals({
            products: productsTotal,
            options: optionsTotal,
            total
        })
    }, [orderCounts])
    

    // useMemo Hook을 사용하여 orderCounts가 변경될 때만 'value'를 재계산한다.
    const value = useMemo(() => {
        // 주문 개수를 업데이트 하는 함수
        function updateItemCount(itemName, newItemCount, orderType) {
            // 기존의 orderCounts 객체를 복사함.
            const newOrderCounts = {...orderCounts};

            // 주문 타입(orderType)에 따른 Map 객체를 가져옴.
            const orderCountsMap = orderCounts[orderType];

            // 새로운 아이템 개수를 설정함.
            orderCountsMap.set(itemName, parseInt(newItemCount));

            setOrderCounts(newOrderCounts);
            
        }

        // 현재의 orderCounts 상태와 updateItemCount 함수를 배열로 묶어서 반환함.
        return [{ ...orderCounts, totals }, updateItemCount]
    }, [orderCounts, totals])

    // OrderContext.Provider를 반환하며, 그 value에 위에서 계산한 값을 넣어줌.
    return <OrderContext.Provider value={value} >
        {children}
    </OrderContext.Provider>;
    /* == <OrderContext.Provider value=() {...props} */
}