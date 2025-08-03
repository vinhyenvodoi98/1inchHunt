import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterCard from './CharacterCard';
import { characterGallery, type Character } from '@/constant/characters';
import { GameStorage } from '@/utils/localStorage';

interface CharacterSelectionModalProps {
  isVisible: boolean;
  onCharacterSelect: (character: Character) => void;
}

export const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
  isVisible,
  onCharacterSelect,
}) => {
  const [selectedCharacter, setSelectedCharacter] = React.useState<Character | null>(null);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleConfirmSelection = () => {
    if (selectedCharacter) {
      // Save character to localStorage
      GameStorage.saveCharacter({
        name: selectedCharacter.name,
        avatar: selectedCharacter.avatar,
        level: 0,
        exp: 0,
        maxExp: 500,
      });
      
      onCharacterSelect(selectedCharacter);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-white mb-4"
            >
              🏰 Choose Your Character
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg"
            >
              Select your hero to begin your 1inchHunt adventure!
            </motion.p>
          </div>

          {/* Character Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {characterGallery.map((character, index) => (
              <motion.div
                key={character.name}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <CharacterCard
                  name={character.name}
                  avatar={character.avatar}
                  level={character.level}
                  experience={character.exp}
                  maxExperience={character.maxExp}
                  onSelect={() => handleCharacterSelect(character)}
                  isSelected={selectedCharacter?.name === character.name}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Selected Character Preview */}
          {selectedCharacter && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/30 rounded-2xl p-6 mb-8 border border-white/20"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedCharacter.avatar}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedCharacter.name}</h3>
                <p className="text-gray-300">Level {selectedCharacter.level} • {selectedCharacter.exp}/{selectedCharacter.maxExp} EXP</p>
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedCharacter.exp / selectedCharacter.maxExp) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirmSelection}
              disabled={!selectedCharacter}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedCharacter
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedCharacter ? '🎯 Start Adventure!' : 'Select a Character'}
            </motion.button>
          </motion.div>

          {/* Background Decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 