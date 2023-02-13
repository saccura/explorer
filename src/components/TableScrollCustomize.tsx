import React, {useEffect, FC, DetailedHTMLProps} from 'react'
import { useWindowSize } from 'usehooks-ts'

interface IProps {
    mainTableWrapperClass: string,
    scrollWrappertranslateY?: number,
    scrollChildContentWidth?: number,
    scrollChildContentHeight?: number,
    scrollWrapperMargin?: string
}

const TableScrollCustomize:FC<IProps> = ({mainTableWrapperClass, scrollWrappertranslateY, scrollChildContentWidth, scrollChildContentHeight, scrollWrapperMargin, children}) => {
    const { width } = useWindowSize()
    const wrapperStyles = {
        overflowX: width < 768 ? 'auto' as const : 'clip' as const,
        transform: scrollWrappertranslateY ? `translateY(${scrollWrappertranslateY}px)` : "none",
        margin: scrollWrapperMargin
    }

    const childContentStyles = {
        //width: scrollChildContentWidth ? scrollChildContentWidth : "auto",
        height: scrollChildContentHeight ? scrollChildContentHeight : "auto"
    }

    useEffect(() => {
        const scrollWrapper = document.querySelector(".table-scroll__wrapper")
        const tableWrapper = document.querySelector(`.${mainTableWrapperClass}`)
        const table = document.querySelector(`.${mainTableWrapperClass} table`)
        // if(width < 768) {
        //   //@ts-ignore
        //   tableWrapper.style.overflowX = 'auto'
        // } else {
        //   //@ts-ignore
        //   tableWrapper.style.overflowX = 'unset'
        // }
        //@ts-ignore
        table.style.width = scrollChildContentWidth

        if(!scrollWrapper) {
          return
        }
    
        const scrollWrapperListener = () => {
          //@ts-ignore
          tableWrapper.scrollLeft = scrollWrapper.scrollLeft
        }
        const tableWrapperListener = () => {
          //@ts-ignore
          scrollWrapper.scrollLeft = tableWrapper.scrollLeft
        }
        //@ts-ignore
        scrollWrapper?.addEventListener("scroll", scrollWrapperListener)
        tableWrapper?.addEventListener("scroll", tableWrapperListener)

        return () => {
          scrollWrapper?.removeEventListener("scroll", scrollWrapperListener)
          scrollWrapper?.removeEventListener("scroll", tableWrapperListener)
        }
    }, [])
 
    return <>
        <div style={wrapperStyles} className="table-scroll__wrapper">
            <div style={childContentStyles} className="scroll-content"></div>
        </div>
        {children}
    </>
}

export default TableScrollCustomize;