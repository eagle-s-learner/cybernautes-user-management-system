export default function NotificationPop({
    message,
    onClose,
    setShowNotification,
}: {
    message: string;
    onClose: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<{ notify: boolean; message: string }>>;
}) {
    setTimeout(() => {
        setShowNotification({ notify: false, message: "" });
    }, 5000);
    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-slate-400 mt-2 text-white px-4 py-2 rounded-md shadow-md animate-slide-down">
            <div className="flex items-center">
                <span className="text-red-500">{message}</span>
                <button onClick={onClose} className="ml-4 text-white font-bold">
                    &times;
                </button>
            </div>
        </div>
    );
}