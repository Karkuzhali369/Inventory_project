const Pagination = ({ page, setPage, endPage }) => (
    <div className="flex justify-between mt-6">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-600 hover:bg-blue-800 transition-all text-white rounded disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed">Prev</button>

        <span className="px-4 py-2">Page {page}</span>

        <button onClick={() => setPage(p => p + 1)} disabled={page >= endPage} className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed">
            Next
        </button>
    </div>
);

export default Pagination;
