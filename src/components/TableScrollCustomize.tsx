import React, {useEffect, FC, DetailedHTMLProps} from 'react'

interface IProps {
    mainTableWrapperClass: string,
    scrollWrappertranslateY?: number,
    scrollChildContentWidth?: number,
    scrollChildContentHeight?: number,
    scrollWrapperMargin?: string
}

const TableScrollCustomize:FC<IProps> = ({mainTableWrapperClass, scrollWrappertranslateY, scrollChildContentWidth, scrollChildContentHeight, scrollWrapperMargin, children}) => {

    const wrapperStyles = {
        overflowX: 'auto' as const,
        transform: scrollWrappertranslateY ? `translateY(${scrollWrappertranslateY}px)` : "none",
        margin: scrollWrapperMargin
    }

    const childContentStyles = {
        width: scrollChildContentWidth ? scrollChildContentWidth : "auto",
        height: scrollChildContentHeight ? scrollChildContentHeight : "auto"
    }

    useEffect(() => {
        const scrollWrapper = document.querySelector(".table-scroll__wrapper")
        const tableWrapper = document.querySelector(`.${mainTableWrapperClass}`)
        const table = document.querySelector(`.${mainTableWrapperClass} table`)
        //@ts-ignore
        tableWrapper.style.overflowX = 'auto'
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