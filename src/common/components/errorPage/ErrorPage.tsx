import React from 'react'
import img from 'common/components/errorPage/404.png'
import S from 'common/components/errorPage/ErrorPage.module.css'

export const ErrorPage = () => {
    return (
        <div className={S.wrapper}>
            <h3 className={S.header}>404: PAGE IN PROGRESS</h3>
            <img src={img} alt="404 img should be here"/>
        </div>
    )
}

