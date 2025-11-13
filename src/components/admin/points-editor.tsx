"use client";
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

export type Point = { id: string; name: string; time: string; address: string };

function toId(name: string, time?: string) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .concat(time ? `-${time.replace(/[^0-9]/g, '')}` : '');
}

type Props = {
  title: string;
  points: Point[];
  onChange: (pts: Point[]) => void;
};

export default function PointsEditor({ title, points, onChange }: Props) {
  const items = useMemo(() => points || [], [points]);

  const add = () => {
    const next = [...items, { id: toId('New Point'), name: '', time: '', address: '' }];
    onChange(next);
  };

  const remove = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    onChange(next);
  };

  const update = (idx: number, patch: Partial<Point>) => {
    const current = items[idx] || { id: '', name: '', time: '', address: '' };
    const name = patch.name ?? current.name;
    const time = patch.time ?? current.time;
    const next = items.map((item, i) => (i === idx ? { ...current, ...patch, id: toId(name, time) } : item));
    onChange(next);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <p className="font-semibold text-slate-900">{title} Points</p>
          <p className="text-xs text-slate-500">Add stops with a name, boarding time, and a short address.</p>
        </div>
        <span className="text-xs text-slate-400">{items.length} total</span>
      </div>

      <div className="space-y-3 pt-3">
        {items.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No points added yet. Use “Add point” to create one.
          </div>
        )}

        {items.map((point, idx) => (
          <div key={point.id || idx} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,3fr)_auto] md:items-center">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Name</label>
                <input
                  value={point.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="eg. Sion, Mumbai"
                  className="h-10 rounded border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Time</label>
                <input
                  value={point.time}
                  onChange={(e) => update(idx, { time: e.target.value })}
                  type="time"
                  step={60}
                  className="h-10 rounded border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Address</label>
                <input
                  value={point.address}
                  onChange={(e) => update(idx, { address: e.target.value })}
                  placeholder="Short address"
                  className="h-10 rounded border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 min-w-[90px] border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
                  onClick={() => remove(idx)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div>
          <Button type="button" variant="outline" onClick={add} className="border-dashed border-rose-300 text-rose-600 hover:bg-rose-50">
            Add point
          </Button>
        </div>
      </div>
    </div>
  );
}
