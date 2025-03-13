
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SaveIcon, LoaderIcon, Trash2, X } from 'lucide-react';
import useSaveGameManager from '@/hooks/useSaveGameManager';

interface SaveSlot {
  key: string;
  timestamp: string;
  dayCount: number;
  playerCount: number;
}

const SaveLoadMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    saveGame, 
    loadGame, 
    getSaveSlots, 
    deleteSaveSlot,
    saveError,
    loadError,
    saveSuccess,
    loadSuccess
  } = useSaveGameManager();
  
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setSaveSlots(getSaveSlots());
  }, [getSaveSlots, saveSuccess, loadSuccess]);
  
  const handleSave = async () => {
    setIsLoading(true);
    await saveGame();
    setSaveSlots(getSaveSlots());
    setIsLoading(false);
  };
  
  const handleLoad = async (slot: string) => {
    setIsLoading(true);
    const success = await loadGame(slot);
    setIsLoading(false);
    if (success) {
      onClose();
    }
  };
  
  const handleDelete = async (slot: string) => {
    setIsLoading(true);
    if (await deleteSaveSlot(slot)) {
      setSaveSlots(getSaveSlots());
    }
    setIsLoading(false);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <Card className="max-w-md w-full bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
          <CardTitle>Game Saves</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </CardHeader>
        
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-3 flex-1 text-center transition-colors ${activeTab === 'save' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('save')}
          >
            Save Game
          </button>
          <button
            className={`px-4 py-3 flex-1 text-center transition-colors ${activeTab === 'load' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('load')}
          >
            Load Game
          </button>
        </div>
        
        <CardContent className="pt-4">
          {activeTab === 'save' && (
            <div>
              <Button 
                className="w-full mb-4 gap-2" 
                variant="default"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? <LoaderIcon className="animate-spin" size={16} /> : <SaveIcon size={16} />}
                Create New Save
              </Button>
              
              {saveSuccess && (
                <div className="bg-green-900 border border-green-700 p-2 rounded mb-4 text-center text-green-100">
                  Game saved successfully!
                </div>
              )}
              
              {saveError && (
                <div className="bg-red-900 border border-red-700 p-2 rounded mb-4 text-center text-red-100">
                  {saveError}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'load' && (
            <div>
              {loadError && (
                <div className="bg-red-900 border border-red-700 p-2 rounded mb-4 text-center text-red-100">
                  {loadError}
                </div>
              )}
              
              {saveSlots.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  No saved games found
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {saveSlots.map((slot) => (
                    <div 
                      key={slot.key} 
                      className="border border-gray-700 p-3 rounded-md flex justify-between items-center bg-gray-800"
                    >
                      <div>
                        <div className="font-medium text-gray-200">
                          Day {slot.dayCount} - {slot.playerCount} Players
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(slot.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleLoad(slot.key)}
                          disabled={isLoading}
                        >
                          Load
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(slot.key)}
                          disabled={isLoading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-gray-700 pt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SaveLoadMenu;
