export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 max-w-sm w-full border border-gray-700">
        <p className="text-white font-medium mb-6 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-700 text-gray-400 font-medium py-2.5 rounded-xl hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500/20 text-red-400 border border-red-500/50 font-bold py-2.5 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
