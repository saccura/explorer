import React, {FC} from 'react'

interface IProps {
    xItems: {x: string, y: number}[]
    yItems?: {x: string, y: number}[],
    className?: string
}
const CustomChartAxises:FC<IProps> = ({xItems, yItems, className}) => {
    console.log("Y items: ", yItems)
    return <>
        <div id="x-axis" className={`x-axis ${className ? className : ''}`}>
            {xItems.map((item) => {
                return <div key={item.x} className="x-item">{item.x}</div>
            })}
            {/* <div className="x-item">2,861</div>
            <div className="x-item">2,862</div>
            <div className="x-item">2,863</div>
            <div className="x-item">2,864</div>
            <div className="x-item">2,865</div>
            <div className="x-item">2,866</div> */}
        </div>
        {yItems?.length && <div id="y-axis" className={`y-axis ${className ? className : ''}`}> 
            {yItems.map((item: any) => {
                return <div key={item.y.toString()} className="y-item">{item.y.toString()}</div>
            })}
        </div>}
    </>
}

export default CustomChartAxises
