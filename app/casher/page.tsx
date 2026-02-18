'use client'

import NavBar from '@/components/NavBar'
import { useState, useEffect, useMemo } from 'react'
import { Medicine } from '@/types'
import { getAllmedicines } from '@/service/medicineService'
import { createSale } from '@/service/saleService'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

type CartItem = Medicine & { quantity: number }

export default function PharmacyPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    if ( user?.role !== 'CASHIER') {
      router.replace('/') 
    }
  }, [user, router])

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await getAllmedicines()
        setMedicines(data)
      } catch (error) {
        console.error('Failed to fetch medicines:', error)
      }
    }

    if (user?.role === 'CASHIER') {
      fetchMedicines()
    }
  }, [user])



  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id)
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...medicine, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, amount: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const handleCompleteSale = async () => {
    if (cart.length === 0) return

    const saleData = {
      items: cart.map(item => ({
        medicineId: item.id,
        quantity: item.quantity,
      })),
    }

    const result = await createSale(saleData)

    if (result) {
      alert('Sale added successfully!')
      setCart([])
      const updatedMedicines = await getAllmedicines()
      setMedicines(updatedMedicines)
    } else {
      alert('Failed to add sale. Please try again.')
    }
  }

  return (
    <>
      <NavBar />

      <div className="flex h-screen px-6 gap-6 bg-gray-100 pt-20 pb-10">

        {/* LEFT SIDE */}
        <div className="w-2/3 bg-white rounded-xl p-6 shadow flex flex-col">

          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
            {filteredMedicines.map(med => (
              <div
                key={med.id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-48"
              >
                <div>
                  <h3 className="font-semibold text-lg mb-2">{med.name}</h3>
                  <p className="text-sm text-gray-500">Stock: {med.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Expiry: {new Date(med.expiryDate).toLocaleDateString('en-GB')}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="font-medium text-green-700 text-lg">
                    {med.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(med)}
                    className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white font-bold px-2 py-0.5 rounded-lg transition"
                  >
                    <div className="text-2xl">+</div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - CART */}
        <div className="w-1/3 bg-white rounded-xl shadow flex flex-col">

          <div className='flex justify-between bg-[#FBFCFD] p-3 rounded-t-xl'>
            <div className='flex gap-3 items-center'>
              <ShoppingCart className='text-green-600' />
              <h2 className="text-sm font-semibold">Current Order</h2>
            </div>

            <Button className='bg-green-200 rounded-xl'>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 p-6">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center mt-20">Cart is empty</p>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.price} x {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4 p-6">
            <div className="flex justify-between font-bold text-lg ">
              <span>Total:</span>
              <span className='text-green-600'>{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className={`w-full mt-4 py-3 rounded-lg transition
                ${
                  cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              Complete Sale
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
