import { useState, useEffect, createContext, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "success", duration = 2000, title = "", action = null) => {
    // using timestamp as id to ensure unique notification IDs
    const id = Date.now().toString();
    
    setNotifications(prev => [...prev, { id, message, type, duration, title, action }]);
    
    if (duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isExiting: true } 
          : notification
      )
    );
    
    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    }, 150);
  };

  const value = {
    notifications,
    showNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const NotificationContainer = ({ top = 0 }) => {
  const { notifications, removeNotification } = useContext(NotificationContext);
  
  return (
    <div className="absolute left-0 right-0 z-30 w-full" style={{ top }}>
      {notifications.map(notification => (
        <Notification 
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export { NotificationContainer };

const SuccessIcon = () => (
  <div className="flex-shrink-0 w-5 h-5 relative">
    <div className="absolute inset-0 rounded-full border-2 border-green-500 dark:border-green-400"></div>
    <div className="absolute h-2.5 w-1 bg-green-500 dark:bg-green-400 rounded-full" style={{top: '50%', left: '25%', transform: 'translateY(-40%) rotate(45deg)', transformOrigin: 'center'}}></div>
    <div className="absolute h-2.5 w-1 bg-green-500 dark:bg-green-400 rounded-full" style={{top: '45%', right: '25%', transform: 'translateY(-30%) rotate(-45deg)', transformOrigin: 'center'}}></div>
  </div>
);

const ErrorIcon = () => (
  <div className="flex-shrink-0 w-5 h-5 relative">
    <div className="absolute inset-0 rounded-full border-2 border-red-500 dark:border-red-400"></div>
    <div className="absolute h-3 w-1 bg-red-500 dark:bg-red-400 rounded-full" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}></div>
    <div className="absolute h-3 w-1 bg-red-500 dark:bg-red-400 rounded-full" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)'}}></div>
  </div>
);

const Notification = ({ id, message, type, onClose, duration, title, action, isExiting }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(showTimer);
  }, []);
  
  const getIcon = () => {
    switch (type) {
      case "error":
        return <ErrorIcon />;
      case "success":
      default:
        return <SuccessIcon />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return {
          container: "bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800",
          title: "text-red-800 dark:text-red-300",
          message: "text-red-700 dark:text-red-300/90",
          progress: "bg-red-500",
          closeButton: "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/60",
          actionButton: "bg-red-500 hover:bg-red-600 text-white border-transparent"
        };
      case "success":
      default:
        return {
          container: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
          title: "text-green-800 dark:text-green-300",
          message: "text-green-700 dark:text-green-300/90",
          progress: "bg-green-500",
          closeButton: "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800/60",
          actionButton: "bg-green-500 hover:bg-green-600 text-white border-transparent"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`w-full border-t-2 border-blue-400 bg-[#5b97b1] flex items-center px-6 py-3 ${
        isVisible && !isExiting
          ? "translate-y-0 opacity-100" 
          : isExiting
            ? "translate-y-2 opacity-0"
            : "translate-y-4 opacity-0"
      }`}
      style={{ transition: 'all 0.3s', borderRadius: 0, boxShadow: 'none' }}
    >
      <div className="mr-3 flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        {title && (
          <p className="mb-1 text-base font-bold text-white">{title}</p>
        )}
        <p className="text-base font-bold text-white m-0">{message}</p>
        {action && (
          <div className="mt-3">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium border transition-colors bg-white text-primary border-transparent"
              onClick={() => {
                action.onClick();
                if (action.closeOnClick !== false) {
                  onClose();
                }
              }}
            >
              {action.text}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
