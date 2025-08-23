import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL, CATEGORIES } from '../urls'
import useFetch from '../hopkes/useFetch'

export default function Categories() {

    const [activeCategory, setActiveCategory] = useState(null)


    const { loading, result: categories } = useFetch(`${BACKEND_URL}${CATEGORIES}/`)


    if (loading) return <h2>загрузка...</h2>

    return (
        <div className="tabs">
            <div className="container">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className={`tab ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        <a href={'#' + category.slug} className={activeCategory === category.id ? 'active' : ''}>
                            {category.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}