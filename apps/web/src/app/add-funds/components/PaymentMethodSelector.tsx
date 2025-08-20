import { PaymentMethod, PaymentMethodType } from './types'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType
  onMethodChange: (method: PaymentMethodType) => void
  paymentMethods?: PaymentMethod[]
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Instant deposit',
    fee: 'Free',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🔵',
    description: 'Secure payment',
    fee: '2.9%',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '₿',
    description: 'Bitcoin/Ethereum',
    fee: '1%',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    description: '2-3 business days',
    fee: 'Free',
  },
]

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-white font-bold text-lg mb-4">Payment Method</h3>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id as PaymentMethodType)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">{method.name}</div>
                  <div className="text-slate-400 text-xs">{method.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 text-xs font-semibold">{method.fee}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
