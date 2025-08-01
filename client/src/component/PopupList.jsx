const PopupList = ({ type, onClose, onCancel, changes }) => {
  const filtered = Object.values(changes).filter(c => c.changeType === type);

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-md p-4 z-50 w-96">
      <h2 className="text-lg font-bold mb-2">
        {type === 'add' ? 'Added Products' : 'Entered Products'}
      </h2>
      {filtered.length === 0 ? (
        <p>No products {type === 'add' ? 'added' : 'entered'} yet.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <li key={item._id} className="flex justify-between items-center">
              <span>{item.productName} - Qty: {item.currentQuantity}</span>
              <button onClick={() => onCancel(item._id)} className="text-red-500 text-sm">Cancel</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onClose} className="mt-4 bg-gray-300 px-3 py-1 rounded">Close</button>
    </div>
  );
};

export default PopupList;
