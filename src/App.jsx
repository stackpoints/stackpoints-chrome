import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import storage from "./utils/chromeStorage";
import PropTypes from "prop-types";

// Constants
const SAVE_MESSAGE_DURATION = 2000;
const INITIAL_STATE = {
  rpcUrl: "https://base-sepolia-rpc.publicnode.com",
  saveStatus: "",
};

// Components
const Header = () => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-800">
      Welcome to StackPoints
    </h1>
  </div>
);

const RpcUrlInput = ({ value, onChange }) => (
  <div className="space-y-2">
    <label
      htmlFor="rpcUrl"
      className="block text-sm font-medium text-gray-700"
    >
      Ethereum Node RPC URL
    </label>
    <input
      id="rpcUrl"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      placeholder="https://..."
    />
  </div>
);

const SaveButton = ({ onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-2 bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Save size={20} />
    {isLoading ? 'Saving...' : 'Save RPC URL'}
  </button>
);

const StatusMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center justify-center">
      <p className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full">
        {message}
      </p>
    </div>
  );
};

// Custom hook for managing RPC URL
const useRpcUrl = () => {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    storage.local.get(["ethRpcUrl"], (result) => {
      if (result.ethRpcUrl) {
        setState(prev => ({ ...prev, rpcUrl: result.ethRpcUrl }));
      }
    });
  }, []);

  const saveRpcUrl = useCallback(async () => {
    try {
      // Save to storage
      await storage.local.set({ ethRpcUrl: state.rpcUrl });

      // Send message to active tab
      const [tab] = await chrome.tabs.query({ 
        active: true, 
        lastFocusedWindow: true 
      });
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        ethRpcUrl: state.rpcUrl,
      });

      setState(prev => ({ ...prev, saveStatus: response }));

      // Clear status after delay
      setTimeout(() => {
        setState(prev => ({ ...prev, saveStatus: "" }));
      }, SAVE_MESSAGE_DURATION);

    } catch (error) {
      console.error('Error saving RPC URL:', error);
      setState(prev => ({ 
        ...prev, 
        saveStatus: "Error saving RPC URL" 
      }));
    }
  }, [state.rpcUrl]);

  const updateRpcUrl = useCallback((newUrl) => {
    setState(prev => ({ ...prev, rpcUrl: newUrl }));
  }, []);

  return {
    rpcUrl: state.rpcUrl,
    saveStatus: state.saveStatus,
    saveRpcUrl,
    updateRpcUrl
  };
};

// Main App Component
function App() {
  const { 
    rpcUrl, 
    saveStatus, 
    saveRpcUrl, 
    updateRpcUrl 
  } = useRpcUrl();

  return (
    <div className="w-[400px] p-8 bg-white">
      <Header />
      
      <div className="space-y-6">
        <RpcUrlInput 
          value={rpcUrl} 
          onChange={updateRpcUrl} 
        />
        
        <SaveButton 
          onClick={saveRpcUrl} 
          isLoading={!!saveStatus}
        />

        <StatusMessage message={saveStatus} />
      </div>
    </div>
  );
}

// PropTypes
RpcUrlInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

StatusMessage.propTypes = {
  message: PropTypes.string
};

export default App;
