export default function TripFilter({ trips, selectedTrips, isOpen, onToggleOpen, onClearFilters, onToggleTrip }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter berdasarkan Trip</label>
            <div className="relative">
                <button
                    onClick={onToggleOpen}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="text-gray-700">
                        {selectedTrips.length === 0 ? 'Pilih Trip' : `${selectedTrips.length} Trip dipilih`}
                    </span>
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Pilih Trips (Multiple)</span>
                            {selectedTrips.length > 0 && (
                                <button onClick={onClearFilters} className="text-xs text-blue-600 hover:text-blue-800">
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {trips.length === 0 ? (
                                <div className="text-center py-4 text-sm text-gray-500">Tidak ada trip tersedia</div>
                            ) : (
                                trips.map((trip) => (
                                    <label key={trip.id} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedTrips.includes(trip.id)}
                                            onChange={() => onToggleTrip(trip.id)}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">{trip.attributes.headsign || trip.id}</div>
                                            <div className="text-xs text-gray-500">
                                                {trip.attributes.direction_id === 0 ? 'Outbound' : 'Inbound'}
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {selectedTrips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTrips.map((tripId) => {
                        const trip = trips.find((t) => t.id === tripId);
                        return (
                            <span key={tripId} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {trip?.attributes.headsign || tripId}
                                <button onClick={() => onToggleTrip(tripId)} className="ml-1 text-green-600 hover:text-green-800">
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
