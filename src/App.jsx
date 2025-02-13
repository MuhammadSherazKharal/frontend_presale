import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Swap from './pages/Swap'
import Presale from './pages/Presale'
import Assets from './pages/Assets'
import Stake from './pages/Stake'
import AppLayout from './components/AppLayout'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Assets />,
        },
        {
          path: "/swap",
          element: <Swap />,
        },
        {
          path: "/presale",
          element: <Presale />,
        },
        {
          path: "/stake",
          element: <Stake />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ]
    }, 
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
