import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchProvider }       from './context/SearchContext'
import { BookingProvider }      from './context/BookingContext'
import { SettingsProvider }     from './context/SettingsContext'
import { AchievementsProvider } from './context/AchievementsContext'
import { PerformanceProvider }  from './context/PerformanceContext'
import Layout               from './components/layout/Layout'
import Home                 from './pages/Home'
import SearchResults        from './pages/SearchResults'
import SeatSelection        from './pages/SeatSelection'
import PassengerDetails     from './pages/PassengerDetails'
import Payment              from './pages/Payment'
import BookingConfirmation  from './pages/BookingConfirmation'
import MyBookings           from './pages/MyBookings'
import Settings             from './pages/Settings'
import PerformanceDashboard from './pages/PerformanceDashboard'
import Achievements         from './pages/Achievements'
import NotFound             from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <PerformanceProvider>
          <SearchProvider>
            <BookingProvider>
              <AchievementsProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index                                element={<Home />}                />
                    <Route path="results"                       element={<SearchResults />}       />
                    <Route path="seats/:busId"                  element={<SeatSelection />}       />
                    <Route path="passengers"                    element={<PassengerDetails />}    />
                    <Route path="payment"                       element={<Payment />}             />
                    <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                    <Route path="my-bookings"                   element={<MyBookings />}          />
                    <Route path="settings"                      element={<Settings />}            />
                    <Route path="performance"                   element={<PerformanceDashboard />}/>
                    <Route path="achievements"                  element={<Achievements />}        />
                    <Route path="*"                             element={<NotFound />}            />
                  </Route>
                </Routes>
              </AchievementsProvider>
            </BookingProvider>
          </SearchProvider>
        </PerformanceProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
