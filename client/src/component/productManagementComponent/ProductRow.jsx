const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="text-center hover:bg-gray-50 transition-all duration-200">
    <td className="py-2 px-4 border-b">{product.code}</td>
    <td className="py-2 px-4 border-b">{product.productName}</td>
    <td className="py-2 px-4 border-b">{product.category}</td>
    <td className="py-2 px-4 border-b">₹{product.price}</td>
    <td className="py-2 px-4 border-b">{product.currentQuantity}&nbsp;{product.unit}</td>
    <td className="py-2 px-4 border-b space-x-2">
      <button onClick={() => onEdit(product)} className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-white py-1 px-3 rounded shadow-md mb-2">Edit</button>
      <button onClick={() => onDelete(product)} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white py-1 px-3 rounded shadow-md">Delete</button>
    </td>
  </tr>
);

export default ProductRow;
