export default function VehicleCard({ vehicle, routes, trips, onCardClick }) {
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
        <div
            onClick={() => onCardClick(vehicle)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="mb-3">
                <h3 className="font-bold text-lg text-blue-600">{vehicle.attributes.label || 'N/A'}</h3>
            </div>

            <div className="space-y-2 text-sm">
                {vehicle.relationships?.route?.data?.id && (
                    <div>
                        <span className="font-semibold">Route: </span>
                        <span className="text-blue-600">
                            {routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.short_name ||
                                routes.find((r) => r.id === vehicle.relationships.route.data.id)?.attributes.long_name ||
                                vehicle.relationships.route.data.id}
                        </span>
                    </div>
                )}

                {vehicle.relationships?.trip?.data?.id && (
                    <div>
                        <span className="font-semibold">Trip: </span>
                        <span className="text-green-600">
                            {trips.find((t) => t.id === vehicle.relationships.trip.data.id)?.attributes.headsign ||
                                vehicle.relationships.trip.data.id}
                        </span>
                    </div>
                )}

                <div>
                    <span className="font-semibold">Status: </span>
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            vehicle.attributes.current_status === 'STOPPED_AT'
                                ? 'bg-red-100 text-red-800'
                                : vehicle.attributes.current_status === 'INCOMING_AT'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                        }`}>
                        {getStatusLabel(vehicle.attributes.current_status)}
                    </span>
                </div>

                <div>
                    <span className="font-semibold">Latitude: </span>
                    <span>{vehicle.attributes.latitude?.toFixed(6) || '-'}</span>
                </div>

                <div>
                    <span className="font-semibold">Longitude: </span>
                    <span>{vehicle.attributes.longitude?.toFixed(6) || '-'}</span>
                </div>

                <div>
                    <span className="font-semibold">Update Terakhir: </span>
                    <span className="text-gray-600">{formatDate(vehicle.attributes.updated_at)}</span>
                </div>
            </div>
        </div>
    );
}
