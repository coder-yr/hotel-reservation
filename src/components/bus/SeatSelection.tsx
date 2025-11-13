import { Seat } from './Seat';
import { CircleDot } from 'lucide-react';

interface SeatSelectionProps {
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  bus: {
    seats: Array<{
      id: string;
      price: number;
      status: 'available' | 'sold';
      deck: 'lower' | 'upper';
      row: number;
      col: number;
    }>;
  };
}


export function SeatSelection({ selectedSeats, onSeatSelect, bus }: SeatSelectionProps) {
  if (!bus || !Array.isArray(bus.seats)) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 text-center text-gray-500">
        Bus seat data not available.
      </div>
    );
  }

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      onSeatSelect(selectedSeats.filter(id => id !== seatId));
    } else {
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  // Group seats by deck and row for layout
  const lowerDeck = bus.seats.filter(seat => seat.deck === 'lower');
  const upperDeck = bus.seats.filter(seat => seat.deck === 'upper');

  const groupByRow = (seats: typeof bus.seats) => {
    const rows: { [row: number]: typeof bus.seats } = {};
    seats.forEach(seat => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });
    return Object.values(rows);
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Seats</h2>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Lower deck</h3>
            <CircleDot className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-section-background p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              {groupByRow(lowerDeck).map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.id)}
                      onSelect={handleSeatClick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4">Upper deck</h3>

          <div className="bg-section-background p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              {groupByRow(upperDeck).map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-end">
                  {row.map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.id)}
                      onSelect={handleSeatClick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Know your seat types</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Seat Types</span>
            <span className="font-medium">Seater</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600"></span>
            <span className="font-medium">Sleeper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
