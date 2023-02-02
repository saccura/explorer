import React, {FC} from 'react'

interface IProps {
    xItems: {x: string, y: number}[]
    yItems: any[],
    className?: string
}
const CustomChartAxises:FC<IProps> = ({xItems, yItems, className}) => {
    return <>
        <div className={`x-axis ${className ? className : ''}`}>
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
        <div className={`y-axis ${className ? className : ''}`}> 
            {yItems.map((item: any) => {
                return <div key={item} className="y-item">{item}</div>
            })}
            
            {/* <div className="y-item">20</div>
            <div className="y-item">40</div>
            <div className="y-item">60</div>
            <div className="y-item">80</div> */}
        </div>
    </>
}

export default CustomChartAxises
