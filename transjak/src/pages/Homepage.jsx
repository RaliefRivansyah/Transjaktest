import { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import VehicleDetailModal from '../components/VehicleDetailModal';
import RouteFilter from '../components/RouteFilter';
import TripFilter from '../components/TripFilter';

export default function Homepage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [routes, setRoutes] = useState([]);
    const [trips, setTrips] = useState([]);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState([]);
    const [routesPage, setRoutesPage] = useState(0);
    const [hasMoreRoutes, setHasMoreRoutes] = useState(true);
    const [loadingRoutes, setLoadingRoutes] = useState(false);
    const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
    const [isTripDropdownOpen, setIsTripDropdownOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);


    async function loadData() {
        try {
            setLoading(true);
            const response = await fetch('https://api-v3.mbta.com/vehicles?include=trip,route');
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles');
            }
            const data = await response.json();
            setVehicles(data.data);
            if (data.included) {
                const tripsFromIncluded = data.included.filter((item) => item.type === 'trip');
                setTrips(tripsFromIncluded);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadRoutes() {
        try {
            setLoadingRoutes(true);
            const response = await fetch('https://api-v3.mbta.com/routes?page[limit]=50&page[offset]=0');
            if (!response.ok) {
                throw new Error('Failed to fetch routes');
            }
            const data = await response.json();
            setRoutes(data.data);
            setHasMoreRoutes(data.data.length === 50);
            setRoutesPage(0);
        } catch (err) {
            console.error('Error fetching routes:', err);
        } finally {
            setLoadingRoutes(false);
        }
    }

    useEffect(() => {
        loadData();
        loadRoutes();
    }, []);

    async function fetchMoreRoutes(page) {
        if (loadingRoutes || (!hasMoreRoutes && page > 0)) return;

        try {
            setLoadingRoutes(true);
            const offset = page * 50;
            const response = await fetch(`https://api-v3.mbta.com/routes?page[limit]=50&page[offset]=${offset}`);
            if (!response.ok) {
                throw new Error('Failed to fetch routes');
            }
            const data = await response.json();

            setRoutes((prev) => [...prev, ...data.data]);
            setHasMoreRoutes(data.data.length === 50);
            setRoutesPage(page);
        } catch (err) {
            console.error('Error fetching routes:', err);
        } finally {
            setLoadingRoutes(false);
        }
    }

    function handleRouteScroll(e) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMoreRoutes && !loadingRoutes) {
            fetchMoreRoutes(routesPage + 1);
        }
    }

    const toggleRoute = (routeId) => {
        setSelectedRoutes((prev) => (prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]));
        setCurrentPage(1);
    };

    const toggleTrip = (tripId) => {
        setSelectedTrips((prev) => (prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]));
        setCurrentPage(1);
    };

    const clearRouteFilters = () => {
        setSelectedRoutes([]);
        setCurrentPage(1);
    };

    const clearTripFilters = () => {
        setSelectedTrips([]);
        setCurrentPage(1);
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const routeMatch = selectedRoutes.length === 0 || selectedRoutes.includes(vehicle.relationships?.route?.data?.id);
        const tripMatch = selectedTrips.length === 0 || selectedTrips.includes(vehicle.relationships?.trip?.data?.id);
        return routeMatch && tripMatch;
    });

    const totalItems = filteredVehicles.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const openDetailPopup = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const closeDetailPopup = () => {
        setSelectedVehicle(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Data Kendaraan TransJakarta</h1>

            {/* Filter Section */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Filter Kendaraan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RouteFilter
                        routes={routes}
                        selectedRoutes={selectedRoutes}
                        isOpen={isRouteDropdownOpen}
                        onToggleOpen={() => setIsRouteDropdownOpen(!isRouteDropdownOpen)}
                        onClearFilters={clearRouteFilters}
                        onToggleRoute={toggleRoute}
                        onScroll={handleRouteScroll}
                        loadingRoutes={loadingRoutes}
                        hasMoreRoutes={hasMoreRoutes}
                    />

                    <TripFilter
                        trips={trips}
                        selectedTrips={selectedTrips}
                        isOpen={isTripDropdownOpen}
                        onToggleOpen={() => setIsTripDropdownOpen(!isTripDropdownOpen)}
                        onClearFilters={clearTripFilters}
                        onToggleTrip={toggleTrip}
                    />
                </div>
            </div>

            {/* Pagination Controls - Top */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-gray-700">
                        Menampilkan{' '}
                        <span className="font-semibold">
                            {startIndex + 1}-{endIndex}
                        </span>{' '}
                        dari <span className="font-semibold">{totalItems}</span> Data
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="itemsPerPage" className="text-gray-700">
                            Data per halaman:
                        </label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentVehicles.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        {selectedRoutes.length > 0 || selectedTrips.length > 0
                            ? 'Tidak ada kendaraan yang cocok dengan filter yang dipilih'
                            : 'Tidak ada kendaraan tersedia'}
                    </div>
                ) : (
                    currentVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} routes={routes} trips={trips} onCardClick={openDetailPopup} />
                    ))
                )}
            </div>

            {/* Pagination Navigation - Bottom */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-gray-700">
                        Halaman <span className="font-semibold">{currentPage}</span> dari{' '}
                        <span className="font-semibold">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Pertama">
                            &laquo;
                        </button>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Sebelumnya">
                            &lsaquo;
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`px-3 py-1 rounded border transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'border-gray-300 hover:bg-gray-100'
                                        }`}>
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Selanjutnya">
                            &rsaquo;
                        </button>
                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Terakhir">
                            &raquo;
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Popup Modal */}
            <VehicleDetailModal vehicle={selectedVehicle} routes={routes} trips={trips} onClose={closeDetailPopup} />
        </div>
    );
}
