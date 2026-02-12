export default function RouteFilter({
    routes,
    selectedRoutes,
    isOpen,
    onToggleOpen,
    onClearFilters,
    onToggleRoute,
    onScroll,
    loadingRoutes,
    hasMoreRoutes,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter berdasarkan Route</label>
            <div className="relative">
                <button
                    onClick={onToggleOpen}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="text-gray-700">
                        {selectedRoutes.length === 0 ? 'Pilih Route' : `${selectedRoutes.length} Route dipilih`}
                    </span>
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Pilih Routes (Multiple)</span>
                            {selectedRoutes.length > 0 && (
                                <button onClick={onClearFilters} className="text-xs text-blue-600 hover:text-blue-800">
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div onScroll={onScroll} className="max-h-60 overflow-y-auto">
                            {routes.map((route) => (
                                <label key={route.id} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoutes.includes(route.id)}
                                        onChange={() => onToggleRoute(route.id)}
                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {route.attributes.short_name || route.attributes.long_name}
                                        </div>
                                        {route.attributes.short_name && route.attributes.long_name && (
                                            <div className="text-xs text-gray-500">{route.attributes.long_name}</div>
                                        )}
                                    </div>
                                </label>
                            ))}
                            {loadingRoutes && <div className="text-center py-2 text-sm text-gray-500">Loading...</div>}
                            {!hasMoreRoutes && routes.length > 0 && (
                                <div className="text-center py-2 text-xs text-gray-400">Semua route telah dimuat</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {selectedRoutes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRoutes.map((routeId) => {
                        const route = routes.find((r) => r.id === routeId);
                        return (
                            <span key={routeId} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {route?.attributes.short_name || route?.attributes.long_name || routeId}
                                <button onClick={() => onToggleRoute(routeId)} className="ml-1 text-blue-600 hover:text-blue-800">
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
