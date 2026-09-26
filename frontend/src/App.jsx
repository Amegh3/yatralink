import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BusDetailsPage from './pages/BusDetailsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import PassengerDetailsPage from './pages/PassengerDetailsPage'
import PaymentPage from './pages/PaymentPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ProfilePage from './pages/ProfilePage'
import WalletPage from './pages/WalletPage'
import CouponsPage from './pages/CouponsPage'
import OffersPage from './pages/OffersPage'
import ReviewsPage from './pages/ReviewsPage'
import SupportPage from './pages/SupportPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
// CTF page removed
import AdminDashboard from './pages/AdminDashboard'
import OperatorDashboard from './pages/OperatorDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bus/:id" element={<BusDetailsPage />} />
            <Route path="/booking/seats/:scheduleId" element={<SeatSelectionPage />} />
            <Route path="/booking/passengers" element={<PassengerDetailsPage />} />
            <Route path="/booking/payment" element={<PaymentPage />} />
            <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/operator" element={<OperatorDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </AuthProvider>
  )
}

export default App
