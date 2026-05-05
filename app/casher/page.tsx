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
import { toast } from 'sonner'
// import ProtectedRoute from '@/components/ProtectedRoute'

type CartItem = Medicine & { quantity: number }

export default function PharmacyPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

 

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await getAllmedicines()
        setMedicines(data)
      } catch (error) {
        console.error('Failed to fetch medicines:', error)
      }
    }

      fetchMedicines()
  
  }, [user])



  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (medicine: Medicine) => {
    if (medicine.quantity === 0) {
      toast.error("This medicine is out of stock!")
      return
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id)

      // If already in cart
      if (existing) {
        // Prevent exceeding stock
        if (existing.quantity >= medicine.quantity) {
          toast.error("Cannot add more than available stock!")
          return prev
        }

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
        id: 0,
        saleId: 0,
        medicineId: item.id,
        quantity: item.quantity,
        price: item.price,
        medicine: item,
      })),
    }

    const result = await createSale(saleData)

    if (result) {
      toast.success('Sale added successfully!')
      setCart([])
      const updatedMedicines = await getAllmedicines()
      setMedicines(updatedMedicines)
    } else {
      toast.error('Failed to add sale. Please try again.')
    }
  }

  return (
    <> 

        <div className="fixed top-0 left-0 w-full z-50">
          <NavBar />
        </div>


        <div className="min-h-screen pt-20 pb-6 md:px-10 px-6 bg-gray-100">
          <div className="flex h-screen flex-col lg:flex-row gap-16">

            {/* LEFT SIDE - MEDICINES */}
            <div className="w-full lg:w-2/3 bg-white rounded-xl p-6 shadow flex flex-col">

              <input
                type="text"
                placeholder="Search medicine..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMedicines.map(med => (
                  <div
                    key={med.id}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
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
                        {med.price.toFixed(2)} ETB
                      </p>
                      <button
                        onClick={() => addToCart(med)}
                        className={`font-bold px-3 py-1 rounded-lg transition
                             ${med.quantity === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
                          }
  `}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE - CART */}
            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow flex flex-col">

              <div className='flex justify-between bg-[#FBFCFD] p-4 rounded-t-xl'>
                <div className='flex gap-3 items-center'>
                  <ShoppingCart className='text-green-600' />
                  <h2 className="text-sm font-semibold">Current Order</h2>
                </div>

                <Button className='bg-green-200 rounded-xl'>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-6 max-h-[400px] lg:max-h-none">
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-center mt-10">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.id}
                      className="border p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.price} x {item.quantity}   ETB
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

              <div className="border-t p-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className='text-blue-600'>{total.toFixed(2)} ETB</span>
                </div>

                <button
                  onClick={handleCompleteSale}
                  disabled={cart.length === 0}
                  className={`w-full mt-4 py-3 rounded-lg transition
              ${cart.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  Complete Sale
                </button>
              </div>
            </div>

          </div>
        </div>

    </>
  )
}
