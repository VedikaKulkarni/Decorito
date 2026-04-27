import React from 'react'
import Navbar from '../components/Navbar'
import Carousel from './Carousel'
import CategorySection from './CategorySection'
import FeatureSection from './FeatureSection'
import Footer from '../components/Footer'

export default function Landingpage() {
  return (
    <div>
      <Navbar/>
      <Carousel/>
      <CategorySection/>
      <FeatureSection/>
      <Footer/>
    </div>
  )
}
