
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

// Inline config to avoid importing src/lib/firebase which triggers database seeding
const firebaseConfig = {
  projectId: 'lodgify-lite-xhtha',
  appId: '1:720826776932:web:cc195257ff975f49788e71',
  storageBucket: 'lodgify-lite-xhtha.firebasestorage.app',
  apiKey: 'AIzaSyADLyfG_gE4mtrE04Sm2Zpx5Nld1fMRG8Y',
  authDomain: 'lodgify-lite-xhtha.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '720826776932',
};

const defaultSeats = [
  { id: 'L1', price: 449, status: 'available', deck: 'lower', row: 1, col: 1 },
  { id: 'L2', price: 0, status: 'sold', deck: 'lower', row: 2, col: 1 },
  { id: 'L3', price: 0, status: 'sold', deck: 'lower', row: 3, col: 1 },
  { id: 'L4', price: 0, status: 'sold', deck: 'lower', row: 4, col: 1 },
  { id: 'L5', price: 820, status: 'available', deck: 'lower', row: 5, col: 1 },
  { id: 'L6', price: 0, status: 'sold', deck: 'lower', row: 1, col: 2 },
  { id: 'L7', price: 0, status: 'sold', deck: 'lower', row: 2, col: 2 },
  { id: 'L8', price: 799, status: 'available', deck: 'lower', row: 3, col: 2 },
  { id: 'L9', price: 799, status: 'available', deck: 'lower', row: 4, col: 2 },
  { id: 'L10', price: 799, status: 'available', deck: 'lower', row: 5, col: 2 },
  { id: 'U1', price: 729, status: 'available', deck: 'upper', row: 1, col: 1 },
  { id: 'U2', price: 729, status: 'available', deck: 'upper', row: 1, col: 2 },
  { id: 'U3', price: 0, status: 'sold', deck: 'upper', row: 2, col: 1 },
  { id: 'U4', price: 0, status: 'sold', deck: 'upper', row: 2, col: 2 },
  { id: 'U5', price: 0, status: 'sold', deck: 'upper', row: 3, col: 1 },
  { id: 'U6', price: 0, status: 'sold', deck: 'upper', row: 3, col: 2 },
  { id: 'U7', price: 689, status: 'available', deck: 'upper', row: 4, col: 1 },
  { id: 'U8', price: 0, status: 'sold', deck: 'upper', row: 5, col: 1 },
  { id: 'U9', price: 0, status: 'sold', deck: 'upper', row: 5, col: 2 },
  { id: 'U10', price: 1029, status: 'available', deck: 'upper', row: 6, col: 1 },
  { id: 'U11', price: 729, status: 'available', deck: 'upper', row: 7, col: 1 },
  { id: 'U12', price: 729, status: 'available', deck: 'upper', row: 7, col: 2 },
  { id: 'U13', price: 779, status: 'available', deck: 'upper', row: 8, col: 1 },
  { id: 'U14', price: 0, status: 'sold', deck: 'upper', row: 9, col: 1 },
  { id: 'U15', price: 0, status: 'sold', deck: 'upper', row: 9, col: 2 },
];

const defaultBoardingPoints = [
  { id: 'sion', name: 'Sion, Mumbai', time: '15:45', address: 'Sion Station, Mumbai 400022' },
  { id: 'dadar', name: 'Dadar, Mumbai', time: '16:00', address: 'Dadar Station East, Mumbai 400014' },
  { id: 'bandra', name: 'Bandra, Mumbai', time: '16:15', address: 'Bandra Station, Mumbai 400050' },
];
const defaultDroppingPoints = [
  { id: 'pune-central', name: 'Pune Central', time: '20:55', address: 'Shivaji Nagar, Pune 411005' },
  { id: 'pune-camp', name: 'Pune Camp', time: '21:05', address: 'Camp, Pune 411001' },
  { id: 'pune-airport', name: 'Pune Airport', time: '21:20', address: 'Lohegaon, Pune 411014' },
];

async function fixBusSeats() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const busesRef = collection(db, 'buses');
  const snapshot = await getDocs(busesRef);
  let updated = 0;
  for (const busDoc of snapshot.docs) {
    const data = busDoc.data();
    const updates: any = {};
    if (!Array.isArray(data.seats) || data.seats.length === 0) {
      updates.seats = defaultSeats;
    }
    if (!Array.isArray(data.boardingPoints) || data.boardingPoints.length === 0) {
      updates.boardingPoints = defaultBoardingPoints;
    }
    if (!Array.isArray(data.droppingPoints) || data.droppingPoints.length === 0) {
      updates.droppingPoints = defaultDroppingPoints;
    }
    if (Object.keys(updates).length) {
      await updateDoc(doc(db, 'buses', busDoc.id), updates);
      updated++;
      console.log(`Updated bus ${busDoc.id} with: ${Object.keys(updates).join(', ')}`);
    }
  }
  console.log(`Done. Updated ${updated} buses.`);
}

fixBusSeats()
  .then(() => process.exit(0))
  .catch((err: any) => { console.error(err); process.exit(1); });
