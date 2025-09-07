import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
  <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30" open={isOpen} onClose={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
    >
      <Dialog.Title className="text-lg font-medium mb-4">Confirm Deletion</Dialog.Title>
      <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded cursor-pointer">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">Delete</button>
      </div>
    </motion.div>
  </Dialog>
);

export default DeleteConfirmationModal;
