import { CardDetails } from './types'

interface CardDetailsFormProps {
  cardDetails: CardDetails
  onCardDetailsChange: (field: keyof CardDetails, value: string) => void
}

export default function CardDetailsForm({ cardDetails, onCardDetailsChange }: CardDetailsFormProps) {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (value: string) => {
    onCardDetailsChange('number', formatCardNumber(value))
  }

  const handleExpiryChange = (value: string) => {
    onCardDetailsChange('expiry', formatExpiry(value))
  }

  const handleCvvChange = (value: string) => {
    onCardDetailsChange('cvv', value.replace(/\D/g, '').slice(0, 4))
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
      <h3 className="text-white font-bold text-lg mb-4">Card Details</h3>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Card Number</label>
        <input
          type="text"
          value={cardDetails.number}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">CVV</label>
          <input
            type="text"
            value={cardDetails.cvv}
            onChange={(e) => handleCvvChange(e.target.value)}
            placeholder="123"
            maxLength={4}
            className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
        <input
          type="text"
          value={cardDetails.name}
          onChange={(e) => onCardDetailsChange('name', e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
        />
      </div>
    </div>
  )
}
