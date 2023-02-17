import React, {useEffect, FC, DetailedHTMLProps} from 'react'
import { useWindowSize } from 'usehooks-ts'


const CustomChartContainer:FC<any> = ({children, width, height, viewBox}) => {
    return <div className='VictoryContainer' style={{
        height: "100%",
        width: "100%",
        userSelect: "none",
        pointerEvents: "none",
        touchAction: "none",
        position: "relative"
    }}>
        <svg width={width} height={height} role="img" viewBox={viewBox} style={{
            pointerEvents: "all",
            width: "100%",
            height: "auto" 
        }}>
            {children}
        </svg>
        <div style={{
            zIndex: 99,
            position: "absolute",
            top: 0,
            left: 0,
            width: 100,
            height: "auto"
        }}>
            <svg width={width} height={height} viewBox={viewBox} style={{
                overflow: "visible",
                width: "100%",
                height: "auto"
            }}></svg>
        </div>
        </div>
}

export default CustomChartContainer;