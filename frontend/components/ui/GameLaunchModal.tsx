'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Play, Monitor, Globe, Zap } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  step: string;
  message: string;
  details?: string;
}

interface GameLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameId: number;
  onLaunchGame: (gameId: number, addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void) => Promise<void>;
}

const STEPS = [
  { id: 'init', icon: Play, title: 'Initializing', description: 'Preparing game session' },
  { id: 'auth', icon: Zap, title: 'Authentication', description: 'Verifying user credentials' },
  { id: 'session', icon: Globe, title: 'Creating Session', description: 'Establishing game session' },
  { id: 'launch', icon: Monitor, title: 'Launching Game', description: 'Opening game window' }
];

export default function GameLaunchModal({ 
  isOpen, 
  onClose, 
  gameTitle, 
  gameId, 
  onLaunchGame 
}: GameLaunchModalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchComplete, setLaunchComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 3
      })
    };
    
    setLogs(prev => [...prev, newLog]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLaunch = useCallback(async () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    setLaunchComplete(false);
    setHasError(false);
    setLogs([]);
    
    // Step 1: Initialize
    setCurrentStep('init');
    addLog({
      type: 'info',
      step: 'Initialize',
      message: 'Starting game launch process',
      details: `Game ID: ${gameId} | Title: ${gameTitle}`
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: Authentication
    setCurrentStep('auth');
    addLog({
      type: 'info',
      step: 'Authentication',
      message: 'Verifying user session and permissions'
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog({
      type: 'success',
      step: 'Authentication',
      message: 'User authentication successful'
    });

    // Step 3: Session Creation
    setCurrentStep('session');
    addLog({
      type: 'info',
      step: 'Session',
      message: 'Creating game session with provider'
    });

    try {
      await onLaunchGame(gameId, addLog);
      
      setCurrentStep('launch');
      setLaunchComplete(true);
      
      addLog({
        type: 'success',
        step: 'Complete',
        message: 'Game launched successfully! 🎉'
      });
      
    } catch (error) {
      setHasError(true);
      setCurrentStep('error');
      
      addLog({
        type: 'error',
        step: 'Error',
        message: 'Failed to launch game',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLaunching(false);
    }
  }, [gameId, gameTitle, isLaunching, onLaunchGame]);

  const resetModal = () => {
    setLogs([]);
    setCurrentStep('');
    setIsLaunching(false);
    setLaunchComplete(false);
    setHasError(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  useEffect(() => {
    if (isOpen && !isLaunching && logs.length === 0) {
      // Auto-launch when modal opens
      setTimeout(() => {
        handleLaunch();
      }, 500);
    }
  }, [isOpen, isLaunching, logs.length, handleLaunch]);

  if (!isOpen) return null;

  const getStepStatus = (stepId: string) => {
    const stepIndex = STEPS.findIndex(s => s.id === stepId);
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    
    if (hasError && stepIndex <= currentIndex) return 'error';
    if (launchComplete && stepIndex <= currentIndex) return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a2c38] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#0f212e]">
          <div>
            <h2 className="text-xl font-bold text-white">Launching Game</h2>
            <p className="text-gray-400 mt-1">{gameTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#0f212e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[60vh]">
          {/* Progress Steps */}
          <div className="w-80 bg-[#0f212e] p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Launch Progress</h3>
            <div className="space-y-4">
              {STEPS.map((step) => {
                const status = getStepStatus(step.id);
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'completed' ? 'bg-green-600' :
                      status === 'active' ? 'bg-blue-600' :
                      status === 'error' ? 'bg-red-600' :
                      'bg-gray-600'
                    }`}>
                      {status === 'active' ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        status === 'completed' || status === 'active' ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Summary */}
            <div className="mt-8 p-4 bg-[#1a2c38] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {launchComplete ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : hasError ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                )}
                <span className="text-sm font-medium text-white">
                  {launchComplete ? 'Launch Complete' : hasError ? 'Launch Failed' : 'Launching...'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {launchComplete ? 'Game session created successfully' : 
                 hasError ? 'Check logs for error details' : 
                 'Please wait while we prepare your game'}
              </p>
            </div>
          </div>

          {/* Live Logs */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[#0f212e]">
              <h3 className="text-sm font-semibold text-white">Live Logs</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-[#0a1520] font-mono text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Initializing launch sequence...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-2 rounded hover:bg-[#0f212e]/50">
                      <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">
                        [{log.timestamp}]
                      </span>
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            log.type === 'success' ? 'bg-green-900/50 text-green-300' :
                            log.type === 'error' ? 'bg-red-900/50 text-red-300' :
                            log.type === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-blue-900/50 text-blue-300'
                          }`}>
                            {log.step}
                          </span>
                          <span className="text-white">{log.message}</span>
                        </div>
                        {log.details && (
                          <p className="text-gray-400 text-xs mt-1 ml-2">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#0f212e]">
          <div className="text-xs text-gray-500">
            Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
          
          <div className="flex gap-3">
            {hasError && (
              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Retry Launch
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-[#0f212e] text-white rounded-lg hover:bg-[#1a2c38] transition-colors"
            >
              {launchComplete ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 