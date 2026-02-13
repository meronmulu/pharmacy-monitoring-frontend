'use client'

import { useState, useMemo } from 'react'

type Medicine = {
  id: number
  name: string
  category: string
  price: number
}

type CartItem = Medicine & {
  quantity: number
}

const medicines: Medicine[] = [
  { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 12.5 },
  { id: 2, name: 'Paracetamol 500mg', category: 'Painkiller', price: 5 },
  { id: 3, name: 'Ibuprofen 400mg', category: 'Painkiller', price: 8.25 },
  { id: 4, name: 'Metformin 850mg', category: 'Diabetes', price: 22.1 },
  { id: 5, name: 'Vitamin C 1000mg', category: 'Supplement', price: 12 },
]

export default function PharmacyPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])

  const categories = ['All', ...new Set(medicines.map(m => m.category))]

  const filteredMedicines = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || m.category === category
    return matchSearch && matchCategory
  })

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
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  return (
    <div className="flex h-screen p-6 gap-6 bg-gray-100">
      
      {/* LEFT SIDE */}
      <div className="w-2/3 bg-white rounded-xl p-6 shadow">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                category === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Medicine Cards */}
        <div className="grid grid-cols-3 gap-4">
          {filteredMedicines.map(med => (
            <div
              key={med.id}
              className="border rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-semibold">{med.name}</h3>
              <p className="text-sm text-gray-500">{med.category}</p>
              <p className="text-green-600 font-bold mt-2">
                ${med.price.toFixed(2)}
              </p>

              <button
                onClick={() => addToCart(med)}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CART */}
      <div className="w-1/3 bg-white rounded-xl p-6 shadow flex flex-col">
        <h2 className="text-lg font-bold mb-4">Current Order</h2>

        <div className="flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Cart is empty
            </p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price} x {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  )
}
