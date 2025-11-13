"use client";
import { Seat } from '@/lib/types';

export default function SeatLayoutEditor({ seats, onChange, onReset }: { seats: Seat[]; onChange: (s: Seat[]) => void; onReset?: () => void; }) {
  const list = Array.isArray(seats) ? seats : [];
  const lower = list.filter(s => s.deck === 'lower');
  const upper = list.filter(s => s.deck === 'upper');

  const toggle = (id: string) => {
    const next = list.map(s => s.id === id ? { ...s, status: s.status === 'available' ? 'sold' : 'available' } : s);
    onChange(next);
  };
  const price = (id: string, value: number) => {
    const next = list.map(s => s.id === id ? { ...s, price: value } : s);
    onChange(next);
  };

  const Section = ({ title, data }: { title: string; data: Seat[] }) => (
    <div className="space-y-2">
      <div className="font-medium">{title} deck</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {data.map(s => (
          <div key={s.id} className="border rounded p-2 bg-white">
            <div className="text-sm font-medium mb-1">{s.id}</div>
            <div className="flex items-center gap-2 mb-2">
              <button type="button" onClick={() => toggle(s.id)} className={`px-2 py-1 rounded text-xs ${s.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {s.status}
              </button>
            </div>
            <div className="text-xs">₹
              <input type="number" className="border rounded px-1 py-0.5 w-20 ml-1" value={s.price} onChange={e => price(s.id, parseInt(e.target.value || '0'))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-3 border rounded p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Seat Layout</div>
        {onReset && <button type="button" className="border rounded px-2 py-1" onClick={onReset}>Reset to default</button>}
      </div>
      <Section title="Lower" data={lower} />
      <Section title="Upper" data={upper} />
    </div>
  );
}
