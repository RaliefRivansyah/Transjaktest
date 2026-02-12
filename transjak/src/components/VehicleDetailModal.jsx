export default function VehicleDetailModal({ vehicle, routes, trips, onClose }) {
    if (!vehicle) return null;

    const getStatusLabel = (status) => {
        const statusMap = {
            IN_TRANSIT_TO: 'Dalam Perjalanan',
            STOPPED_AT: 'Berhenti',
            INCOMING_AT: 'Akan Tiba',
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-2xl font-bold">Detail Kendaraan</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-bold leading-none">
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="border-b pb-4">
                        <h3 className="text-3xl font-bold text-blue-600">{vehicle.attributes.label || 'N/A'}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {vehicle.id}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 uppercase">Status Saat Ini</label>
                        <div className="mt-2">
                            <span
                                className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                                    vehicle.attributes.current_status === 'STOPPED_AT'
                                        ? 'bg-red-100 text-red-800'
                                        : vehicle.attributes.current_status === 'INCOMING_AT'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                }`}>
                                {getStatusLabel(vehicle.attributes.current_status)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <label className="text-sm font-semibold text-gray-600 uppercase">Latitude</label>
                            <p className="text-xl font-bold text-blue-600 mt-1">{vehicle.attributes.latitude?.toFixed(6) || '-'}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <label className="text-sm font-semibold text-gray-600 uppercase">Longitude</label>
                            <p className="text-xl font-bold text-blue-600 mt-1">{vehicle.attributes.longitude?.toFixed(6) || '-'}</p>
                        </div>
                    </div>

                    {vehicle.relationships?.route?.data?.id && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <label className="text-sm font-semibold text-gray-600 uppercase">Route</label>
                            <p className="text-lg font-bold text-purple-600 mt-1">
                                {routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.short_name ||
                                    routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.long_name ||
                                    vehicle.relationships.route.data.id}
                            </p>
                            {routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.long_name &&
                                routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.short_name && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.long_name}
                                    </p>
                                )}
                        </div>
                    )}

                    {vehicle.relationships?.trip?.data?.id && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <label className="text-sm font-semibold text-gray-600 uppercase">Trip</label>
                            <p className="text-lg font-bold text-green-600 mt-1">
                                {trips.find((t) => t.id === vehicle.relationships.trip.data.id)?.attributes.headsign ||
                                    vehicle.relationships.trip.data.id}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span>
                                    <strong>Direction:</strong>{' '}
                                    {trips.find((t) => t.id === vehicle.relationships.trip.data.id)?.attributes.direction_id === 0
                                        ? 'Outbound'
                                        : 'Inbound'}
                                </span>
                                {trips.find((t) => t.id === vehicle.relationships.trip.data.id)?.attributes.name && (
                                    <span>
                                        <strong>Name:</strong>{' '}
                                        {trips.find((t) => t.id === vehicle.relationships.trip.data.id)?.attributes.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 uppercase">Waktu Update Terakhir</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{formatDate(vehicle.attributes.updated_at)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 uppercase mb-3 block">Informasi Tambahan</label>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {vehicle.attributes.bearing && (
                                <div>
                                    <span className="text-gray-600">Bearing:</span>{' '}
                                    <span className="font-semibold">{vehicle.attributes.bearing}°</span>
                                </div>
                            )}
                            {vehicle.attributes.speed && (
                                <div>
                                    <span className="text-gray-600">Speed:</span>{' '}
                                    <span className="font-semibold">{vehicle.attributes.speed} km/h</span>
                                </div>
                            )}
                            {vehicle.attributes.occupancy_status && (
                                <div>
                                    <span className="text-gray-600">Occupancy:</span>{' '}
                                    <span className="font-semibold">{vehicle.attributes.occupancy_status}</span>
                                </div>
                            )}
                            {vehicle.attributes.current_stop_sequence && (
                                <div>
                                    <span className="text-gray-600">Stop Sequence:</span>{' '}
                                    <span className="font-semibold">{vehicle.attributes.current_stop_sequence}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-100 px-6 py-4 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
